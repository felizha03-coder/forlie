import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import { erzaAudio } from '../../audio/erzaAudio';
import {
  PixelCloud,
  PixelSmiley,
  PixelStar,
  PixelTrophyBadge,
} from '../../components/ErzaPixelArt';
import { ERZA_SECRET_MESSAGE } from '../../data/erzaData';
import { PersistedErzaState, ThemeMode } from '../../types/erza';

/* ---------------- 1. SECRET KONAMI EASTER EGG SCREEN ---------------- */
export const ErzaSecretScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [glitching, setGlitching] = useState(true);
  const [typedCount, setTypedCount] = useState(0);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setGlitching(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5, opacity: 0, y: 12 },
        { scale: 1, opacity: 1, y: 0, duration: 0.65, delay: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  useEffect(() => {
    if (typedCount >= ERZA_SECRET_MESSAGE.length) return;
    const id = window.setInterval(() => {
      setTypedCount((prev) => Math.min(ERZA_SECRET_MESSAGE.length, prev + 3));
    }, 24);
    return () => window.clearInterval(id);
  }, [typedCount]);

  return (
    <div
      className={`h-full flex flex-col p-3 bg-gradient-to-b from-[#190D13] via-[#4A101F] to-[#641C32] text-[#F5E9E6] relative overflow-hidden ${
        glitching ? 'animate-pixel-glitch' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="px-2 py-1 rounded-md font-pixel text-[7.5px] border bg-[#190D13] border-[#D9A0A9]/65 text-[#F5E9E6] hover:bg-[#800F2F] cursor-pointer"
        >
          ◀ MENU
        </button>
        <span className="font-pixel text-[7.5px] text-[#D8C4C1]">
          SECRET LEVEL ★
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto lcd-scroll flex flex-col items-center gap-2 py-1">
        {/* Holographic Cloud + Emerging Achievement Badge */}
        <div
          ref={badgeRef}
          className="w-full p-2.5 rounded-2xl holo-card-surface border-2 border-[#F5E9E6] shadow-lg flex items-center justify-center gap-3"
        >
          <PixelCloud size={30} color="#F5E9E6" className="animate-float-gentle" />
          <div className="text-left">
            <div className="font-pixel text-[7px] text-[#4A101F]">BADGE UNLOCKED!</div>
            <div className="font-pixel text-[7.5px] text-[#4A101F] mt-0.5">
              CERTIFIED AWESOME FRIEND
            </div>
          </div>
          <PixelTrophyBadge size={26} />
        </div>

        <div
          onClick={() => setTypedCount(ERZA_SECRET_MESSAGE.length)}
          className="w-full rounded-xl bg-[#190D13]/90 border-2 border-[#D9A0A9]/75 p-3 shadow-inner cursor-pointer"
        >
          <p className="whitespace-pre-line font-vt text-[17px] leading-[1.25] text-[#F5E9E6]">
            {ERZA_SECRET_MESSAGE.slice(0, typedCount)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 2. FRIENDSHIP ACHIEVEMENT BADGE SCREEN ---------------- */
export const ErzaAchievementScreen: React.FC<{
  state: PersistedErzaState;
  onUnlockBadge: () => void;
  onBack: () => void;
}> = ({ state, onUnlockBadge, onBack }) => {
  const isNight = state.themeMode === 'NIGHT';
  const badgeCardRef = useRef<HTMLDivElement | null>(null);

  const unlocked =
    state.certifiedFriendBadge ||
    state.savedNote ||
    state.discoveredReminders.length > 0 ||
    state.bestCatchScore > 0 ||
    state.bestAdventureScore > 0 ||
    state.bestMemoryMoves !== null ||
    state.secretFound;

  useEffect(() => {
    if (unlocked && !state.certifiedFriendBadge) {
      onUnlockBadge();
    }
    if (badgeCardRef.current) {
      gsap.fromTo(
        badgeCardRef.current,
        { scale: 0.78, rotate: -4, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }
      );
    }
  }, [unlocked, state.certifiedFriendBadge, onUnlockBadge]);

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto lcd-scroll">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer ${
            isNight
              ? 'bg-[#190D13]/85 border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]'
          }`}
        >
          ◀ MENU
        </button>
        <span className={`font-pixel text-[7.5px] ${isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'}`}>
          ACHIEVEMENT
        </span>
      </div>

      <div
        ref={badgeCardRef}
        className={`rounded-2xl border-2 p-4 text-center shadow-lg ${
          unlocked
            ? 'holo-card-surface border-[#F5E9E6] text-[#4A101F]'
            : 'bg-[#4A101F]/85 border-[#D9A0A9]/45 text-[#D8C4C1]'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <PixelStar size={18} color={unlocked ? '#800F2F' : '#D9A0A9'} />
          <PixelTrophyBadge size={36} />
          <PixelSmiley size={20} color={unlocked ? '#D8C4C1' : '#D9A0A9'} />
        </div>
        <h3 className="font-pixel text-[9px] leading-relaxed">
          CERTIFIED AWESOME FRIEND
        </h3>
        <p className="font-vt text-[17px] mt-1">
          {unlocked
            ? 'AWARDED TO AUCLAIR — PLAYER 1 FOR LIFE!'
            : 'PLAY A GAME OR SAVE THE NOTE TO CLAIM BADGE!'}
        </p>
        {!unlocked && (
          <button
            type="button"
            onClick={() => {
              erzaAudio.playGameWin();
              onUnlockBadge();
            }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
          >
            CLAIM FRIENDSHIP BADGE
          </button>
        )}
      </div>

      {/* Saved Progress Summary */}
      <div
        className={`mt-2.5 rounded-xl border-2 p-2.5 space-y-1 font-vt text-[16px] ${
          isNight
            ? 'bg-[#190D13]/85 border-[#922B45] text-[#F5E9E6]'
            : 'bg-[#F5E9E6] border-[#B76E79] text-[#4A101F]'
        }`}
      >
        <div className="flex justify-between">
          <span>FRIEND NOTE:</span>
          <span>{state.savedNote ? 'SAVED ★' : 'UNSAVED'}</span>
        </div>
        <div className="flex justify-between">
          <span>CAPSULES OPENED:</span>
          <span>{state.discoveredReminders.length}/50</span>
        </div>
        <div className="flex justify-between">
          <span>CATCH CLOUDS BEST:</span>
          <span>{state.bestCatchScore} PTS</span>
        </div>
        <div className="flex justify-between">
          <span>PIXEL ADVENTURE BEST:</span>
          <span>{state.bestAdventureScore} PTS</span>
        </div>
        <div className="flex justify-between">
          <span>SECRET LEVEL:</span>
          <span>{state.secretFound ? 'FOUND ★' : 'TRY KONAMI CODE'}</span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 3. SOUND & THEME SETTINGS SCREEN ---------------- */
export const ErzaSettingsScreen: React.FC<{
  state: PersistedErzaState;
  onUpdateState: (patch: Partial<PersistedErzaState>) => void;
  onToggleTheme?: () => void;
  onBack: () => void;
}> = ({ state, onUpdateState, onBack }) => {
  const isNight = true;

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto lcd-scroll">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer ${
            isNight
              ? 'bg-[#190D13]/85 border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]'
          }`}
        >
          ◀ MENU
        </button>
        <span className="font-pixel text-[7.5px] text-[#F5E9E6]">
          SOUND &amp; DISPLAY
        </span>
      </div>

      <div className="rounded-xl border-2 p-3 space-y-3 bg-[#4A101F]/95 border-[#D9A0A9]/50 text-[#F5E9E6]">
        <div>
          <div className="flex items-center justify-between font-pixel text-[7.5px] mb-1.5">
            <span>MASTER VOLUME</span>
            <span>{Math.round(state.masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={state.masterVolume}
            onChange={(e) => {
              const v = Number(e.target.value);
              onUpdateState({ masterVolume: v });
              erzaAudio.setVolume(v);
            }}
            className="w-full accent-[#800F2F] cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !state.muted;
            onUpdateState({ muted: next });
            erzaAudio.setMuted(next);
            if (!next) erzaAudio.playClick();
          }}
          className="w-full py-2 px-3 rounded-lg border-2 border-[#D9A0A9] bg-[#800F2F] text-[#F5E9E6] font-pixel text-[7.5px] flex items-center justify-center gap-2 cursor-pointer"
        >
          {state.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{state.muted ? 'AUDIO MUTED — TAP TO UNMUTE' : 'AUDIO ACTIVE — TAP TO MUTE'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !state.buttonSfxEnabled;
              onUpdateState({ buttonSfxEnabled: next });
            }}
            className={`py-2 px-2 rounded-lg border font-pixel text-[6.5px] cursor-pointer ${
              state.buttonSfxEnabled
                ? 'bg-[#D9A0A9] border-[#4A101F] text-[#4A101F]'
                : 'bg-[#4A101F]/20 border-[#800F2F]/40 opacity-70'
            }`}
          >
            BTN SFX: {state.buttonSfxEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !state.gameSfxEnabled;
              onUpdateState({ gameSfxEnabled: next });
            }}
            className={`py-2 px-2 rounded-lg border font-pixel text-[6.5px] cursor-pointer ${
              state.gameSfxEnabled
                ? 'bg-[#D9A0A9] border-[#4A101F] text-[#4A101F]'
                : 'bg-[#4A101F]/20 border-[#800F2F]/40 opacity-70'
            }`}
          >
            GAME SFX: {state.gameSfxEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="w-full py-2 px-3 rounded-lg border-2 border-[#D8C4C1]/60 bg-[#190D13] text-[#F5E9E6] font-pixel text-[7px] text-center">
          DISPLAY: MIDNIGHT MAROON DARK ☾
        </div>
      </div>
    </div>
  );
};

/* ---------------- 4. SECTION 11 FINAL SCREEN: THANKS FOR PLAYING! ---------------- */
export const ErzaFinaleScreen: React.FC<{
  themeMode: ThemeMode;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}> = ({ themeMode, onPlayAgain, onMainMenu }) => {
  const isNight = themeMode === 'NIGHT';

  return (
    <div
      className={`h-full flex flex-col items-center justify-between p-3.5 text-center ${
        isNight
          ? 'bg-gradient-to-b from-[#4A101F] to-[#190D13] text-[#F5E9E6]'
          : 'bg-gradient-to-b from-[#F5E9E6] to-[#D8C4C1] text-[#4A101F]'
      }`}
    >
      <div className="flex items-center gap-2 mt-1">
        <PixelCloud size={22} color="#F5E9E6" className="animate-float-gentle" />
        <PixelSmiley size={24} color="#D8C4C1" />
        <PixelStar size={18} color="#D9A0A9" className="animate-float-gentle" />
      </div>

      <div className="my-1 space-y-1">
        <h2 className="font-pixel text-[10px] sm:text-[11px] leading-snug">
          THANKS FOR PLAYING!
        </h2>
        <p className={`font-pixel text-[7.5px] ${isNight ? 'text-[#D9A0A9]' : 'text-[#800F2F]'}`}>
          HOPE YOU HAD FUN, AUCLAIR!
        </p>

        <div
          className={`mt-2 rounded-xl border-2 px-3 py-2 font-vt text-[17px] leading-[1.2] ${
            isNight
              ? 'bg-[#190D13]/85 border-[#D9A0A9]/60 text-[#F5E9E6]'
              : 'bg-[#F5E9E6]/95 border-[#800F2F] text-[#4A101F]'
          }`}
        >
          <div>KEEP SMILING.</div>
          <div>KEEP DREAMING.</div>
          <div>KEEP BEING AWESOME.</div>
          <div>SEE YOU IN THE NEXT LEVEL!</div>
        </div>

        <p className="pt-1 font-silk text-[8px] opacity-90">
          MADE WITH FRIENDSHIP, JUST FOR YOU — JERYMOTH.
        </p>
      </div>

      <div className="w-full flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            erzaAudio.playConfirm();
            onPlayAgain();
          }}
          className="flex-1 py-2 px-2 rounded-xl bg-[#800F2F] border-2 border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[7px] shadow-[0_3px_0_#190D13] cursor-pointer hover:brightness-110"
        >
          [ PLAY AGAIN ]
        </button>
        <button
          type="button"
          onClick={() => {
            erzaAudio.playConfirm();
            onMainMenu();
          }}
          className="flex-1 py-2 px-2 rounded-xl bg-[#4A101F] border-2 border-[#D9A0A9] text-[#F5E9E6] font-pixel text-[7px] shadow-[0_3px_0_#190D13] cursor-pointer hover:brightness-110"
        >
          [ MAIN MENU ]
        </button>
      </div>
    </div>
  );
};
