import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import {
  PixelHeartIcon,
  PixelStarIcon,
  TreasureChestSprite,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';

export const HannaSecretRoomScreen: React.FC = () => {
  const {
    progress,
    secretRoomUnlocked,
    openSecretChest,
    navigate,
    resetAdventure,
  } = useHanna();

  const battleDone = progress.defeatedMonsterIds.length >= 1;
  const tttDone = progress.tttWins >= 1;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        {!secretRoomUnlocked ? (
          <section className="pixel-frame-purple p-6 sm:p-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto bg-[#8C265A] border-4 border-[#211A2B] flex items-center justify-center">
              <Lock className="w-10 h-10 text-[#FF9B38]" />
            </div>

            <h1 className="font-pixel text-sm sm:text-lg text-[#FF9B38]">
              SECRET TREASURE ROOM LOCKED
            </h1>
            <p className="font-vt text-2xl text-[#FFF0D5] max-w-lg mx-auto">
              Complete both mini-game quests to unseal the Treasure Chest inside this hidden room!
            </p>

            {/* Clear Achievement Checklist */}
            <div className="max-w-md mx-auto space-y-2.5 text-left">
              <div className="bg-[#8C265A] border-3 border-[#211A2B] p-3 flex items-center justify-between gap-3">
                <span className="font-pixel text-[8.5px] text-[#FFF0D5]">
                  1. WIN A MONSTER BATTLE
                </span>
                <span
                  className={`px-2 py-0.5 font-pixel text-[8px] border-2 border-[#211A2B] ${
                    battleDone
                      ? 'bg-[#8CE5E8] text-[#211A2B]'
                      : 'bg-[#C24280] text-[#FFE4F2]'
                  }`}
                >
                  {battleDone ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> DONE
                    </span>
                  ) : (
                    '0/1'
                  )}
                </span>
              </div>

              <div className="bg-[#8C265A] border-3 border-[#211A2B] p-3 flex items-center justify-between gap-3">
                <span className="font-pixel text-[8.5px] text-[#FFF0D5]">
                  2. WIN A PIXEL TIC TAC TOE ROUND
                </span>
                <span
                  className={`px-2 py-0.5 font-pixel text-[8px] border-2 border-[#211A2B] ${
                    tttDone
                      ? 'bg-[#8CE5E8] text-[#211A2B]'
                      : 'bg-[#C24280] text-[#FFE4F2]'
                  }`}
                >
                  {tttDone ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> DONE
                    </span>
                  ) : (
                    '0/1'
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {!battleDone && (
                <button
                  type="button"
                  onClick={() => navigate('BATTLE')}
                  className="pixel-btn px-5 py-3 bg-[#FF9B38] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
                >
                  PLAY MONSTER BATTLE ▶
                </button>
              )}
              {!tttDone && (
                <button
                  type="button"
                  onClick={() => navigate('TICTACTOE')}
                  className="pixel-btn px-5 py-3 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
                >
                  PLAY TIC TAC TOE ▶
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="pixel-frame-purple p-5 sm:p-8 text-center space-y-6 relative overflow-hidden">
            {/* Floating Stars & Pixel Hearts when Chest Opened */}
            {progress.chestOpened && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-44 flex justify-around"
              >
                <PixelStarIcon size={20} color="#FF9B38" className="animate-confetti" />
                <PixelHeartIcon size={20} color="#F5A6C8" className="animate-confetti" />
                <PixelStarIcon size={20} color="#8CE5E8" className="animate-confetti" />
                <PixelHeartIcon size={20} color="#FFB78C" className="animate-confetti" />
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF9B38]" />
              <h1 className="font-pixel text-sm sm:text-lg text-[#FF9B38]">
                SECRET GIFT ROOM
              </h1>
              <Sparkles className="w-5 h-5 text-[#FF9B38]" />
            </div>

            {/* Pixel Treasure Room Showcase */}
            <div className="bg-[#8C265A] border-4 border-[#211A2B] py-8 px-4 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={openSecretChest}
                className="cursor-pointer transition-transform hover:scale-105 focus:outline-none"
                aria-label="Open treasure chest"
              >
                <TreasureChestSprite opened={progress.chestOpened} size={144} />
              </button>

              {!progress.chestOpened ? (
                <button
                  type="button"
                  onClick={openSecretChest}
                  className="pixel-btn px-6 py-3 bg-[#FF9B38] text-[#211A2B] font-pixel text-xs animate-pixel-bob cursor-pointer"
                >
                  CLICK TO OPEN CHEST ★
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5A6C8] border-2 border-[#211A2B] font-pixel text-[8px] text-[#211A2B]">
                  <PixelStarIcon size={14} color="#FF9B38" />
                  <span>UNLOCKED: THE LEGENDARY FRIEND CARD!</span>
                </div>
              )}
            </div>

            {/* Revealed Warm Friendship Gift Letter */}
            {progress.chestOpened && (
              <div className="space-y-5">
                <div className="bg-[#FFF0D5] border-4 border-[#211A2B] p-5 sm:p-6 text-left text-[#211A2B] space-y-3 shadow-[6px_6px_0_#6B1D47]">
                  <div className="flex items-center justify-between border-b-2 border-[#211A2B] pb-2">
                    <span className="font-pixel text-xs text-[#A82C6A]">
                      HEY HANNA!
                    </span>
                    <PixelHeartIcon size={18} color="#F5A6C8" />
                  </div>

                  <p className="font-vt text-2xl leading-snug">
                    This little adventure is something I made especially for you.
                  </p>
                  <p className="font-vt text-2xl leading-snug">
                    I hope it brings a smile to your face and gives you a fun little break from your everyday routine.
                  </p>
                  <p className="font-vt text-2xl leading-snug">
                    Thanks for being an awesome friend. Keep being yourself, keep doing amazing things, and never stop enjoying your own adventure!
                  </p>
                  <p className="font-pixel text-xs sm:text-sm text-[#FF9B38] bg-[#8C265A] px-3 py-2 border-2 border-[#211A2B] inline-block">
                    YOU ARE ONE OF A KIND!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('COLLECTION')}
                    className="pixel-btn px-5 py-3 bg-[#F5A6C8] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
                  >
                    SEE LEGENDARY CARD
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('CREDITS')}
                    className="pixel-btn px-5 py-3 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
                  >
                    VIEW CREDITS ▶
                  </button>
                  <button
                    type="button"
                    onClick={resetAdventure}
                    className="pixel-btn px-5 py-3 bg-[#FF9B38] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
                  >
                    REPLAY ADVENTURE ↻
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};
