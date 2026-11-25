import React from 'react';
import { Lock, Volume2, VolumeX, Music } from 'lucide-react';
import { useHanna } from '../context/HannaContext';
import { COLLECTIBLE_CARDS } from '../data/hannaData';
import { HannaScreenId } from '../types/hanna';

const NAV_ITEMS: { id: HannaScreenId; label: string }[] = [
  { id: 'HOME', label: 'HOME' },
  { id: 'CHARACTER', label: 'CHARACTER' },
  { id: 'ID_CARD', label: 'ID CARD' },
  { id: 'COLLECTION', label: 'COLLECTION' },
  { id: 'BATTLE', label: 'BATTLE' },
  { id: 'TICTACTOE', label: 'TIC TAC TOE' },
  { id: 'SECRET_ROOM', label: 'SECRET ROOM' },
  { id: 'CREDITS', label: 'CREDITS' },
];

export const GameHudBar: React.FC = () => {
  const {
    screen,
    progress,
    secretRoomUnlocked,
    navigate,
    toggleMusic,
    toggleSfx,
  } = useHanna();

  const cardCount = progress.unlockedCardIds.length;
  const totalCards = COLLECTIBLE_CARDS.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#8C265A] border-b-4 border-[#211A2B] px-3 py-2 shadow-[0_4px_0_#59163A]">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Game Progress Level / Cards Badge */}
        <div className="flex items-center gap-2 shrink-0 tabular-nums">
          <button
            type="button"
            onClick={() => navigate('HOME')}
            className="font-pixel text-[10px] sm:text-xs text-[#FFE4F2] hover:text-[#FF9B38] cursor-pointer whitespace-nowrap"
          >
            HANNA&apos;S QUEST
          </button>
          <span className="font-pixel text-[9px] text-[#8CE5E8] whitespace-nowrap">
            LV.{progress.level}
          </span>
          <span className="font-pixel text-[9px] text-[#F5A6C8] whitespace-nowrap">
            CARDS {cardCount}/{totalCards}
          </span>
        </div>

        {/* Multi-Screen Game Navigation */}
        <nav
          aria-label="Adventure Screen Navigation"
          className="flex flex-wrap items-center gap-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const active = screen === item.id;
            const locked = item.id === 'SECRET_ROOM' && !secretRoomUnlocked;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`px-2 py-1 border-2 border-[#211A2B] font-pixel text-[8px] sm:text-[9px] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer transition-transform ${
                  active
                    ? 'bg-[#FF9B38] text-[#211A2B] translate-y-[-1px]'
                    : locked
                    ? 'bg-[#B83B77] text-[#FFE4F2]/80 hover:bg-[#D14D8D]'
                    : 'bg-[#C24280] text-[#FFF0D5] hover:bg-[#DB5A9A]'
                }`}
              >
                {locked && <Lock className="w-2.5 h-2.5 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Retro Audio Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleMusic}
            aria-label="Toggle retro background music"
            className={`px-2 py-1 border-2 border-[#211A2B] font-pixel text-[8px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              progress.musicEnabled
                ? 'bg-[#F5A6C8] text-[#211A2B]'
                : 'bg-[#6B1D47] text-[#FFF0D5]/80'
            }`}
          >
            <Music className="w-3 h-3" />
            <span>{progress.musicEnabled ? 'BGM ON' : 'BGM OFF'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSfx}
            aria-label="Toggle retro sound effects"
            className={`px-2 py-1 border-2 border-[#211A2B] font-pixel text-[8px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              progress.sfxEnabled
                ? 'bg-[#8CE5E8] text-[#211A2B]'
                : 'bg-[#6B1D47] text-[#FFF0D5]/80'
            }`}
          >
            {progress.sfxEnabled ? (
              <Volume2 className="w-3 h-3" />
            ) : (
              <VolumeX className="w-3 h-3" />
            )}
            <span>{progress.sfxEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
