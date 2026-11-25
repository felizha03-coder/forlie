import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MonitorPlay, Volume2, VolumeX } from 'lucide-react';
import { ConsoleButtonId, GameBoyScreenId, TrackItem } from '../types/lie';
import { lieAudio } from '../audio/lieAudio';
import { DPad } from './DPad';
import { ActionButtons } from './ActionButtons';
import { GameBoyScreen } from './GameBoyScreen';
import { SDCard } from './SDCard';

interface GameBoyConsoleProps {
  muted: boolean;
  volume: number;
  tracks: TrackItem[];
  activeTrackIndex: number;
  isMusicPlaying: boolean;
  musicError: string | null;
  onToggleMute: () => void;
  onChangeVolume: (vol: number) => void;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
  onToggleMusicPlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onUploadTrackFile: (trackIndex: number, file: File) => void;
  onReturnToArcade: () => void;
}

export const GameBoyConsole: React.FC<GameBoyConsoleProps> = ({
  muted,
  volume,
  tracks,
  activeTrackIndex,
  isMusicPlaying,
  musicError,
  onToggleMute,
  onChangeVolume,
  onSelectTrack,
  onToggleMusicPlay,
  onPrevTrack,
  onNextTrack,
  onUploadTrackFile,
  onReturnToArcade,
}) => {
  const [sdInserted, setSdInserted] = useState(false);
  const [sdInserting, setSdInserting] = useState(false);
  const [slotDragActive, setSlotDragActive] = useState(false);
  const [screen, setScreen] = useState<GameBoyScreenId>('BOOT');
  const [glitching, setGlitching] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [lockedWarning, setLockedWarning] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<ConsoleButtonId | null>(null);
  const [navSignal, setNavSignal] = useState<{ seq: number; btn: ConsoleButtonId } | null>(null);
  const seqRef = useRef(1);
  const unlockTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      unlockTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const flashPress = (btn: ConsoleButtonId) => {
    setPressedBtn(btn);
    window.setTimeout(() => setPressedBtn((c) => (c === btn ? null : c)), 140);
  };

  const triggerInsertSd = useCallback(() => {
    if (sdInserted || sdInserting) return;
    setSdInserting(true);
    setLockedWarning(null);
    lieAudio.playSdInsert();

    unlockTimersRef.current.forEach((id) => window.clearTimeout(id));
    unlockTimersRef.current = [];

    unlockTimersRef.current.push(
      window.setTimeout(() => {
        setSdInserting(false);
        setSdInserted(true);
        setGlitching(true);
        setScreen('UNLOCKED');
        setUnlockProgress(20);
        lieAudio.playBootChime();
      }, 820),
      window.setTimeout(() => {
        setGlitching(false);
        setUnlockProgress(58);
      }, 1250),
      window.setTimeout(() => {
        setUnlockProgress(94);
      }, 1750),
      window.setTimeout(() => {
        setUnlockProgress(100);
        setScreen('MENU');
        lieAudio.playConfirm();
      }, 2400)
    );
  }, [sdInserted, sdInserting]);

  const triggerEjectSd = useCallback(() => {
    if (!sdInserted) return;
    lieAudio.playSdEject();
    unlockTimersRef.current.forEach((id) => window.clearTimeout(id));
    setSdInserted(false);
    setGlitching(true);
    setScreen('BOOT');
    setUnlockProgress(0);
    setLockedWarning('MEMORY CARD EJECTED — RE-INSERT TO UNLOCK.');
    window.setTimeout(() => setGlitching(false), 380);
  }, [sdInserted]);

  const navigateTo = useCallback((next: GameBoyScreenId) => {
    setNavSignal(null);
    setScreen(next);
  }, []);

  const handleConsoleButton = useCallback(
    (btn: ConsoleButtonId) => {
      flashPress(btn);

      if (!sdInserted) {
        lieAudio.playNav();
        if (btn === 'A' || btn === 'START') {
          setLockedWarning("INSERT LIE'S MEMORY CARD FIRST ➔");
        }
        return;
      }

      if (screen === 'UNLOCKED') return;

      if (
        btn === 'UP' ||
        btn === 'DOWN' ||
        btn === 'LEFT' ||
        btn === 'RIGHT'
      ) {
        lieAudio.playNav();
      }

      if (btn === 'START' && screen !== 'MENU' && screen !== 'FINALE' && screen !== 'GAMES') {
        lieAudio.playConfirm();
        navigateTo('MENU');
        return;
      }

      setNavSignal({ seq: seqRef.current++, btn });
    },
    [sdInserted, screen, navigateTo]
  );

  // Full keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleConsoleButton('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleConsoleButton('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleConsoleButton('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleConsoleButton('RIGHT');
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleConsoleButton('A');
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleConsoleButton('B');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleConsoleButton('START');
      } else if (e.key === 'Shift') {
        handleConsoleButton('SELECT');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleConsoleButton]);

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-3 py-5 sm:py-8">
      {/* Top Bar Controls */}
      <div className="w-full max-w-[780px] flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReturnToArcade}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#CBD5E1]/20 bg-[#0C0F12]/90 hover:border-[#34D399]/60 text-[#CBD5E1] hover:text-[#34D399] font-silk text-[10px] transition-colors cursor-pointer"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>ARCADE INTRO</span>
          </button>

          {(isMusicPlaying || lieAudio.getMusicState().src) && !musicError && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[#34D399]/40 bg-[#0A1712]">
              <button
                type="button"
                onClick={() => sdInserted && navigateTo('MUSIC')}
                className="text-[#A3E635] font-silk text-[10px] max-w-[160px] truncate cursor-pointer"
                title="Open Music Player"
              >
                {isMusicPlaying ? '♪' : '❚❚'} {tracks[activeTrackIndex]?.title}
              </button>
              <button
                type="button"
                onClick={onToggleMusicPlay}
                className="px-1.5 py-0.5 rounded bg-[#10B981]/20 hover:bg-[#10B981]/40 text-[#34D399] font-silk text-[9px] cursor-pointer"
                title={isMusicPlaying ? 'Pause music' : 'Resume music'}
              >
                {isMusicPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                type="button"
                onClick={onNextTrack}
                className="px-1.5 py-0.5 rounded bg-[#10B981]/20 hover:bg-[#10B981]/40 text-[#CBD5E1] font-silk text-[9px] cursor-pointer"
                title="Next track"
              >
                NEXT
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#CBD5E1]/20 bg-[#0C0F12]/90 hover:border-[#34D399]/60 text-[#CBD5E1] hover:text-[#34D399] font-silk text-[10px] transition-colors cursor-pointer"
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />
          )}
          <span>{muted ? 'AUDIO MUTED' : 'SOUND ON'}</span>
        </button>
      </div>

      {/* Main Side-by-Side Stage: Handheld Console + Holographic SD Card */}
      <div className="w-full max-w-[780px] flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
        {/* 3D Dark Gunmetal Game Boy Handheld */}
        <div className="relative w-full max-w-[392px]">
          {/* Right-Edge SD Card Slot Housing & Drag Drop Target */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setSlotDragActive(true);
            }}
            onDragLeave={() => setSlotDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setSlotDragActive(false);
              triggerInsertSd();
            }}
            className={`hidden sm:flex absolute -right-4 top-28 z-20 flex-col items-center justify-center w-6 h-24 rounded-r-lg border-y border-r transition-all ${
              sdInserted
                ? 'bg-[#0C1C16] border-[#34D399] shadow-[0_0_16px_rgba(52,211,153,0.45)]'
                : slotDragActive
                  ? 'bg-[#10B981]/30 border-[#A3E635] scale-105 shadow-[0_0_18px_rgba(163,230,53,0.6)]'
                  : 'bg-[#090B0E] border-[#334155]'
            }`}
          >
            <div className="w-1.5 h-16 rounded-full bg-[#030405] border border-[#34D399]/30 overflow-hidden flex items-center justify-center">
              {sdInserted && (
                <div className="w-1 h-14 rounded-full bg-gradient-to-b from-[#CBD5E1] via-[#34D399] to-[#10B981] shadow-[0_0_8px_#34D399]" />
              )}
            </div>
            <span className="mt-1 font-silk text-[7px] text-[#34D399] rotate-90 origin-center whitespace-nowrap">
              {sdInserted ? 'SD' : 'SLOT'}
            </span>
          </div>

          {/* Main Console Chassis */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!sdInserted) setSlotDragActive(true);
            }}
            onDragLeave={() => setSlotDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setSlotDragActive(false);
              triggerInsertSd();
            }}
            className={`relative gb-dark-shell rounded-[26px] rounded-br-[62px] p-5 sm:p-6 transition-all ${
              slotDragActive && !sdInserted
                ? 'ring-2 ring-[#34D399] shadow-[0_0_32px_rgba(52,211,153,0.4)]'
                : ''
            }`}
          >
            {/* Corner Precision Screws & Top Power Switch Accent */}
            <span className="absolute top-2.5 left-4 w-2 h-2 rounded-full bg-[#334155] border border-black" />
            <span className="absolute top-2.5 right-4 w-2 h-2 rounded-full bg-[#334155] border border-black" />

            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#07090B] border border-[#334155]/60">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    sdInserted
                      ? 'bg-[#34D399] shadow-[0_0_8px_#34D399]'
                      : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span className="font-silk text-[8px] tracking-[0.18em] text-[#CBD5E1]">
                  {sdInserted ? 'ON // SD ACTIVE' : 'LOCKED // NO SD'}
                </span>
              </div>
              <span className="font-silk text-[8px] tracking-[0.2em] text-[#64748B]">
                LIE-BOY 01
              </span>
            </div>

            {/* Glossy Dark Glass Screen Bezel */}
            <div className="gb-dark-bezel rounded-2xl rounded-br-[34px] p-3 sm:p-3.5 mb-5">
              {/* Top Bezel Label & Battery LED */}
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sdInserted
                        ? 'bg-[#34D399] shadow-[0_0_8px_#34D399]'
                        : 'bg-[#10B981]/50'
                    }`}
                  />
                  <span className="font-silk text-[7px] tracking-widest text-[#94A3B8]">
                    BATTERY
                  </span>
                </div>
                <span className="font-silk text-[8px] tracking-[0.16em] text-[#CBD5E1]">
                  STEREO DOT MATRIX
                </span>
              </div>

              <GameBoyScreen
                screen={screen}
                sdInserted={sdInserted}
                glitching={glitching}
                unlockProgress={unlockProgress}
                lockedWarning={lockedWarning}
                navSignal={navSignal}
                onNavigate={navigateTo}
                onQuickInsertSd={triggerInsertSd}
                onReplayExperience={onReturnToArcade}
                tracks={tracks}
                activeTrackIndex={activeTrackIndex}
                isMusicPlaying={isMusicPlaying}
                musicError={musicError}
                volume={volume}
                onSelectTrack={onSelectTrack}
                onToggleMusicPlay={onToggleMusicPlay}
                onPrevTrack={onPrevTrack}
                onNextTrack={onNextTrack}
                onChangeVolume={onChangeVolume}
                onUploadTrackFile={onUploadTrackFile}
              />
            </div>

            {/* Console Wordmark */}
            <div className="flex items-baseline gap-2 mb-4 px-1">
              <span className="font-pixel text-[11px] italic tracking-wide text-[#CBD5E1]">
                NINTENDO
              </span>
              <span className="font-pixel text-[12px] italic text-[#34D399] tracking-tight">
                GAME BOY
              </span>
              <span className="font-silk text-[8px] text-[#64748B]">TM</span>
            </div>

            {/* Controls Row: DPad (left) + Emerald Action Buttons (right) */}
            <div className="flex items-start justify-between gap-2 mb-4 px-1">
              <DPad
                pressedBtn={pressedBtn}
                onPress={(dir) => handleConsoleButton(dir)}
              />
              <ActionButtons
                pressedBtn={pressedBtn}
                onPress={(btn) => handleConsoleButton(btn)}
              />
            </div>

            {/* Diagonal Speaker Grille & Headphone Port Detail */}
            <div className="flex items-end justify-between px-2 pt-1">
              <div className="px-2 py-0.5 rounded-full border border-[#334155]/50 bg-[#07090B]">
                <span className="font-silk text-[7px] tracking-[0.18em] text-[#64748B]">
                  PHONES // 3.5MM
                </span>
              </div>

              <div className="flex gap-1.5 -rotate-24 pr-3 pb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-7 rounded-full bg-[#040506] border-r border-[#334155]/45 shadow-inner"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Holographic SD Memory Card Panel */}
        <SDCard
          inserted={sdInserted}
          inserting={sdInserting}
          onTriggerInsert={triggerInsertSd}
          onTriggerEject={triggerEjectSd}
        />
      </div>
    </div>
  );
};
