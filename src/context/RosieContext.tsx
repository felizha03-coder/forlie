import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { rosieAudio } from '../audio/rosieAudio';
import {
  CharacterId,
  RosieProgress,
  RosieScreen,
  RosieSettings,
  SECRET_ROOM_UNLOCK_LP,
} from '../types/rosie';
import {
  loadRosieProgress,
  loadRosieSettings,
  resetRosieProgress,
  saveRosieProgress,
  saveRosieSettings,
} from '../utils/rosieStorage';

interface ToastNotice {
  id: number;
  text: string;
}

interface RosieContextValue {
  screen: RosieScreen;
  transitioning: boolean;
  navigate: (next: RosieScreen) => void;
  progress: RosieProgress;
  settings: RosieSettings;
  updateSettings: (next: RosieSettings) => void;
  toast: ToastNotice | null;
  selectCharacter: (character: CharacterId) => void;
  markIdCardFlipped: () => void;
  awardLovePoints: (amount: number, label?: string) => void;
  collectHearts: (count: number, bonusLp?: number, label?: string) => void;
  markLetterOpened: (id: string, rewardLp: number) => void;
  saveCustomLetter: (id: string, text: string) => void;
  markCardFlipped: (id: string) => void;
  recordDiscovery: (id: string, rewardLp: number, label: string) => boolean;
  recordGameComplete: (gameId: string, rewardLp: number, label: string) => void;
  recordTicTacToeOutcome: (winner: 'rosie' | 'deloniel' | 'ties') => void;
  resetTicTacToeScores: () => void;
  unlockSecretRoom: () => boolean;
  keepLittleWorldForever: () => void;
  resetAllProgress: () => void;
}

const RosieContext = createContext<RosieContextValue | null>(null);

export const RosieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<RosieScreen>('BOOT');
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState<RosieProgress>(() => loadRosieProgress());
  const [settings, setSettings] = useState<RosieSettings>(() => loadRosieSettings());
  const [toast, setToast] = useState<ToastNotice | null>(null);

  useEffect(() => {
    saveRosieProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveRosieSettings(settings);
    rosieAudio.configure(settings);
  }, [settings]);

  const showToast = useCallback((text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((curr) => (curr && curr.id === id ? null : curr));
    }, 2800);
  }, []);

  const navigate = useCallback((next: RosieScreen) => {
    rosieAudio.unlockFromUserGesture();
    rosieAudio.playClick();
    setTransitioning(true);
    window.setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, []);

  const updateSettings = useCallback((next: RosieSettings) => {
    rosieAudio.unlockFromUserGesture();
    setSettings(next);
  }, []);

  const selectCharacter = useCallback(
    (character: CharacterId) => {
      rosieAudio.unlockFromUserGesture();
      rosieAudio.playCharacterSelect();
      setProgress((prev) => {
        const firstPick = !prev.hiddenDiscoveries.includes(`char-${character}`);
        return {
          ...prev,
          selectedCharacter: character,
          lovePoints: firstPick ? prev.lovePoints + 10 : prev.lovePoints,
          hiddenDiscoveries: firstPick
            ? [...prev.hiddenDiscoveries, `char-${character}`]
            : prev.hiddenDiscoveries,
        };
      });
      showToast(
        character === 'rosie'
          ? 'Active Character: Rosie ♡'
          : 'Active Character: Deloniel ★'
      );
    },
    [showToast]
  );

  const markIdCardFlipped = useCallback(() => {
    rosieAudio.unlockFromUserGesture();
    rosieAudio.playCardFlip();
    setProgress((prev) => {
      if (prev.idCardFlipped) return prev;
      showToast('+15 LP · Rosie ID Card Inspected ♡');
      return {
        ...prev,
        idCardFlipped: true,
        lovePoints: prev.lovePoints + 15,
        hearts: prev.hearts + 1,
      };
    });
  }, [showToast]);

  const awardLovePoints = useCallback(
    (amount: number, label?: string) => {
      if (amount <= 0) return;
      rosieAudio.playNotification();
      setProgress((prev) => ({
        ...prev,
        lovePoints: prev.lovePoints + amount,
      }));
      if (label) {
        showToast(`+${amount} LP · ${label}`);
      }
    },
    [showToast]
  );

  const collectHearts = useCallback(
    (count: number, bonusLp = 0, label?: string) => {
      rosieAudio.unlockFromUserGesture();
      rosieAudio.playHeartCollect();
      setProgress((prev) => ({
        ...prev,
        hearts: prev.hearts + count,
        lovePoints: prev.lovePoints + bonusLp,
      }));
      if (label) {
        showToast(label);
      }
    },
    [showToast]
  );

  const markLetterOpened = useCallback(
    (id: string, rewardLp: number) => {
      rosieAudio.unlockFromUserGesture();
      rosieAudio.playEnvelopeOpen();
      setProgress((prev) => {
        if (prev.openedLetters.includes(id)) return prev;
        showToast(`+${rewardLp} LP · Special Note Read ♡`);
        return {
          ...prev,
          lovePoints: prev.lovePoints + rewardLp,
          hearts: prev.hearts + 2,
          openedLetters: [...prev.openedLetters, id],
        };
      });
    },
    [showToast]
  );

  const saveCustomLetter = useCallback(
    (id: string, text: string) => {
      rosieAudio.playNotification();
      setProgress((prev) => ({
        ...prev,
        customLetters: { ...prev.customLetters, [id]: text },
      }));
      showToast('Custom note saved ♡');
    },
    [showToast]
  );

  const markCardFlipped = useCallback(
    (id: string) => {
      rosieAudio.unlockFromUserGesture();
      rosieAudio.playCardFlip();
      setProgress((prev) => {
        if (prev.flippedCards.includes(id)) return prev;
        showToast('+15 LP · Card Inspected ♡');
        return {
          ...prev,
          lovePoints: prev.lovePoints + 15,
          hearts: prev.hearts + 1,
          flippedCards: [...prev.flippedCards, id],
        };
      });
    },
    [showToast]
  );

  const recordDiscovery = useCallback(
    (id: string, rewardLp: number, label: string): boolean => {
      rosieAudio.unlockFromUserGesture();
      let isFirstTime = false;
      setProgress((prev) => {
        if (prev.hiddenDiscoveries.includes(id)) {
          return {
            ...prev,
            hearts: prev.hearts + 1,
          };
        }
        isFirstTime = true;
        return {
          ...prev,
          lovePoints: prev.lovePoints + rewardLp,
          hearts: prev.hearts + 3,
          hiddenDiscoveries: [...prev.hiddenDiscoveries, id],
        };
      });
      rosieAudio.playHeartCollect();
      showToast(isFirstTime ? `+${rewardLp} LP · ${label}` : `+1 Heart · ${label}`);
      return isFirstTime;
    },
    [showToast]
  );

  const recordGameComplete = useCallback(
    (gameId: string, rewardLp: number, label: string) => {
      rosieAudio.playVictory();
      setProgress((prev) => {
        const firstClear = !prev.completedGames.includes(gameId);
        const granted = firstClear ? rewardLp : Math.max(5, Math.floor(rewardLp / 3));
        showToast(`+${granted} LP · ${label}`);
        return {
          ...prev,
          lovePoints: prev.lovePoints + granted,
          hearts: prev.hearts + 3,
          completedGames: firstClear
            ? [...prev.completedGames, gameId]
            : prev.completedGames,
        };
      });
    },
    [showToast]
  );

  const recordTicTacToeOutcome = useCallback(
    (winner: 'rosie' | 'deloniel' | 'ties') => {
      setProgress((prev) => ({
        ...prev,
        ticTacToeScores: {
          ...prev.ticTacToeScores,
          [winner]: prev.ticTacToeScores[winner] + 1,
        },
      }));
    },
    []
  );

  const resetTicTacToeScores = useCallback(() => {
    rosieAudio.playClick();
    setProgress((prev) => ({
      ...prev,
      ticTacToeScores: { rosie: 0, deloniel: 0, ties: 0 },
    }));
    showToast('Tic Tac Toe scores reset');
  }, [showToast]);

  const unlockSecretRoom = useCallback((): boolean => {
    if (progress.lovePoints < SECRET_ROOM_UNLOCK_LP && !progress.secretRoomUnlocked) {
      return false;
    }
    rosieAudio.playSecretUnlock();
    setProgress((prev) => ({
      ...prev,
      secretRoomUnlocked: true,
    }));
    showToast('Secret Room Unlocked! ♡');
    return true;
  }, [progress.lovePoints, progress.secretRoomUnlocked, showToast]);

  const keepLittleWorldForever = useCallback(() => {
    rosieAudio.playVictory();
    setProgress((prev) => ({
      ...prev,
      keptForever: true,
      secretRoomUnlocked: true,
    }));
    setScreen('FINAL_LOVE');
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = resetRosieProgress();
    setProgress(fresh);
    showToast('Progress reset to a fresh start ♡');
  }, [showToast]);

  return (
    <RosieContext.Provider
      value={{
        screen,
        transitioning,
        navigate,
        progress,
        settings,
        updateSettings,
        toast,
        selectCharacter,
        markIdCardFlipped,
        awardLovePoints,
        collectHearts,
        markLetterOpened,
        saveCustomLetter,
        markCardFlipped,
        recordDiscovery,
        recordGameComplete,
        recordTicTacToeOutcome,
        resetTicTacToeScores,
        unlockSecretRoom,
        keepLittleWorldForever,
        resetAllProgress,
      }}
    >
      {children}
    </RosieContext.Provider>
  );
};

export function useRosie(): RosieContextValue {
  const ctx = useContext(RosieContext);
  if (!ctx) throw new Error('useRosie must be used within RosieProvider');
  return ctx;
}
