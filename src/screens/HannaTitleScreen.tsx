import React, { useState } from 'react';
import { Volume2, VolumeX, Music, X } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import {
  CharacterSprite,
  HauntedMansionBackdrop,
  PixelHeartIcon,
  PixelStarIcon,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';

const PARTY_LINES = [
  'HANNA: "Ooh! That spooky mansion looks super cool!"',
  'PIXEL CAT: "Meow! I smell treasure inside!"',
  'MYSTERY GIRL: "Follow the lantern light along the path!"',
  'LITTLE GHOST: "Boo! Just kidding—want some pixel snacks?"',
];

export const HannaTitleScreen: React.FC = () => {
  const { navigate, progress, toggleMusic, toggleSfx } = useHanna();
  const [modal, setModal] = useState<'HOW' | 'CREDITS' | null>(null);
  const [partySpeech, setPartySpeech] = useState<string>(PARTY_LINES[0]);

  const cycleSpeech = (index: number) => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();
    setPartySpeech(PARTY_LINES[index]);
  };

  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-8">
      <HauntedMansionBackdrop />
      <div aria-hidden="true" className="retro-scanlines pointer-events-none absolute inset-0" />

      {/* Top Version & Sound Bar inside Title Scene */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="pixel-frame-navy px-3 py-1.5">
          <span className="font-pixel text-[8px] sm:text-[9px] text-[#8CE5E8] tracking-wide">
            VERSION 1.0 — MADE FOR HANNA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMusic}
            className="pixel-btn px-3 py-1.5 bg-[#B83B77] text-[#FFF0D5] font-pixel text-[8px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-[#FFE4F2]" />
            <span>{progress.musicEnabled ? 'MUSIC: ON' : 'MUSIC: OFF'}</span>
          </button>
          <button
            type="button"
            onClick={toggleSfx}
            className="pixel-btn px-3 py-1.5 bg-[#B83B77] text-[#FFF0D5] font-pixel text-[8px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {progress.sfxEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#8CE5E8]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#FFB78C]" />
            )}
            <span>{progress.sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Center Stylized Retro Title & Arcade Buttons */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-6 text-center space-y-6">
        <div className="pixel-frame-purple px-5 sm:px-10 py-6 sm:py-8 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <PixelStarIcon size={20} color="#FF9B38" />
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#F5A6C8]">
              RECIPIENT: HANNALLE DEWYROSE
            </span>
            <PixelStarIcon size={20} color="#FF9B38" />
          </div>

          <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl leading-snug text-[#FFF0D5] drop-shadow-[4px_4px_0_#211A2B]">
            <span className="block text-[#F5A6C8]">HANNA&apos;S</span>
            <span className="block text-[#FF9B38] mt-2">PIXEL ADVENTURE</span>
          </h1>

          <p className="font-silk font-bold text-sm sm:text-lg text-[#8CE5E8] tracking-wide">
            &ldquo;A LITTLE WORLD OF SURPRISES&rdquo;
          </p>

          <div className="pt-1">
            <span className="inline-block font-pixel text-[10px] sm:text-xs text-[#FFB78C] animate-pixel-blink">
              ▶ PRESS START ◀
            </span>
          </div>

          {/* Main Arcade Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('CHARACTER')}
              className="w-full sm:w-auto pixel-btn px-7 py-3.5 bg-[#FF9B38] text-[#211A2B] font-pixel text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              START GAME
            </button>

            <button
              type="button"
              onClick={() => {
                hannaAudio.unlockFromUserGesture();
                hannaAudio.playClick();
                setModal('HOW');
              }}
              className="w-full sm:w-auto pixel-btn px-5 py-3.5 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
            >
              HOW TO PLAY
            </button>

            <button
              type="button"
              onClick={() => {
                hannaAudio.unlockFromUserGesture();
                hannaAudio.playClick();
                setModal('CREDITS');
              }}
              className="w-full sm:w-auto pixel-btn px-5 py-3.5 bg-[#F5A6C8] text-[#211A2B] font-pixel text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
            >
              CREDITS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Adventure Party Trail */}
      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-2.5">
        <div className="mx-auto max-w-xl pixel-frame-navy px-4 py-2 text-center">
          <p className="font-vt text-lg sm:text-xl text-[#FFF0D5] leading-tight">
            {partySpeech}
          </p>
        </div>

        <div className="flex items-end justify-center gap-4 sm:gap-10 pt-1">
          {(
            [
              { id: 'hanna', label: 'EXPLORER', idx: 0 },
              { id: 'pixel-cat', label: 'PIXEL CAT', idx: 1 },
              { id: 'mystery-girl', label: 'ADVENTURER', idx: 2 },
              { id: 'little-ghost', label: 'LIL GHOST', idx: 3 },
            ] as const
          ).map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => cycleSpeech(member.idx)}
              className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
              aria-label={`Inspect ${member.label}`}
            >
              <div className="transition-transform group-hover:-translate-y-1">
                <CharacterSprite id={member.id} size={74} />
              </div>
              <span className="px-1.5 py-0.5 bg-[#8C265A]/95 border-2 border-[#211A2B] font-pixel text-[7px] text-[#FFE4F2]">
                {member.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* HOW TO PLAY / CREDITS MODALS */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-[#6B1D47]/80 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-lg pixel-frame-purple p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-[#F5A6C8] pb-3">
              <div className="flex items-center gap-2">
                <PixelHeartIcon size={18} color="#FFE4F2" />
                <h2 className="font-pixel text-xs sm:text-sm text-[#FF9B38]">
                  {modal === 'HOW' ? 'HOW TO PLAY' : 'GAME CREDITS'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Close modal"
                className="pixel-btn p-1.5 bg-[#F5A6C8] text-[#211A2B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modal === 'HOW' ? (
              <div className="space-y-3 bg-[#8C265A] border-2 border-[#211A2B] p-4 font-vt text-xl text-[#FFF0D5] leading-snug">
                <p>
                  1. <span className="text-[#FF9B38]">CHARACTER SELECT:</span> Pick your pixel avatar—Hanna, Pixel Cat, Mystery Girl, or Little Ghost!
                </p>
                <p>
                  2. <span className="text-[#F5A6C8]">ID CARD &amp; CARDS:</span> Inspect Hannalle&apos;s Player ID Card (with PNG download) and flip all 6 collectible cards!
                </p>
                <p>
                  3. <span className="text-[#8CE5E8]">MINI-GAMES:</span> Defeat a monster in Battle and win a round of Tic Tac Toe to unlock the Secret Gift Room!
                </p>
              </div>
            ) : (
              <div className="space-y-3 bg-[#8C265A] border-2 border-[#211A2B] p-4 font-vt text-xl text-[#FFF0D5] leading-snug">
                <p className="text-[#FFE4F2] font-bold">
                  A Special Digital Gift Crafted for Hannalle Dewyrose!
                </p>
                <p>
                  Built as a cozy retro 8-bit/16-bit pixel adventure full of collectible cards, playful monster battles, and hidden surprises.
                </p>
                <p className="text-[#8CE5E8]">VERSION 1.0 · MADE WITH CARE ♡</p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              {modal === 'CREDITS' && (
                <button
                  type="button"
                  onClick={() => {
                    setModal(null);
                    navigate('CREDITS');
                  }}
                  className="pixel-btn px-4 py-2 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
                >
                  FULL CREDITS SCREEN
                </button>
              )}
              <button
                type="button"
                onClick={() => setModal(null)}
                className="pixel-btn px-4 py-2 bg-[#FF9B38] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
