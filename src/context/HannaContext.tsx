import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { hannaAudio } from '../audio/hannaAudio';
import {
  COLLECTIBLE_CARDS,
  INITIAL_STARTER_CARDS,
  PLAYABLE_CHARACTERS,
} from '../data/hannaData';
import {
  CharacterProfile,
  HannaProgressState,
  HannaScreenId,
  MonsterId,
  PlayableCharacterId,
} from '../types/hanna';

const STORAGE_KEY = 'hanna-pixel-adventure-v1';

const DEFAULT_PROGRESS: HannaProgressState = {
  selectedCharacterId: 'hanna',
  xp: 0,
  level: 1,
  discoveredCardIds: [...INITIAL_STARTER_CARDS],
  unlockedCardIds: [...INITIAL_STARTER_CARDS],
  defeatedMonsterIds: [],
  tttWins: 0,
  tttDraws: 0,
  tttLosses: 0,
  chestOpened: false,
  musicEnabled: true,
  sfxEnabled: true,
};

function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

function loadSavedProgress(): HannaProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<HannaProgressState>;
    const xp = typeof parsed.xp === 'number' ? parsed.xp : 0;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      level: computeLevel(xp),
      discoveredCardIds: Array.isArray(parsed.discoveredCardIds)
        ? Array.from(new Set([...INITIAL_STARTER_CARDS, ...parsed.discoveredCardIds]))
        : [...INITIAL_STARTER_CARDS],
      unlockedCardIds: Array.isArray(parsed.unlockedCardIds)
        ? Array.from(new Set([...INITIAL_STARTER_CARDS, ...parsed.unlockedCardIds]))
        : [...INITIAL_STARTER_CARDS],
      defeatedMonsterIds: Array.isArray(parsed.defeatedMonsterIds)
        ? parsed.defeatedMonsterIds
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

interface HannaContextValue {
  screen: HannaScreenId;
  transitioning: boolean;
  toastText: string | null;
  progress: HannaProgressState;
  selectedCharacter: CharacterProfile;
  secretRoomUnlocked: boolean;
  navigate: (next: HannaScreenId) => void;
  selectCharacter: (id: PlayableCharacterId) => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
  discoverCard: (cardId: string) => void;
  unlockCard: (cardId: string, showNotice?: boolean) => void;
  recordBattleWin: (monsterId: MonsterId, xpReward: number) => void;
  recordTicTacToeResult: (outcome: 'win' | 'draw' | 'loss') => void;
  openSecretChest: () => void;
  resetAdventure: () => void;
}

const HannaContext = createContext<HannaContextValue | null>(null);

export const HannaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [screen, setScreen] = useState<HannaScreenId>('HOME');
  const [transitioning, setTransitioning] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [progress, setProgress] = useState<HannaProgressState>(() =>
    loadSavedProgress()
  );

  useEffect(() => {
    hannaAudio.syncSettings(progress.musicEnabled, progress.sfxEnabled);
  }, [progress.musicEnabled, progress.sfxEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const showToast = useCallback((text: string) => {
    setToastText(text);
    window.setTimeout(() => {
      setToastText((prev) => (prev === text ? null : prev));
    }, 3000);
  }, []);

  const navigate = useCallback(
    (next: HannaScreenId) => {
      hannaAudio.unlockFromUserGesture();
      hannaAudio.playClick();
      if (next === screen) return;
      setTransitioning(true);
      window.setTimeout(() => {
        setScreen(next);
        window.scrollTo({ top: 0, behavior: 'auto' });
        window.setTimeout(() => {
          setTransitioning(false);
        }, 140);
      }, 170);
    },
    [screen]
  );

  const selectCharacter = useCallback(
    (id: PlayableCharacterId) => {
      hannaAudio.unlockFromUserGesture();
      hannaAudio.playSelect();
      const char = PLAYABLE_CHARACTERS.find((c) => c.id === id);
      setProgress((prev) => ({
        ...prev,
        selectedCharacterId: id,
      }));
      if (char) {
        showToast(`SELECTED: ${char.name}!`);
      }
    },
    [showToast]
  );

  const toggleMusic = useCallback(() => {
    hannaAudio.unlockFromUserGesture();
    setProgress((prev) => {
      const next = !prev.musicEnabled;
      hannaAudio.syncSettings(next, prev.sfxEnabled);
      return { ...prev, musicEnabled: next };
    });
  }, []);

  const toggleSfx = useCallback(() => {
    hannaAudio.unlockFromUserGesture();
    setProgress((prev) => {
      const next = !prev.sfxEnabled;
      hannaAudio.syncSettings(prev.musicEnabled, next);
      if (next) hannaAudio.playClick();
      return { ...prev, sfxEnabled: next };
    });
  }, []);

  const discoverCard = useCallback((cardId: string) => {
    setProgress((prev) => {
      if (prev.discoveredCardIds.includes(cardId)) return prev;
      return {
        ...prev,
        discoveredCardIds: [...prev.discoveredCardIds, cardId],
      };
    });
  }, []);

  const unlockCard = useCallback(
    (cardId: string, showNotice = true) => {
      const cardMeta = COLLECTIBLE_CARDS.find((c) => c.id === cardId);
      setProgress((prev) => {
        const already = prev.unlockedCardIds.includes(cardId);
        const nextUnlocked = already
          ? prev.unlockedCardIds
          : [...prev.unlockedCardIds, cardId];
        const nextDiscovered = prev.discoveredCardIds.includes(cardId)
          ? prev.discoveredCardIds
          : [...prev.discoveredCardIds, cardId];
        if (!already && showNotice && cardMeta) {
          showToast(`CARD UNLOCKED: ${cardMeta.name}!`);
        }
        return {
          ...prev,
          unlockedCardIds: nextUnlocked,
          discoveredCardIds: nextDiscovered,
        };
      });
    },
    [showToast]
  );

  const recordBattleWin = useCallback(
    (monsterId: MonsterId, xpReward: number) => {
      setProgress((prev) => {
        const nextXp = prev.xp + xpReward;
        const nextDefeated = prev.defeatedMonsterIds.includes(monsterId)
          ? prev.defeatedMonsterIds
          : [...prev.defeatedMonsterIds, monsterId];
        const nextUnlocked = prev.unlockedCardIds.includes('card-mystery')
          ? prev.unlockedCardIds
          : [...prev.unlockedCardIds, 'card-mystery'];
        const nextDiscovered = prev.discoveredCardIds.includes('card-mystery')
          ? prev.discoveredCardIds
          : [...prev.discoveredCardIds, 'card-mystery'];
        return {
          ...prev,
          xp: nextXp,
          level: computeLevel(nextXp),
          defeatedMonsterIds: nextDefeated,
          unlockedCardIds: nextUnlocked,
          discoveredCardIds: nextDiscovered,
        };
      });
      showToast(`VICTORY! +${xpReward} XP & CARD UNLOCKED!`);
    },
    [showToast]
  );

  const recordTicTacToeResult = useCallback(
    (outcome: 'win' | 'draw' | 'loss') => {
      setProgress((prev) => {
        const gainedXp = outcome === 'win' ? 40 : outcome === 'draw' ? 15 : 5;
        const nextXp = prev.xp + gainedXp;
        const unlockLucky = outcome === 'win';
        const nextUnlocked =
          unlockLucky && !prev.unlockedCardIds.includes('card-lucky')
            ? [...prev.unlockedCardIds, 'card-lucky']
            : prev.unlockedCardIds;
        const nextDiscovered =
          unlockLucky && !prev.discoveredCardIds.includes('card-lucky')
            ? [...prev.discoveredCardIds, 'card-lucky']
            : prev.discoveredCardIds;

        return {
          ...prev,
          xp: nextXp,
          level: computeLevel(nextXp),
          tttWins: prev.tttWins + (outcome === 'win' ? 1 : 0),
          tttDraws: prev.tttDraws + (outcome === 'draw' ? 1 : 0),
          tttLosses: prev.tttLosses + (outcome === 'loss' ? 1 : 0),
          unlockedCardIds: nextUnlocked,
          discoveredCardIds: nextDiscovered,
        };
      });
      if (outcome === 'win') {
        showToast('TIC TAC TOE WIN! +40 XP & LUCKY STAR CARD!');
      }
    },
    [showToast]
  );

  const openSecretChest = useCallback(() => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playChestOpen();
    setProgress((prev) => {
      const nextXp = prev.chestOpened ? prev.xp : prev.xp + 120;
      const nextUnlocked = prev.unlockedCardIds.includes('card-legendary')
        ? prev.unlockedCardIds
        : [...prev.unlockedCardIds, 'card-legendary'];
      const nextDiscovered = prev.discoveredCardIds.includes('card-legendary')
        ? prev.discoveredCardIds
        : [...prev.discoveredCardIds, 'card-legendary'];

      return {
        ...prev,
        chestOpened: true,
        xp: nextXp,
        level: computeLevel(nextXp),
        unlockedCardIds: nextUnlocked,
        discoveredCardIds: nextDiscovered,
      };
    });
    showToast('LEGENDARY FRIEND CARD UNLOCKED!');
  }, [showToast]);

  const resetAdventure = useCallback(() => {
    hannaAudio.playClick();
    setProgress((prev) => ({
      ...DEFAULT_PROGRESS,
      musicEnabled: prev.musicEnabled,
      sfxEnabled: prev.sfxEnabled,
    }));
    navigate('HOME');
  }, [navigate]);

  const selectedCharacter =
    PLAYABLE_CHARACTERS.find((c) => c.id === progress.selectedCharacterId) ??
    PLAYABLE_CHARACTERS[0];

  const secretRoomUnlocked =
    progress.defeatedMonsterIds.length >= 1 && progress.tttWins >= 1;

  return (
    <HannaContext.Provider
      value={{
        screen,
        transitioning,
        toastText,
        progress,
        selectedCharacter,
        secretRoomUnlocked,
        navigate,
        selectCharacter,
        toggleMusic,
        toggleSfx,
        discoverCard,
        unlockCard,
        recordBattleWin,
        recordTicTacToeResult,
        openSecretChest,
        resetAdventure,
      }}
    >
      {children}
    </HannaContext.Provider>
  );
};

export function useHanna(): HannaContextValue {
  const ctx = useContext(HannaContext);
  if (!ctx) throw new Error('useHanna must be used inside HannaProvider');
  return ctx;
}
