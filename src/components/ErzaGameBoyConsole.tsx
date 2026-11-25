import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Power, Volume2, VolumeX } from 'lucide-react';
import { erzaAudio } from '../audio/erzaAudio';
import { ERZA_INITIAL_SOUNDTRACK, KONAMI_SEQUENCE } from '../data/erzaData';
import {
  ErzaAchievementScreen,
  ErzaFinaleScreen,
  ErzaSecretScreen,
  ErzaSettingsScreen,
} from '../screens/erza/ErzaExtraScreens';
import { ErzaFriendNoteScreen } from '../screens/erza/ErzaFriendNoteScreen';
import { ErzaLcdHome, MENU_CARTRIDGES } from '../screens/erza/ErzaLcdHome';
import { ErzaMiniGamesScreen } from '../screens/erza/ErzaMiniGamesScreen';
import { ErzaRemindersScreen } from '../screens/erza/ErzaRemindersScreen';
import { ErzaSoundtrackScreen } from '../screens/erza/ErzaSoundtrackScreen';
import {
  ConsoleAppScreen,
  ConsoleButton,
  ConsoleLockState,
  DirectionInput,
  MiniGameId,
  PersistedErzaState,
  SoundtrackItem,
  ThemeMode,
} from '../types/erza';
import { loadErzaState, saveErzaState } from '../utils/erzaStorage';
import { PixelCloud, PixelSmiley, PixelStar } from './ErzaPixelArt';
import { ThreeHolographicCard } from './ThreeHolographicCard';

const LOADING_MESSAGES = [
  'CHECKING MEMORY...',
  'LOADING GAME DATA...',
  'PREPARING YOUR ADVENTURE...',
  'PLAYER 1 READY!',
];

interface ErzaGameBoyConsoleProps {
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
}

export const ErzaGameBoyConsole: React.FC<ErzaGameBoyConsoleProps> = ({
  themeMode,
  onChangeThemeMode,
}) => {
  const [persisted, setPersisted] = useState<PersistedErzaState>(() => {
    const loaded = loadErzaState();
    erzaAudio.syncPreferences({
      volume: loaded.masterVolume,
      muted: loaded.muted,
      buttonSfxEnabled: loaded.buttonSfxEnabled,
      gameSfxEnabled: loaded.gameSfxEnabled,
    });
    return loaded;
  });

  const [lockState, setLockState] = useState<ConsoleLockState>('LOCKED');
  const [poweredOn, setPoweredOn] = useState(true);
  const [ejectedBanner, setEjectedBanner] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [lockedShake, setLockedShake] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState(false);
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  const [appScreen, setAppScreen] = useState<ConsoleAppScreen>('HOME');
  const [homeIndex, setHomeIndex] = useState(0);
  const [activeGameId, setActiveGameId] = useState<MiniGameId>('MENU');

  const [pressedBtn, setPressedBtn] = useState<ConsoleButton | null>(null);
  const [navSignal, setNavSignal] = useState<{ dir: DirectionInput; tick: number } | null>(null);
  const [confirmTrigger, setConfirmTrigger] = useState(0);

  // Persistent background soundtrack state (stays active across all screens)
  const [tracks, setTracks] = useState<SoundtrackItem[]>(() => ERZA_INITIAL_SOUNDTRACK);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicShuffle, setMusicShuffle] = useState(false);
  const [musicRepeat, setMusicRepeat] = useState(true);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>(() =>
    Object.fromEntries(ERZA_INITIAL_SOUNDTRACK.map((t) => [t.audioSrc, t.durationSec]))
  );

  const consoleShellRef = useRef<HTMLDivElement | null>(null);
  const heldDirectionRef = useRef<DirectionInput | null>(null);
  const konamiBufferRef = useRef<ConsoleButton[]>([]);
  const navTickRef = useRef(1);
  const tracksRef = useRef(tracks);
  const trackIdxRef = useRef(trackIdx);
  const isMusicPlayingRef = useRef(isMusicPlaying);
  const musicShuffleRef = useRef(musicShuffle);
  const musicRepeatRef = useRef(musicRepeat);
  const userPausedMusicRef = useRef(false);

  tracksRef.current = tracks;
  trackIdxRef.current = trackIdx;
  isMusicPlayingRef.current = isMusicPlaying;
  musicShuffleRef.current = musicShuffle;
  musicRepeatRef.current = musicRepeat;

  const isNight = themeMode === 'NIGHT' || true;

  const updatePersisted = useCallback(
    (
      updater:
        | Partial<PersistedErzaState>
        | ((prev: PersistedErzaState) => PersistedErzaState)
    ) => {
      setPersisted((prev) => {
        const next =
          typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        saveErzaState(next);
        erzaAudio.syncPreferences({
          volume: next.masterVolume,
          muted: next.muted,
          buttonSfxEnabled: next.buttonSfxEnabled,
          gameSfxEnabled: next.gameSfxEnabled,
        });
        return next;
      });
    },
    []
  );

  // Subtle GSAP entrance for 3D-styled handheld console
  useEffect(() => {
    if (!consoleShellRef.current) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.fromTo(
      consoleShellRef.current,
      { y: 24, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }
    );
  }, []);

  const advanceNextTrack = useCallback((keepPlaying: boolean) => {
    const list = tracksRef.current;
    const curr = trackIdxRef.current;
    let next = (curr + 1) % list.length;
    if (musicShuffleRef.current && list.length > 1) {
      let rand = Math.floor(Math.random() * list.length);
      if (rand === curr) rand = (curr + 1) % list.length;
      next = rand;
    }
    setTrackIdx(next);
    setIsMusicPlaying(keepPlaying);
    if (keepPlaying) {
      void erzaAudio.loadAndPlayAudio(list[next].audioSrc, 0).then((ok) => {
        if (!ok) setIsMusicPlaying(false);
      });
    } else {
      erzaAudio.stopAudio();
      erzaAudio.preloadTrackMetadata(list[next].audioSrc);
    }
  }, []);

  useEffect(() => {
    erzaAudio.setAudioCallbacks({
      onEnded: () => {
        if (musicRepeatRef.current) {
          const track = tracksRef.current[trackIdxRef.current];
          void erzaAudio.loadAndPlayAudio(track.audioSrc, 0).then((ok) => {
            if (!ok) setIsMusicPlaying(false);
          });
        } else if (tracksRef.current.length > 1) {
          advanceNextTrack(true);
        } else {
          setIsMusicPlaying(false);
        }
      },
      onLoadedMetadata: (src, durationSec) => {
        setTrackDurations((prev) => ({
          ...prev,
          [src]: durationSec,
        }));
      },
    });

    erzaAudio.preloadTrackMetadata(ERZA_INITIAL_SOUNDTRACK[0].audioSrc);

    return () => {
      erzaAudio.setAudioCallbacks({});
      erzaAudio.stopAudio();
    };
  }, [advanceNextTrack]);

  const startMusicIfAllowed = useCallback(() => {
    if (userPausedMusicRef.current || isMusicPlayingRef.current) return;
    const track = tracksRef.current[trackIdxRef.current] ?? tracksRef.current[0];
    if (!track) return;
    const state = erzaAudio.getAudioState();
    const resumeAt = state.src === track.audioSrc ? state.currentTime : 0;
    setIsMusicPlaying(true);
    void erzaAudio.loadAndPlayAudio(track.audioSrc, resumeAt).then((ok) => {
      if (!ok) setIsMusicPlaying(false);
    });
  }, []);

  const handleTogglePlayMusic = useCallback(() => {
    erzaAudio.playClick();
    const next = !isMusicPlayingRef.current;
    const track = tracksRef.current[trackIdxRef.current] ?? tracksRef.current[0];
    setIsMusicPlaying(next);
    if (next) {
      userPausedMusicRef.current = false;
      const state = erzaAudio.getAudioState();
      const resumeAt = state.src === track.audioSrc ? state.currentTime : 0;
      void erzaAudio.loadAndPlayAudio(track.audioSrc, resumeAt).then((ok) => {
        if (!ok) setIsMusicPlaying(false);
      });
    } else {
      userPausedMusicRef.current = true;
      erzaAudio.pauseAudio();
    }
  }, []);

  const handleNextTrack = useCallback(() => {
    erzaAudio.playClick();
    if (tracksRef.current.length === 1) {
      erzaAudio.seekAudio(0);
      if (isMusicPlayingRef.current) {
        void erzaAudio.loadAndPlayAudio(tracksRef.current[0].audioSrc, 0);
      }
      return;
    }
    advanceNextTrack(isMusicPlayingRef.current);
  }, [advanceNextTrack]);

  const handlePrevTrack = useCallback(() => {
    erzaAudio.playClick();
    const state = erzaAudio.getAudioState();
    if (state.currentTime > 3 || tracksRef.current.length === 1) {
      erzaAudio.seekAudio(0);
      return;
    }
    const prevIdx =
      (trackIdxRef.current - 1 + tracksRef.current.length) % tracksRef.current.length;
    const prevTrack = tracksRef.current[prevIdx];
    setTrackIdx(prevIdx);
    if (isMusicPlayingRef.current) {
      void erzaAudio.loadAndPlayAudio(prevTrack.audioSrc, 0);
    } else {
      erzaAudio.stopAudio();
      erzaAudio.preloadTrackMetadata(prevTrack.audioSrc);
    }
  }, []);

  const handleSelectTrack = useCallback((idx: number) => {
    erzaAudio.playClick();
    const list = tracksRef.current;
    const target = list[idx];
    if (!target) return;
    userPausedMusicRef.current = false;
    setTrackIdx(idx);
    setIsMusicPlaying(true);
    void erzaAudio.loadAndPlayAudio(target.audioSrc, 0).then((ok) => {
      if (!ok) setIsMusicPlaying(false);
    });
  }, []);

  const handleUploadTrack = useCallback((customTrack: SoundtrackItem) => {
    userPausedMusicRef.current = false;
    setTracks((prev) => {
      const next = [...prev, customTrack];
      setTrackIdx(next.length - 1);
      return next;
    });
    setIsMusicPlaying(true);
    void erzaAudio.loadAndPlayAudio(customTrack.audioSrc, 0).then((ok) => {
      if (!ok) setIsMusicPlaying(false);
    });
  }, []);

  /* ---------------- SD CARD INSERTION & LOADING SEQUENCE ---------------- */
  const triggerInsertSd = useCallback(() => {
    if (lockState !== 'LOCKED') return;
    setPoweredOn(true);
    setEjectedBanner(false);
    userPausedMusicRef.current = false;
    erzaAudio.primeAudio(tracksRef.current[trackIdxRef.current]?.audioSrc);
    erzaAudio.playSdInsert();
    setLockState('INSERTING');

    window.setTimeout(() => {
      setLockState('LOADING');
      setLoadingStep(0);
      setLoadingProgress(20);
      erzaAudio.playPowerOn();
    }, 820);
  }, [lockState]);

  useEffect(() => {
    if (lockState !== 'LOADING') return;

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        setLoadingStep(0);
        setLoadingProgress(28);
      }, 150)
    );
    timers.push(
      window.setTimeout(() => {
        setLoadingStep(1);
        setLoadingProgress(56);
        erzaAudio.playNav();
      }, 720)
    );
    timers.push(
      window.setTimeout(() => {
        setLoadingStep(2);
        setLoadingProgress(84);
        erzaAudio.playNav();
      }, 1350)
    );
    timers.push(
      window.setTimeout(() => {
        setLoadingStep(3);
        setLoadingProgress(100);
        erzaAudio.playGameWin();
      }, 1980)
    );
    timers.push(
      window.setTimeout(() => {
        setLockState('READY_FLASH');
      }, 2550)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [lockState]);

  useEffect(() => {
    if (lockState !== 'READY_FLASH') return;
    const t = window.setTimeout(() => {
      setLockState('UNLOCKED');
      setAppScreen('HOME');
      setWelcomeBanner('PLAYER 1 READY!');
      updatePersisted((prev) => ({ ...prev, sdInserted: true }));
      startMusicIfAllowed();
      window.setTimeout(() => setWelcomeBanner(null), 4200);
    }, 1500);
    return () => window.clearTimeout(t);
  }, [lockState, updatePersisted, startMusicIfAllowed]);

  const handleEjectSd = () => {
    if (lockState !== 'UNLOCKED') return;
    erzaAudio.stopAudio();
    setIsMusicPlaying(false);
    erzaAudio.playSdEject();
    setEjectedBanner(true);
    setAppScreen('HOME');
    setActiveGameId('MENU');
    setLockState('LOCKED');
  };

  const handlePowerToggle = () => {
    if (!poweredOn) {
      setPoweredOn(true);
      erzaAudio.playPowerOn();
      if (lockState === 'UNLOCKED') {
        startMusicIfAllowed();
      }
    } else {
      erzaAudio.stopAudio();
      setIsMusicPlaying(false);
      erzaAudio.playPowerOff();
      setPoweredOn(false);
    }
  };

  const handleToggleTheme = useCallback(() => {
    erzaAudio.playClick();
    onChangeThemeMode('NIGHT');
    if (lockState === 'UNLOCKED' && poweredOn) {
      setAppScreen((prev) => (prev === 'SETTINGS' ? 'HOME' : 'SETTINGS'));
    }
  }, [lockState, poweredOn, onChangeThemeMode]);

  /* ---------------- KONAMI & CONSOLE HARDWARE INPUTS ---------------- */
  const registerKonami = useCallback(
    (btn: ConsoleButton) => {
      if (lockState !== 'UNLOCKED' || !poweredOn) return;
      const buf = [...konamiBufferRef.current, btn].slice(-KONAMI_SEQUENCE.length);
      konamiBufferRef.current = buf;
      if (
        buf.length === KONAMI_SEQUENCE.length &&
        buf.every((b, idx) => b === KONAMI_SEQUENCE[idx])
      ) {
        konamiBufferRef.current = [];
        erzaAudio.playSecretUnlock();
        setAppScreen('SECRET');
        updatePersisted((prev) => ({
          ...prev,
          secretFound: true,
          certifiedFriendBadge: true,
        }));
      }
    },
    [lockState, poweredOn, updatePersisted]
  );

  const flashPressed = (btn: ConsoleButton) => {
    setPressedBtn(btn);
    window.setTimeout(() => {
      setPressedBtn((curr) => (curr === btn ? null : curr));
    }, 130);
  };

  const handleBackAction = useCallback(() => {
    if (lockState !== 'UNLOCKED' || !poweredOn) return;
    erzaAudio.playBack();
    if (appScreen === 'GAMES' && activeGameId !== 'MENU') {
      setActiveGameId('MENU');
      return;
    }
    if (appScreen !== 'HOME') {
      setAppScreen('HOME');
    }
  }, [lockState, poweredOn, appScreen, activeGameId]);

  const handleConsoleButton = useCallback(
    (btn: ConsoleButton) => {
      flashPressed(btn);

      if (!poweredOn) {
        if (btn === 'START' || btn === 'A') {
          setPoweredOn(true);
          erzaAudio.playPowerOn();
          if (lockState === 'UNLOCKED') {
            startMusicIfAllowed();
          }
        }
        return;
      }

      if (lockState !== 'UNLOCKED') {
        if (btn === 'START' || btn === 'A') {
          if (lockState === 'LOCKED') triggerInsertSd();
          return;
        }
        if (btn === 'SELECT') {
          handleToggleTheme();
          return;
        }
        erzaAudio.playClick();
        setLockedShake(true);
        window.setTimeout(() => setLockedShake(false), 380);
        return;
      }

      registerKonami(btn);

      if (btn === 'UP' || btn === 'DOWN' || btn === 'LEFT' || btn === 'RIGHT') {
        if (appScreen === 'HOME') {
          erzaAudio.playNav();
          setHomeIndex((prev) => {
            if (btn === 'DOWN' || btn === 'RIGHT') return (prev + 1) % 4;
            return (prev + 3) % 4;
          });
        } else {
          setNavSignal({ dir: btn, tick: navTickRef.current++ });
        }
        return;
      }

      if (btn === 'A') {
        if (appScreen === 'HOME') {
          erzaAudio.playConfirm();
          const target = MENU_CARTRIDGES[homeIndex].id;
          setAppScreen(target);
          startMusicIfAllowed();
        } else {
          setConfirmTrigger((c) => c + 1);
        }
        return;
      }

      if (btn === 'B') {
        handleBackAction();
        return;
      }

      if (btn === 'START') {
        erzaAudio.playConfirm();
        setActiveGameId('MENU');
        setAppScreen('HOME');
        return;
      }

      if (btn === 'SELECT') {
        handleToggleTheme();
      }
    },
    [
      poweredOn,
      lockState,
      appScreen,
      homeIndex,
      triggerInsertSd,
      handleToggleTheme,
      registerKonami,
      handleBackAction,
      startMusicIfAllowed,
    ]
  );

  /* ---------------- KEYBOARD CONTROLS ---------------- */
  useEffect(() => {
    const mapKeyToDir = (key: string): DirectionInput | null => {
      if (key === 'ArrowUp') return 'UP';
      if (key === 'ArrowDown') return 'DOWN';
      if (key === 'ArrowLeft') return 'LEFT';
      if (key === 'ArrowRight') return 'RIGHT';
      return null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const dir = mapKeyToDir(e.key);
      if (dir) {
        e.preventDefault();
        heldDirectionRef.current = dir;
        if (!e.repeat) {
          handleConsoleButton(dir);
        }
        return;
      }

      if (e.repeat) return;
      const lower = e.key.toLowerCase();

      if (e.key === 'Enter' || e.key === ' ' || lower === 'a') {
        e.preventDefault();
        handleConsoleButton('A');
      } else if (e.key === 'Escape' || e.key === 'Backspace' || lower === 'b') {
        e.preventDefault();
        handleConsoleButton('B');
      } else if (e.key === 'Shift') {
        handleConsoleButton('SELECT');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const dir = mapKeyToDir(e.key);
      if (dir && heldDirectionRef.current === dir) {
        heldDirectionRef.current = null;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleConsoleButton]);

  const toggleMute = () => {
    const next = !persisted.muted;
    updatePersisted({ muted: next });
    if (!next) erzaAudio.playClick();
  };

  const dpadPointerStart = (dir: DirectionInput) => {
    heldDirectionRef.current = dir;
    handleConsoleButton(dir);
  };

  const dpadPointerEnd = () => {
    heldDirectionRef.current = null;
  };

  const lcdClass = !poweredOn || lockState !== 'UNLOCKED'
    ? 'gb-lcd-off'
    : isNight
    ? 'gb-lcd-night'
    : 'gb-lcd-day';

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-3 py-5 sm:py-7 select-none">
      {/* Top Header */}
      <header className="text-center mb-3 sm:mb-4 max-w-2xl">
        {lockState === 'LOCKED' || lockState === 'INSERTING' ? (
          <>
            <div className="inline-flex items-center gap-2 mb-1">
              <PixelStar size={18} color={isNight ? '#D9A0A9' : '#F5E9E6'} />
              <h1
                className={`font-pixel text-sm sm:text-lg tracking-wide ${
                  isNight
                    ? 'text-[#F5E9E6] drop-shadow-[0_3px_0_#190D13]'
                    : 'text-[#F5E9E6] drop-shadow-[0_3px_0_#4A101F]'
                }`}
              >
                HEY, AUCLAIR!
              </h1>
              <PixelStar size={18} color={isNight ? '#D9A0A9' : '#F5E9E6'} />
            </div>
            <p
              className={`font-pixel text-[9px] sm:text-[10px] tracking-wider ${
                isNight ? 'text-[#D8C4C1]' : 'text-[#D8C4C1]'
              }`}
            >
              YOUR ADVENTURE STARTS HERE.
            </p>
          </>
        ) : (
          <>
            <h1
              className={`font-pixel text-sm sm:text-lg tracking-wide ${
                isNight
                  ? 'text-[#F5E9E6] drop-shadow-[0_3px_0_#190D13]'
                  : 'text-[#F5E9E6] drop-shadow-[0_3px_0_#4A101F]'
              }`}
            >
              AUCLAIR&apos;S LITTLE GAME BOY
            </h1>
            <p
              className={`mt-1 font-silk text-[10px] sm:text-xs font-bold tracking-wide ${
                isNight ? 'text-[#D8C4C1]' : 'text-[#D8C4C1]'
              }`}
            >
              A LITTLE GAME, A LITTLE MUSIC, AND A WHOLE LOT OF FRIENDSHIP.
            </p>
          </>
        )}
      </header>

      {/* Centerpiece Physical 3D-Styled Game Boy Console */}
      <main
        ref={consoleShellRef}
        onDragOver={(e) => {
          if (lockState === 'LOCKED') {
            e.preventDefault();
            setDragOverSlot(true);
          }
        }}
        onDragLeave={() => setDragOverSlot(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverSlot(false);
          if (lockState === 'LOCKED') triggerInsertSd();
        }}
        className={`relative w-full max-w-[440px] sm:max-w-[480px] transition-transform duration-200 ${
          lockedShake ? 'animate-capsule-shake' : ''
        }`}
      >
        {/* Top Protruding Cartridge Tab */}
        <div className="flex justify-center -mb-2 relative z-0">
          {lockState === 'UNLOCKED' ? (
            <button
              type="button"
              onClick={handleEjectSd}
              title="Safely eject memory card"
              className="px-5 py-1.5 rounded-t-xl bg-gradient-to-b from-[#F5E9E6] to-[#D8C4C1] border-2 border-b-0 border-[#4A101F] text-[#4A101F] font-pixel text-[7px] shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              OPEN ▶ EJECT CARD
            </button>
          ) : (
            <div className="px-5 py-1 rounded-t-xl bg-[#D8C4C1]/85 border-2 border-b-0 border-[#800F2F] text-[#4A101F] font-pixel text-[6.5px]">
              GAME SLOT
            </div>
          )}
        </div>

        {/* Left Side Rotary Detail Knob (Sound & Display Shortcut) */}
        <button
          type="button"
          onClick={handleToggleTheme}
          title="Sound & Display Settings"
          aria-label="Open Sound and Display Settings"
          className="hidden sm:flex absolute -left-3.5 top-48 z-0 w-4 h-12 rounded-l-lg bg-gradient-to-b from-[#F5E9E6] to-[#D8C4C1] border-2 border-r-0 border-[#4A101F] shadow-md items-center justify-center cursor-pointer hover:-translate-x-0.5 transition-transform"
        >
          <span className="w-1 h-6 rounded-full bg-[#4A101F]/70" />
        </button>

        {/* Right Side Functional SD Memory Card Slot (Glows on Drag Near) */}
        <div
          className={`hidden sm:flex absolute -right-4 top-28 z-0 flex-col items-center transition-all duration-200 ${
            dragOverSlot ? 'scale-110 translate-x-0.5' : ''
          }`}
        >
          <div
            className={`w-6 h-24 rounded-r-xl border-2 border-l-0 flex items-center justify-center shadow-lg transition-all ${
              lockState === 'UNLOCKED'
                ? 'bg-[#800F2F] border-[#F5E9E6]'
                : dragOverSlot
                ? 'bg-[#D9A0A9] border-[#F5E9E6] shadow-[0_0_18px_#D9A0A9]'
                : 'bg-[#4A101F] border-[#D9A0A9]/65'
            }`}
          >
            {lockState === 'UNLOCKED' ? (
              <button
                type="button"
                onClick={handleEjectSd}
                title="Safe Eject Memory Card"
                className="w-full h-full flex items-center justify-center cursor-pointer"
              >
                <span className="font-pixel text-[6px] text-[#F5E9E6] [writing-mode:vertical-rl] tracking-widest">
                  SD IN
                </span>
              </button>
            ) : (
              <span className="font-pixel text-[6px] text-[#D8C4C1] [writing-mode:vertical-rl] tracking-widest">
                SD SLOT
              </span>
            )}
          </div>
        </div>

        {/* Maroon 3D Handheld Plastic Shell */}
        <div
          className={`${
            isNight ? 'gb-shell-night' : 'gb-shell'
          } rounded-[32px] sm:rounded-[38px] rounded-br-[68px] sm:rounded-br-[82px] p-4 sm:p-5 relative z-10 transition-all duration-500`}
        >
          {/* Top Console Bar: Power Button + Safe Eject + Sound Controls */}
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <button
              type="button"
              onClick={handlePowerToggle}
              aria-label={poweredOn ? 'Turn screen off' : 'Turn screen on'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4A101F] border border-[#F5E9E6]/70 text-[#F5E9E6] hover:brightness-110 cursor-pointer font-pixel text-[6.5px] shadow-sm"
            >
              <Power className="w-3 h-3 text-[#D9A0A9]" />
              <span>{poweredOn ? 'PWR ON' : 'PWR OFF'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {lockState === 'UNLOCKED' && (
                <button
                  type="button"
                  onClick={handleEjectSd}
                  className="sm:hidden px-2 py-1 rounded-md bg-[#4A101F] border border-[#D9A0A9] font-pixel text-[6px] text-[#F5E9E6] cursor-pointer"
                >
                  EJECT SD
                </button>
              )}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={persisted.muted ? 'Unmute audio' : 'Mute audio'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4A101F] border border-[#F5E9E6]/70 text-[#F5E9E6] hover:brightness-110 cursor-pointer font-pixel text-[6.5px]"
              >
                {persisted.muted ? (
                  <VolumeX className="w-3 h-3 text-[#D9A0A9]" />
                ) : (
                  <Volume2 className="w-3 h-3 text-[#F5E9E6]" />
                )}
                <span>{persisted.muted ? 'MUTE' : 'SFX ON'}</span>
              </button>
            </div>
          </div>

          {/* Champagne-Silver Metallic Screen Frame with Corner Screws */}
          <div
            className={`${
              isNight ? 'gb-bezel-night' : 'gb-bezel'
            } rounded-2xl rounded-br-[36px] p-3 sm:p-3.5 relative transition-all duration-500`}
          >
            {/* Four Corner Decorative Screws */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#B76E79]/75 border border-[#4A101F]/60"
            />
            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B76E79]/75 border border-[#4A101F]/60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#B76E79]/75 border border-[#4A101F]/60"
            />

            {/* Bezel Header: Power LED + Model Branding */}
            <div className="flex items-center justify-between mb-2 px-3">
              <div className="flex items-center gap-1.5">
                <span
                  aria-label={
                    !poweredOn || lockState === 'LOCKED' ? 'Power off' : 'Power on'
                  }
                  className={`w-2.5 h-2.5 rounded-full border border-[#190D13]/75 transition-colors duration-300 ${
                    !poweredOn || lockState === 'LOCKED'
                      ? 'bg-[#4A101F]'
                      : 'bg-[#D9A0A9] shadow-[0_0_8px_#D9A0A9]'
                  }`}
                />
                <span
                  className={`font-pixel text-[6px] tracking-wider ${
                    isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
                  }`}
                >
                  POWER
                </span>
              </div>
              <span
                className={`font-silk text-[9px] font-bold tracking-widest ${
                  isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
                }`}
              >
                AUCLAIR-BOY COLOR
              </span>
              <span
                className={`font-pixel text-[6px] ${
                  isNight ? 'text-[#D9A0A9]' : 'text-[#800F2F]'
                }`}
              >
                {isMusicPlaying && !persisted.muted ? '♪ ON' : 'DARK'}
              </span>
            </div>

            {/* Active Retro LCD Screen */}
            <div
              className={`relative w-full h-[360px] sm:h-[390px] rounded-xl border-2 border-[#190D13] overflow-hidden shadow-[inset_0_4px_14px_rgba(25,13,19,0.45)] transition-colors duration-500 ${lcdClass}`}
            >
              {/* Subtle Scanlines */}
              <div
                aria-hidden="true"
                className="gb-scanlines absolute inset-0 z-30 pointer-events-none opacity-65"
              />

              {/* POWER OFF SCREEN */}
              {!poweredOn && (
                <div className="h-full flex flex-col items-center justify-center p-5 text-center bg-[#190D13]">
                  <div className="w-full h-0.5 bg-[#D9A0A9]/45 mb-5" />
                  <p className="font-pixel text-[8px] text-[#D9A0A9] tracking-widest">
                    SCREEN POWERED OFF
                  </p>
                  <button
                    type="button"
                    onClick={handlePowerToggle}
                    className="mt-4 px-3 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] font-pixel text-[7.5px] text-[#F5E9E6] cursor-pointer"
                  >
                    TURN POWER ON
                  </button>
                </div>
              )}

              {/* LOCKED / INSERTING SCREEN */}
              {poweredOn && (lockState === 'LOCKED' || lockState === 'INSERTING') && (
                <div className="h-full flex flex-col items-center justify-center p-5 text-center relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <PixelStar size={18} color="#D9A0A9" className="animate-float-gentle" />
                    <PixelCloud size={26} color="#F5E9E6" className="animate-float-gentle" />
                    <PixelSmiley size={20} color="#D8C4C1" />
                  </div>
                  <div className="font-pixel text-[10px] sm:text-[11px] text-[#F5E9E6] tracking-wider">
                    {ejectedBanner ? 'MEMORY CARD SAFELY EJECTED.' : 'CONSOLE LOCKED'}
                  </div>
                  <p className="mt-2.5 font-vt text-[19px] text-[#D8C4C1] max-w-[270px] leading-tight">
                    {lockState === 'INSERTING'
                      ? 'SLIDING MEMORY CARD INTO SLOT...'
                      : 'DRAG OR TAP AUCLAIR’S MEMORY CARD BELOW TO START YOUR ADVENTURE.'}
                  </p>
                  <div
                    className={`mt-4 px-3 py-1.5 rounded-lg border-2 border-dashed font-pixel text-[7.5px] transition-all ${
                      dragOverSlot
                        ? 'border-[#F5E9E6] bg-[#800F2F] text-[#F5E9E6] scale-105'
                        : 'border-[#D9A0A9]/65 text-[#F5E9E6]'
                    }`}
                  >
                    {dragOverSlot ? 'DROP CARD TO INSERT!' : 'WAITING FOR MEMORY CARD ▶'}
                  </div>
                </div>
              )}

              {/* RETRO PIXEL LOADING ANIMATION */}
              {poweredOn && lockState === 'LOADING' && (
                <div className="h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-b from-[#4A101F] via-[#641C32] to-[#190D13]">
                  <div className="grid grid-cols-6 gap-1.5 mb-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-xs bg-[#D9A0A9] transition-opacity duration-200"
                        style={{
                          opacity: loadingProgress > (i / 12) * 100 ? 1 : 0.16,
                        }}
                      />
                    ))}
                  </div>

                  <PixelCloud size={34} color="#F5E9E6" className="mb-3 animate-float-gentle" />

                  <p className="font-pixel text-[9px] text-[#F5E9E6] min-h-[2rem] leading-relaxed">
                    {LOADING_MESSAGES[loadingStep]}
                  </p>

                  <div className="mt-3 w-full max-w-[240px] h-3.5 rounded-full bg-[#190D13] border-2 border-[#D9A0A9] p-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#922B45] via-[#D9A0A9] to-[#F5E9E6] transition-all duration-400"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span className="mt-1.5 font-pixel text-[8px] text-[#D8C4C1] tabular-nums">
                    {loadingProgress}%
                  </span>
                </div>
              )}

              {/* FINAL WELCOME FLASH */}
              {poweredOn && lockState === 'READY_FLASH' && (
                <div className="h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-b from-[#800F2F] to-[#4A101F]">
                  <div className="flex items-center gap-2 mb-3">
                    <PixelStar size={20} color="#D8C4C1" />
                    <PixelSmiley size={26} color="#D8C4C1" />
                    <PixelStar size={20} color="#D8C4C1" />
                  </div>
                  <h2 className="font-pixel text-[11px] sm:text-xs text-[#F5E9E6] leading-relaxed">
                    WELCOME TO
                    <br />
                    AUCLAIR&apos;S LITTLE WORLD!
                  </h2>
                </div>
              )}

              {/* UNLOCKED INTERACTIVE SCREENS INSIDE LCD */}
              {poweredOn && lockState === 'UNLOCKED' && (
                <div className="h-full relative z-10">
                  {appScreen === 'HOME' && (
                    <ErzaLcdHome
                      selectedIndex={homeIndex}
                      onHoverIndex={setHomeIndex}
                      onSelectScreen={(scr) => {
                        erzaAudio.playConfirm();
                        setAppScreen(scr);
                        startMusicIfAllowed();
                      }}
                      themeMode={themeMode}
                      savedNote={persisted.savedNote}
                      discoveredCount={persisted.discoveredReminders.length}
                      certifiedFriendBadge={persisted.certifiedFriendBadge}
                      welcomeBanner={welcomeBanner}
                    />
                  )}

                  {appScreen === 'NOTE' && (
                    <ErzaFriendNoteScreen
                      themeMode={themeMode}
                      savedNote={persisted.savedNote}
                      onSaveNote={() =>
                        updatePersisted((prev) => ({
                          ...prev,
                          savedNote: true,
                          certifiedFriendBadge: true,
                        }))
                      }
                      onBack={handleBackAction}
                      confirmTrigger={confirmTrigger}
                    />
                  )}

                  {appScreen === 'REMINDERS' && (
                    <ErzaRemindersScreen
                      themeMode={themeMode}
                      discoveredIndices={persisted.discoveredReminders}
                      onDiscoverReminder={(idx) =>
                        updatePersisted((prev) => ({
                          ...prev,
                          certifiedFriendBadge: true,
                          discoveredReminders: prev.discoveredReminders.includes(idx)
                            ? prev.discoveredReminders
                            : [...prev.discoveredReminders, idx],
                        }))
                      }
                      onBack={handleBackAction}
                      confirmTrigger={confirmTrigger}
                    />
                  )}

                  {appScreen === 'SOUNDTRACK' && (
                    <ErzaSoundtrackScreen
                      themeMode={themeMode}
                      tracks={tracks}
                      trackIdx={trackIdx}
                      isPlaying={isMusicPlaying}
                      shuffle={musicShuffle}
                      repeat={musicRepeat}
                      durations={trackDurations}
                      onTogglePlay={handleTogglePlayMusic}
                      onNext={handleNextTrack}
                      onPrev={handlePrevTrack}
                      onToggleShuffle={() => {
                        erzaAudio.playClick();
                        setMusicShuffle((s) => !s);
                      }}
                      onToggleRepeat={() => {
                        erzaAudio.playClick();
                        setMusicRepeat((r) => !r);
                      }}
                      onSelectTrack={handleSelectTrack}
                      onUploadTrack={handleUploadTrack}
                      onBack={handleBackAction}
                      navSignal={navSignal}
                      confirmTrigger={confirmTrigger}
                    />
                  )}

                  {appScreen === 'GAMES' && (
                    <ErzaMiniGamesScreen
                      themeMode={themeMode}
                      bestCatchScore={persisted.bestCatchScore}
                      bestAdventureScore={persisted.bestAdventureScore}
                      bestMemoryMoves={persisted.bestMemoryMoves}
                      onUpdateScores={(patch) =>
                        updatePersisted((prev) => ({
                          ...prev,
                          ...patch,
                          certifiedFriendBadge: true,
                        }))
                      }
                      onBackHome={handleBackAction}
                      heldDirectionRef={heldDirectionRef}
                      navSignal={navSignal}
                      confirmTrigger={confirmTrigger}
                      activeGameId={activeGameId}
                      onChangeGameId={setActiveGameId}
                    />
                  )}

                  {appScreen === 'SECRET' && (
                    <ErzaSecretScreen onBack={handleBackAction} />
                  )}

                  {appScreen === 'ACHIEVEMENT' && (
                    <ErzaAchievementScreen
                      state={persisted}
                      onUnlockBadge={() =>
                        updatePersisted({ certifiedFriendBadge: true })
                      }
                      onBack={handleBackAction}
                    />
                  )}

                  {appScreen === 'SETTINGS' && (
                    <ErzaSettingsScreen
                      state={persisted}
                      onUpdateState={(patch) => updatePersisted(patch)}
                      onToggleTheme={handleToggleTheme}
                      onBack={handleBackAction}
                    />
                  )}

                  {appScreen === 'FINALE' && (
                    <ErzaFinaleScreen
                      themeMode={themeMode}
                      onPlayAgain={() => {
                        setAppScreen('GAMES');
                        setActiveGameId('MENU');
                      }}
                      onMainMenu={() => setAppScreen('HOME')}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Physical Controls Below Bezel (Inspired by Reference 1 + Classic Game Boy) */}
          <div className="mt-4 px-1 sm:px-2">
            <div className="flex items-center justify-between gap-2">
              {/* Classic Cross D-Pad */}
              <div
                role="group"
                aria-label="D-Pad directional buttons"
                className="relative w-[108px] h-[108px] sm:w-[116px] sm:h-[116px] shrink-0"
              >
                <div className="absolute left-1/3 top-1/3 w-1/3 h-1/3 bg-[#4A101F] z-10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#190D13]/85 shadow-inner" />
                </div>

                <button
                  type="button"
                  aria-label="D-Pad Up"
                  onPointerDown={() => dpadPointerStart('UP')}
                  onPointerUp={dpadPointerEnd}
                  onPointerLeave={dpadPointerEnd}
                  className={`gb-dpad-arm absolute left-1/3 top-0 w-1/3 h-1/3 rounded-t-lg flex items-center justify-center cursor-pointer text-[#D8C4C1] text-xs font-bold ${
                    pressedBtn === 'UP' ? 'is-pressed' : ''
                  }`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label="D-Pad Down"
                  onPointerDown={() => dpadPointerStart('DOWN')}
                  onPointerUp={dpadPointerEnd}
                  onPointerLeave={dpadPointerEnd}
                  className={`gb-dpad-arm absolute left-1/3 bottom-0 w-1/3 h-1/3 rounded-b-lg flex items-center justify-center cursor-pointer text-[#D8C4C1] text-xs font-bold ${
                    pressedBtn === 'DOWN' ? 'is-pressed' : ''
                  }`}
                >
                  ▼
                </button>
                <button
                  type="button"
                  aria-label="D-Pad Left"
                  onPointerDown={() => dpadPointerStart('LEFT')}
                  onPointerUp={dpadPointerEnd}
                  onPointerLeave={dpadPointerEnd}
                  className={`gb-dpad-arm absolute left-0 top-1/3 w-1/3 h-1/3 rounded-l-lg flex items-center justify-center cursor-pointer text-[#D8C4C1] text-xs font-bold ${
                    pressedBtn === 'LEFT' ? 'is-pressed' : ''
                  }`}
                >
                  ◀
                </button>
                <button
                  type="button"
                  aria-label="D-Pad Right"
                  onPointerDown={() => dpadPointerStart('RIGHT')}
                  onPointerUp={dpadPointerEnd}
                  onPointerLeave={dpadPointerEnd}
                  className={`gb-dpad-arm absolute right-0 top-1/3 w-1/3 h-1/3 rounded-r-lg flex items-center justify-center cursor-pointer text-[#D8C4C1] text-xs font-bold ${
                    pressedBtn === 'RIGHT' ? 'is-pressed' : ''
                  }`}
                >
                  ▶
                </button>
              </div>

              {/* A & B Circular Action Buttons */}
              <div className="flex items-center gap-3.5 -rotate-12">
                <div className="flex flex-col items-center translate-y-2">
                  <button
                    type="button"
                    aria-label="Button B Back"
                    onClick={() => handleConsoleButton('B')}
                    className={`gb-round-btn w-12 h-12 rounded-full flex items-center justify-center font-pixel text-xs text-[#F5E9E6] cursor-pointer ${
                      pressedBtn === 'B' ? 'is-pressed' : ''
                    }`}
                  >
                    B
                  </button>
                  <span className="mt-1 font-pixel text-[6.5px] text-[#F5E9E6]">
                    BACK
                  </span>
                </div>

                <div className="flex flex-col items-center -translate-y-2">
                  <button
                    type="button"
                    aria-label="Button A OK"
                    onClick={() => handleConsoleButton('A')}
                    className={`gb-round-btn w-12 h-12 rounded-full flex items-center justify-center font-pixel text-xs text-[#F5E9E6] cursor-pointer ${
                      pressedBtn === 'A' ? 'is-pressed' : ''
                    }`}
                  >
                    A
                  </button>
                  <span className="mt-1 font-pixel text-[6.5px] text-[#F5E9E6]">
                    OK
                  </span>
                </div>
              </div>

              {/* Signature Tactile Smiley Dial (Champagne/Blush Dial) */}
              <div className="flex flex-col items-center shrink-0">
                <button
                  type="button"
                  title="Certified Awesome Friend Badge"
                  aria-label="Open Certified Awesome Friend Badge"
                  onClick={() => {
                    erzaAudio.playSmileChime();
                    if (lockState === 'UNLOCKED' && poweredOn) {
                      setAppScreen((prev) =>
                        prev === 'ACHIEVEMENT' ? 'HOME' : 'ACHIEVEMENT'
                      );
                    }
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-b from-[#F5E9E6] via-[#D8C4C1] to-[#B76E79] border-[3px] border-[#4A101F] shadow-[0_5px_0_#190D13,inset_0_2px_4px_rgba(255,255,255,0.85)] active:translate-y-1 active:shadow-[0_1px_0_#190D13] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                >
                  <PixelSmiley size={26} color="#D8C4C1" />
                </button>
                <span className="mt-1 font-pixel text-[6px] text-[#F5E9E6]">
                  BADGE
                </span>
              </div>
            </div>

            {/* START / SELECT Pill Buttons + Speaker Grille */}
            <div className="mt-4 flex items-end justify-between">
              <div className="w-12 hidden sm:block" />

              <div className="flex items-center justify-center gap-5 mx-auto">
                <div className="flex flex-col items-center -rotate-12">
                  <button
                    type="button"
                    aria-label="Button Select (Sound & Display)"
                    onClick={() => handleConsoleButton('SELECT')}
                    className={`gb-pill-btn w-12 h-4 rounded-full cursor-pointer ${
                      pressedBtn === 'SELECT' ? 'is-pressed' : ''
                    }`}
                  />
                  <span className="mt-1.5 font-pixel text-[6.5px] text-[#F5E9E6]">
                    SELECT
                  </span>
                </div>

                <div className="flex flex-col items-center -rotate-12">
                  <button
                    type="button"
                    aria-label="Button Start (Main Menu)"
                    onClick={() => handleConsoleButton('START')}
                    className={`gb-pill-btn w-12 h-4 rounded-full cursor-pointer ${
                      pressedBtn === 'START' ? 'is-pressed' : ''
                    }`}
                  />
                  <span className="mt-1.5 font-pixel text-[6.5px] text-[#F5E9E6]">
                    START
                  </span>
                </div>
              </div>

              {/* Diagonal Speaker Holes */}
              <div className="flex gap-1.5 -rotate-25 pr-2 pb-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-6 rounded-full bg-[#190D13]/75 border-r border-[#F5E9E6]/35"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Holographic SD Memory Card Section While Locked / Inserting */}
      {(lockState === 'LOCKED' || lockState === 'INSERTING') && (
        <section
          aria-label="Auclair Memory Card"
          className="mt-4 flex flex-col items-center text-center"
        >
          <ThreeHolographicCard
            inserting={lockState === 'INSERTING'}
            onTriggerInsert={triggerInsertSd}
          />

          <div className="mt-1 px-4 py-2.5 rounded-xl holo-card-surface border-2 border-[#F5E9E6] shadow-lg max-w-xs">
            <div className="font-pixel text-[9px] text-[#4A101F] tracking-wider">
              AUCLAIR&apos;S MEMORY CARD
            </div>
            <div className="mt-1 font-pixel text-[7px] text-[#800F2F]">
              FRIENDSHIP EDITION
            </div>
            <p className="mt-1 font-silk text-[8.5px] font-bold text-[#4A101F]">
              MEMORIES • MUSIC • GAMES
            </p>
          </div>

          <button
            type="button"
            disabled={lockState === 'INSERTING'}
            onClick={triggerInsertSd}
            className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800F2F] to-[#B76E79] hover:brightness-110 border-2 border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[9px] shadow-[0_5px_0_#190D13] active:translate-y-1 active:shadow-[0_1px_0_#190D13] cursor-pointer transition-all disabled:opacity-60"
          >
            [ INSERT MEMORY CARD ]
          </button>
        </section>
      )}

      {/* Footer Help */}
      <footer className="mt-5 text-center space-y-1.5 max-w-lg px-2">
        <p className="font-pixel text-[8px] sm:text-[9px] leading-relaxed text-[#F5E9E6]">
          MADE WITH FRIENDSHIP, JUST FOR YOU, AUCLAIR! — JERYMOTH
        </p>
        <p className="font-silk text-[9px] text-[#D8C4C1]/90">
          KEYS: ARROWS = D-PAD · ENTER = A · ESC = B · SHIFT = SOUND
        </p>
      </footer>
    </div>
  );
};
