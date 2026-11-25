import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import { CharacterSprite, PixelStarIcon } from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';
import { PLAYABLE_CHARACTERS } from '../data/hannaData';

const PixelStatBar: React.FC<{
  label: string;
  value: number;
  fillColor: string;
}> = ({ label, value, fillColor }) => {
  const totalBlocks = 10;
  const filledBlocks = Math.max(1, Math.round((value / 100) * totalBlocks));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-pixel text-[9px] tabular-nums">
        <span className="text-[#FFF0D5]">{label}</span>
        <span className="text-[#FFB78C]">{value}/100</span>
      </div>
      <div className="grid grid-cols-10 gap-1 p-1 bg-[#6B1D47] border-2 border-[#211A2B]">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className="h-3 transition-colors"
            style={{
              backgroundColor: i < filledBlocks ? fillColor : '#9E2B6B',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const CharacterSelectScreen: React.FC = () => {
  const { progress, selectCharacter, navigate } = useHanna();
  const initialIndex = Math.max(
    0,
    PLAYABLE_CHARACTERS.findIndex((c) => c.id === progress.selectedCharacterId)
  );
  const [cursorIndex, setCursorIndex] = useState(initialIndex);
  const [bounceKey, setBounceKey] = useState(0);

  const current = PLAYABLE_CHARACTERS[cursorIndex];
  const isEquipped = progress.selectedCharacterId === current.id;

  const stepCharacter = (dir: -1 | 1) => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();
    setCursorIndex(
      (prev) => (prev + dir + PLAYABLE_CHARACTERS.length) % PLAYABLE_CHARACTERS.length
    );
    setBounceKey((k) => k + 1);
  };

  const handleSelect = () => {
    selectCharacter(current.id);
    setBounceKey((k) => k + 1);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full pixel-frame-purple p-4 sm:p-6 space-y-5">
        {/* Arcade Header */}
        <div className="bg-[#8C265A] border-4 border-[#211A2B] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PixelStarIcon size={20} color="#FF9B38" />
            <h1 className="font-pixel text-xs sm:text-base text-[#FFF0D5]">
              CHOOSE YOUR CHARACTER
            </h1>
          </div>
          <span className="px-2.5 py-1 bg-[#B83B77] border-2 border-[#211A2B] font-pixel text-[8px] text-[#8CE5E8]">
            PLAYER AVATAR · {cursorIndex + 1}/{PLAYABLE_CHARACTERS.length}
          </span>
        </div>

        {/* Main Arcade Two-Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: Framed Character Preview + Arrow Controls */}
          <div className="lg:col-span-5 pixel-frame-navy p-4 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-[#F5A6C8] border-2 border-[#211A2B] font-pixel text-[8px] text-[#211A2B]">
                PREVIEW
              </span>
              {isEquipped && (
                <span className="px-2 py-1 bg-[#8CE5E8] border-2 border-[#211A2B] font-pixel text-[8px] text-[#211A2B] inline-flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  ACTIVE HERO
                </span>
              )}
            </div>

            {/* Framed Spotlight Stage */}
            <div className="relative h-64 bg-[#F5A6C8] border-4 border-[#211A2B] flex flex-col items-center justify-center overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-14 bg-[#C24280] border-t-4 border-[#211A2B]"
              />
              <div
                key={bounceKey}
                className="relative z-10 transition-transform duration-150 scale-100"
              >
                <CharacterSprite id={current.id} size={132} />
              </div>
              <span className="relative z-10 mt-1 px-2.5 py-0.5 bg-[#8C265A] border-2 border-[#211A2B] font-pixel text-[8px] text-[#FFE4F2]">
                {current.roleTitle.toUpperCase()}
              </span>
            </div>

            {/* Arrow Navigation & Thumbnail Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => stepCharacter(-1)}
                  aria-label="Previous character"
                  className="pixel-btn px-4 py-2.5 bg-[#FF9B38] text-[#211A2B] font-pixel text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>PREV</span>
                </button>

                <span className="font-pixel text-[9px] text-[#FFF0D5] text-center">
                  {current.name}
                </span>

                <button
                  type="button"
                  onClick={() => stepCharacter(1)}
                  aria-label="Next character"
                  className="pixel-btn px-4 py-2.5 bg-[#FF9B38] text-[#211A2B] font-pixel text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>NEXT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PLAYABLE_CHARACTERS.map((char, idx) => {
                  const focused = idx === cursorIndex;
                  const active = char.id === progress.selectedCharacterId;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        hannaAudio.unlockFromUserGesture();
                        hannaAudio.playClick();
                        setCursorIndex(idx);
                        setBounceKey((k) => k + 1);
                      }}
                      className={`p-1.5 border-2 border-[#211A2B] flex flex-col items-center gap-1 cursor-pointer ${
                        focused
                          ? 'bg-[#FF9B38] text-[#211A2B]'
                          : active
                          ? 'bg-[#D14D8D] text-[#8CE5E8]'
                          : 'bg-[#B83B77] text-[#FFF0D5] hover:bg-[#D14D8D]'
                      }`}
                    >
                      <CharacterSprite id={char.id} size={42} animateIdle={false} />
                      <span className="font-pixel text-[6.5px] truncate w-full text-center">
                        {char.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Stats, Special Info Box & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="pixel-frame-navy p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#F5A6C8] pb-3">
                <div>
                  <h2 className="font-pixel text-base sm:text-lg text-[#FF9B38]">
                    {current.name}
                  </h2>
                  <p className="font-silk text-xs sm:text-sm text-[#FFE4F2]">
                    {current.roleTitle}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#B83B77] border-2 border-[#211A2B] font-pixel text-[8px] text-[#8CE5E8]">
                  LVL {progress.level}
                </span>
              </div>

              <p className="font-vt text-xl sm:text-2xl text-[#FFF0D5] leading-snug">
                {current.description}
              </p>

              {/* Pixelated Stat Bars */}
              <div className="space-y-3 pt-1">
                <PixelStatBar label="HP" value={current.hp} fillColor="#F5A6C8" />
                <PixelStatBar label="SPEED" value={current.speed} fillColor="#8CE5E8" />
                <PixelStatBar label="LUCK" value={current.luck} fillColor="#FF9B38" />
              </div>

              <div className="bg-[#B83B77] border-2 border-[#211A2B] p-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-pixel text-[8px] text-[#FFE4F2]">
                  SPECIAL SKILL:
                </span>
                <span className="font-pixel text-[9px] text-[#8CE5E8]">
                  {current.specialSkill}
                </span>
                <p className="w-full font-vt text-lg text-[#FFF0D5]">
                  {current.specialDesc}
                </p>
              </div>
            </div>

            {/* Special Character INFO Window */}
            <div className="bg-[#FFF0D5] border-4 border-[#211A2B] shadow-[4px_4px_0_#59163A] p-3.5 text-[#211A2B] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FF9B38] border-2 border-[#211A2B] font-pixel text-[8px]">
                  INFO
                </span>
                <span className="font-pixel text-[8px] text-[#A82C6A]">
                  ADVENTURER FILE
                </span>
              </div>
              <p className="font-vt text-xl leading-tight">{current.infoNote}</p>
            </div>

            {/* Select + Continue Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSelect}
                className="flex-1 pixel-btn py-3 px-5 bg-[#FF9B38] text-[#211A2B] font-pixel text-[10px] sm:text-xs cursor-pointer"
              >
                {isEquipped ? 'CHARACTER SELECTED ✓' : 'SELECT CHARACTER'}
              </button>

              <button
                type="button"
                onClick={() => navigate('ID_CARD')}
                className="pixel-btn py-3 px-5 bg-[#F5A6C8] text-[#211A2B] font-pixel text-[10px] cursor-pointer whitespace-nowrap"
              >
                VIEW ID CARD ▶
              </button>

              <button
                type="button"
                onClick={() => navigate('BATTLE')}
                className="pixel-btn py-3 px-5 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[10px] cursor-pointer whitespace-nowrap"
              >
                GO BATTLE ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
