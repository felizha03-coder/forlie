import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import {
  CharacterSprite,
  MonsterSprite,
  PixelHeartIcon,
  PixelStarIcon,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';
import { COLLECTIBLE_CARDS } from '../data/hannaData';
import { CardRarity, CollectibleCardData } from '../types/hanna';

const RARITY_COLORS: Record<CardRarity, { bg: string; text: string }> = {
  COMMON: { bg: '#FFF0D5', text: '#211A2B' },
  RARE: { bg: '#8CE5E8', text: '#211A2B' },
  EPIC: { bg: '#FFB78C', text: '#211A2B' },
  LEGENDARY: { bg: '#FF9B38', text: '#211A2B' },
};

const CardIllustration: React.FC<{ card: CollectibleCardData }> = ({ card }) => {
  switch (card.illustrationKey) {
    case 'hanna':
      return <CharacterSprite id="hanna" size={86} />;
    case 'explorer':
      return <CharacterSprite id="mystery-girl" size={86} />;
    case 'pixel-cat':
      return <CharacterSprite id="pixel-cat" size={86} />;
    case 'slime-king':
      return <MonsterSprite id="slime-king" size={86} />;
    case 'lucky-star':
      return (
        <div className="flex flex-col items-center gap-1 animate-pixel-bob">
          <PixelStarIcon size={64} color="#FF9B38" />
          <div className="flex gap-2">
            <PixelStarIcon size={20} color="#8CE5E8" />
            <PixelStarIcon size={20} color="#F5A6C8" />
          </div>
        </div>
      );
    case 'legendary-friend':
      return (
        <div className="flex items-end gap-1">
          <CharacterSprite id="hanna" size={68} />
          <PixelHeartIcon size={20} color="#F5A6C8" className="mb-8" />
          <CharacterSprite id="pixel-cat" size={64} />
        </div>
      );
  }
};

export const HannaCollectionScreen: React.FC = () => {
  const { progress, discoverCard, navigate } = useHanna();
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const unlockedCount = progress.unlockedCardIds.length;
  const totalCount = COLLECTIBLE_CARDS.length;

  const handleCardClick = (card: CollectibleCardData) => {
    const isUnlocked = progress.unlockedCardIds.includes(card.id);
    if (!isUnlocked) {
      hannaAudio.unlockFromUserGesture();
      hannaAudio.playClick();
      return;
    }
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playCardFlip();
    discoverCard(card.id);
    setFlippedIds((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <section className="pixel-frame-purple p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelStarIcon size={20} color="#FF9B38" />
              <h1 className="font-pixel text-xs sm:text-base text-[#FFF0D5]">
                HANNA&apos;S CARD COLLECTION
              </h1>
            </div>
            <p className="font-vt text-xl text-[#8CE5E8]">
              Click any unlocked card to flip and read its lore · Complete mini-games to discover hidden cards!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#8C265A] border-3 border-[#211A2B] px-4 py-2 font-pixel text-[10px] text-[#FF9B38] tabular-nums">
              {unlockedCount}/{totalCount} CARDS DISCOVERED
            </div>
          </div>
        </section>

        {/* 6 Collectible Trading Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIBLE_CARDS.map((card) => {
            const isUnlocked = progress.unlockedCardIds.includes(card.id);
            const isFlipped = Boolean(flippedIds[card.id]);
            const rarityStyle = RARITY_COLORS[card.rarity];

            return (
              <div key={card.id} className="space-y-2.5">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(card)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card);
                    }
                  }}
                  aria-label={`Collectible card ${card.name}`}
                  className={`card-perspective w-full h-[430px] ${
                    isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div className={`card-inner-3d ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* FRONT FACE */}
                    <div
                      className="card-face border-4 border-[#211A2B] shadow-[6px_6px_0_#6B1D47] p-3 flex flex-col justify-between transition-transform hover:-translate-y-1"
                      style={{ backgroundColor: card.frameColor }}
                    >
                      <div
                        className="flex-1 border-3 border-[#211A2B] p-3 flex flex-col justify-between"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        {/* Top Card Name + HP */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span
                              className="inline-block px-2 py-0.5 border-2 border-[#211A2B] font-pixel text-[7px] mb-1"
                              style={{
                                backgroundColor: rarityStyle.bg,
                                color: rarityStyle.text,
                              }}
                            >
                              {card.rarity}
                            </span>
                            <h2
                              className={`font-pixel text-[11px] leading-snug ${
                                card.bgColor === '#F5A6C8'
                                  ? 'text-[#211A2B]'
                                  : 'text-[#FFF0D5]'
                              }`}
                            >
                              {card.name}
                            </h2>
                          </div>

                          <div className="px-2 py-1 bg-[#FFF0D5] border-2 border-[#211A2B] font-pixel text-[9px] text-[#211A2B] shrink-0 tabular-nums">
                            HP {card.hp}
                          </div>
                        </div>

                        {/* Pixel Art Illustration Window */}
                        <div className="h-40 bg-[#8C265A] border-3 border-[#211A2B] flex flex-col items-center justify-center relative overflow-hidden p-2">
                          {isUnlocked ? (
                            <>
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 opacity-20"
                                style={{
                                  backgroundImage:
                                    'radial-gradient(#FFF0D5 1px, transparent 1px)',
                                  backgroundSize: '10px 10px',
                                }}
                              />
                              <div className="relative z-10">
                                <CardIllustration card={card} />
                              </div>
                            </>
                          ) : (
                            <div className="text-center space-y-2 px-2">
                              <Lock className="w-8 h-8 text-[#FF9B38] mx-auto" />
                              <p className="font-pixel text-[8px] text-[#FFB78C]">
                                LOCKED CARD
                              </p>
                              <p className="font-vt text-base text-[#FFF0D5] leading-tight">
                                {card.unlockHint}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Special Ability & Short Desc */}
                        <div className="bg-[#FFF0D5] border-2 border-[#211A2B] p-2.5 text-[#211A2B] space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-pixel text-[7.5px] text-[#A82C6A]">
                              ★ {card.specialAbility}
                            </span>
                            <span className="font-pixel text-[7px] text-[#FF9B38]">
                              {card.number}
                            </span>
                          </div>
                          <p className="font-vt text-base leading-tight">
                            {isUnlocked ? card.description : 'Complete the mission to reveal this card!'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE (Lore Details) */}
                    <div className="card-face card-face-back border-4 border-[#211A2B] shadow-[6px_6px_0_#6B1D47] bg-[#F5A6C8] p-3 flex flex-col">
                      <div className="flex-1 bg-[#8C265A] border-3 border-[#8CE5E8] p-4 flex flex-col justify-between text-[#FFF0D5]">
                        <div className="flex items-center justify-between border-b-2 border-[#F5A6C8] pb-2">
                          <span className="font-pixel text-[8px] text-[#FFE4F2]">
                            {card.number} · {card.rarity}
                          </span>
                          <PixelHeartIcon size={16} color="#FFE4F2" />
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-pixel text-xs text-[#FF9B38]">
                            {card.name}
                          </h3>
                          <p className="font-silk text-[11px] text-[#8CE5E8]">
                            {card.subtitle}
                          </p>
                          <div className="bg-[#C24280] border-2 border-[#211A2B] p-3">
                            <p className="font-vt text-xl text-[#FFF0D5] leading-snug">
                              {card.backLore}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t-2 border-[#F5A6C8] font-pixel text-[8px] text-[#FFE4F2]">
                          <span>HP {card.hp}</span>
                          <span>CLICK TO FLIP ↻</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Unlock Shortcut Button for Locked Cards */}
                {!isUnlocked && card.unlockCondition && (
                  <button
                    type="button"
                    onClick={() => {
                      if (card.unlockCondition === 'battle-win') navigate('BATTLE');
                      if (card.unlockCondition === 'ttt-win') navigate('TICTACTOE');
                      if (card.unlockCondition === 'secret-chest') navigate('SECRET_ROOM');
                    }}
                    className="w-full pixel-btn py-2 px-3 bg-[#FF9B38] text-[#211A2B] font-pixel text-[8.5px] cursor-pointer"
                  >
                    {card.unlockCondition === 'battle-win'
                      ? 'GO TO MONSTER BATTLE ▶'
                      : card.unlockCondition === 'ttt-win'
                      ? 'GO TO TIC TAC TOE ▶'
                      : 'GO TO SECRET ROOM ▶'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
