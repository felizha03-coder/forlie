import React from 'react';
import { ConsoleButtonId, GameBoyScreenId, TrackItem } from '../types/lie';
import { MainMenu } from './screens/MainMenu';
import { LoveLetter } from './screens/LoveLetter';
import { LittleReminders } from './screens/LittleReminders';
import { MusicPlayer } from './screens/MusicPlayer';
import { MiniGames } from './screens/MiniGames';
import { FinaleScreen } from './screens/FinaleScreen';

interface GameBoyScreenProps {
  screen: GameBoyScreenId;
  sdInserted: boolean;
  glitching: boolean;
  unlockProgress: number;
  lockedWarning: string | null;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
  onNavigate: (next: GameBoyScreenId) => void;
  onQuickInsertSd?: () => void;
  onReplayExperience: () => void;
  /* Persistent Music State */
  tracks: TrackItem[];
  activeTrackIndex: number;
  isMusicPlaying: boolean;
  musicError: string | null;
  volume: number;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
  onToggleMusicPlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onChangeVolume: (vol: number) => void;
  onUploadTrackFile: (trackIndex: number, file: File) => void;
}

export const GameBoyScreen: React.FC<GameBoyScreenProps> = ({
  screen,
  sdInserted,
  glitching,
  unlockProgress,
  lockedWarning,
  navSignal,
  onNavigate,
  onQuickInsertSd,
  onReplayExperience,
  tracks,
  activeTrackIndex,
  isMusicPlaying,
  musicError,
  volume,
  onSelectTrack,
  onToggleMusicPlay,
  onPrevTrack,
  onNextTrack,
  onChangeVolume,
  onUploadTrackFile,
}) => {
  const activeTrackTitle =
    isMusicPlaying && !musicError ? tracks[activeTrackIndex]?.title ?? null : null;

  return (
    <div
      className={`relative w-full h-[296px] sm:h-[314px] rounded-xl overflow-hidden border-[3px] border-[#030405] ${
        sdInserted ? 'gb-lcd-active' : 'gb-lcd-locked'
      } ${glitching ? 'animate-pixel-glitch' : ''}`}
    >
      {/* CRT Scanlines + Glass Glare */}
      <div className="pointer-events-none absolute inset-0 z-20 crt-scanlines" />
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 58%, rgba(0,0,0,0.46) 100%), linear-gradient(130deg, rgba(255,255,255,0.05) 0%, transparent 28%)',
        }}
      />

      <div className="relative z-10 h-full w-full">
        {screen === 'BOOT' && (
          <div className="h-full w-full flex flex-col items-center justify-between p-4 text-center select-none">
            <div className="w-full flex items-center justify-between font-silk text-[8px] text-[#94A3B8]">
              <span>STATUS: STANDBY</span>
              <span className="text-amber-300">SD REQUIRED</span>
            </div>

            <div className="my-auto space-y-2.5">
              <div className="inline-flex px-2.5 py-1 rounded border border-[#34D399]/40 bg-[#0A1712] font-silk text-[8px] tracking-[0.2em] text-[#34D399]">
                DOT MATRIX EDITION
              </div>
              <h2 className="font-pixel text-[12px] sm:text-[13px] leading-relaxed text-[#E2E8F0]">
                LIE&apos;S LITTLE
                <br />
                GAME BOY
              </h2>
              <p className="font-silk text-[9px] tracking-[0.16em] text-[#34D399]">
                YOUR OWN LITTLE WORLD
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onQuickInsertSd}
                  className="inline-block px-3 py-1.5 rounded border border-[#34D399]/70 bg-[#0E1E17] hover:bg-[#10B981]/25 font-pixel text-[8px] text-[#A3E635] animate-pulse cursor-pointer"
                >
                  INSERT SD CARD TO START
                </button>
              </div>

              {lockedWarning && (
                <p className="font-vt text-[17px] text-amber-300 pt-1">
                  {lockedWarning}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onQuickInsertSd}
              className="w-full rounded bg-[#080E0B] hover:bg-[#0D1A14] border border-[#1E293B] hover:border-[#34D399]/50 px-2.5 py-1.5 font-silk text-[8px] text-[#94A3B8] hover:text-[#34D399] transition-colors cursor-pointer"
            >
              CLICK HERE OR DRAG LIE&apos;S MEMORY CARD INTO SLOT ➔
            </button>
          </div>
        )}

        {screen === 'UNLOCKED' && (
          <div className="h-full w-full flex flex-col items-center justify-center p-5 text-center select-none space-y-3">
            <p className="font-pixel text-[9px] text-[#34D399]">
              MEMORY CARD DETECTED.
            </p>
            {unlockProgress >= 45 && (
              <p className="font-pixel text-[10px] text-[#A3E635]">
                ACCESS GRANTED.
              </p>
            )}
            {unlockProgress >= 85 && (
              <p className="font-vt text-[21px] text-[#E2E8F0]">
                WELCOME TO LIE&apos;S LITTLE WORLD.
              </p>
            )}

            <div className="w-full max-w-[240px] h-3 rounded bg-[#0A120E] border border-[#34D399]/60 p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#A3E635] transition-all duration-300"
                style={{ width: `${unlockProgress}%` }}
              />
            </div>

            <p className="font-silk text-[8px] tracking-widest text-[#94A3B8]">
              MOUNTING SYSTEM DATA... {unlockProgress}%
            </p>
          </div>
        )}

        {screen === 'MENU' && (
          <MainMenu
            onNavigate={onNavigate}
            navSignal={navSignal}
            nowPlayingTitle={activeTrackTitle}
          />
        )}

        {screen === 'LETTER' && (
          <LoveLetter onBack={() => onNavigate('MENU')} navSignal={navSignal} />
        )}

        {screen === 'REMINDERS' && (
          <LittleReminders onBack={() => onNavigate('MENU')} navSignal={navSignal} />
        )}

        {screen === 'MUSIC' && (
          <MusicPlayer
            tracks={tracks}
            activeIndex={activeTrackIndex}
            isPlaying={isMusicPlaying}
            audioError={musicError}
            volume={volume}
            onSelectTrack={onSelectTrack}
            onTogglePlay={onToggleMusicPlay}
            onPrev={onPrevTrack}
            onNext={onNextTrack}
            onChangeVolume={onChangeVolume}
            onUploadTrackFile={onUploadTrackFile}
            onBack={() => onNavigate('MENU')}
            navSignal={navSignal}
          />
        )}

        {screen === 'GAMES' && (
          <MiniGames onBack={() => onNavigate('MENU')} navSignal={navSignal} />
        )}

        {screen === 'FINALE' && (
          <FinaleScreen
            onReplayExperience={onReplayExperience}
            onBackMenu={() => onNavigate('MENU')}
            navSignal={navSignal}
          />
        )}
      </div>
    </div>
  );
};
