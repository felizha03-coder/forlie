import React, { useEffect, useState } from 'react';
import { ArrowLeft, Crown, Lock, Sparkles, Unlock } from 'lucide-react';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  PixelHeart,
  PixelStar,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { ROSIE_CARDS } from '../data/rosieData';
import { LEGENDARY_CARD_UNLOCK_LP, RosieCardData } from '../types/rosie';

const CARD_META: Record<
  string,
  {
    badge: string;
    caption: string;
    bubble: string;
    lpLabel: string;
    ability1Title: string;
    ability1Desc: string;
    ability2Title: string;
    ability2Desc: string;
    flavor: string;
  }
> = {
  'card-rosie': {
    badge: 'BASIC',
    caption: '01/06 · limited edition human',
    bubble: 'hey there! <3',
    lpLabel: '999',
    ability1Title: 'one of a kind',
    ability1Desc:
      'Unpredictable but adorable. Effortlessly turns ordinary days into memorable stories.',
    ability2Title: 'instant spotlight',
    ability2Desc:
      'A single greeting brightens the whole room before anyone notices.',
    flavor:
      'Hannalle Dewyrose — genuinely worth appreciating every single day.',
  },
  'card-deloniel': {
    badge: 'BASIC',
    caption: '02/06 · tiny world builder',
    bubble: "just for fun <3",
    lpLabel: '999',
    ability1Title: 'quiet thoughtfulness',
    ability1Desc:
      'Notices small things and spends hours crafting a whole pixel corner just to see you grin.',
    ability2Title: 'pixel surprise',
    ability2Desc:
      'Hides secret easter eggs, music loops, and warm notes across every screen.',
    flavor:
      'Slightly dramatic, clean-shaven, and always down for a rematch.',
  },
  'card-rosie-vip': {
    badge: 'VIP',
    caption: '03/06 · rosie-001 vip pass',
    bubble: 'vip player ★',
    lpLabel: 'MAX',
    ability1Title: 'all-access smile',
    ability1Desc:
      'Grants permanent VIP privileges, unlimited replays, and good vibes in ROSIE.EXE.',
    ability2Title: 'priority notice',
    ability2Desc:
      'Flip this card to reveal Deloniel’s official VIP pass note for Hannalle. ★',
    flavor:
      'Exclusive VIP edition created for Rosie. Flip card to read the note!',
  },
  'card-duo': {
    badge: 'BASIC',
    caption: '15/06 · special connection',
    bubble: "you deserve nice things <3",
    lpLabel: '999',
    ability1Title: 'always glad it happened',
    ability1Desc:
      'Out of all the random people in the world, somehow you became someone worth cheering for. ✿',
    ability2Title: 'double laugh combo',
    ability2Desc:
      'Turns late chats and silly mini-games into instant good moods.',
    flavor:
      'Warm appreciation, playful banter, and zero unnecessary labels.',
  },
};

export const RosieCardsScreen: React.FC = () => {
  const { navigate, progress, markCardFlipped, awardLovePoints } = useRosie();
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [duoSurpriseOpen, setDuoSurpriseOpen] = useState(false);
  const [duoPhase, setDuoPhase] = useState<'walk' | 'chat' | 'laugh'>('walk');

  const duoUnlocked = progress.lovePoints >= LEGENDARY_CARD_UNLOCK_LP;

  useEffect(() => {
    if (!duoSurpriseOpen) return;
    setDuoPhase('walk');
    const t1 = window.setTimeout(() => setDuoPhase('chat'), 800);
    const t2 = window.setTimeout(() => setDuoPhase('laugh'), 1700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [duoSurpriseOpen]);

  const handleCardClick = (card: RosieCardData) => {
    const isLocked =
      card.unlockRequirementLp > 0 && progress.lovePoints < card.unlockRequirementLp;
    if (isLocked) return;

    markCardFlipped(card.id);
    setFlippedMap((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6">
      <div className="max-w-[1380px] mx-auto space-y-6">
        {/* Bright Header Card */}
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#6B2D5C] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#481D3F]">
                  COLLECTION
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#481D3F]">
                  ROSIE&apos;S CARD COLLECTION ♡
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#481D3F]/90">
                Tap any card to flip in 3D and read the message on the back · Inspected:{' '}
                {progress.flippedCards.length} / {ROSIE_CARDS.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="pixel-button px-4 py-2 bg-[#FEF08A] hover:bg-[#FFF9FC] font-pixel text-[9px] text-[#481D3F] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORLD</span>
            </button>
          </div>
        </div>

        {/* Collectible Trading Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {ROSIE_CARDS.map((card) => {
            const isFlipped = Boolean(flippedMap[card.id]);
            const isVip = card.id === 'card-rosie-vip';
            const isLocked =
              card.unlockRequirementLp > 0 &&
              progress.lovePoints < card.unlockRequirementLp;
            const meta = CARD_META[card.id];

            return (
              <div key={card.id} className="w-full max-w-[340px] mx-auto space-y-3">
                <div
                  onClick={() => handleCardClick(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card);
                    }
                  }}
                  aria-label={`Flip ${card.name} collectible card`}
                  className={`group card-perspective w-full h-[575px] ${
                    isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className={`card-inner-3d ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* FRONT FACE */}
                    <div className="card-face yellow-card-shell rounded-[24px] p-2.5 flex flex-col">
                      <div
                        className={`relative flex-1 rounded-[14px] border-2 border-[#6B2D5C]/65 ${
                          isVip ? 'card-vip-texture' : 'card-magenta-texture'
                        } px-3 py-2.5 flex flex-col justify-between overflow-hidden text-[#2E1028]`}
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 holo-foil opacity-0"
                        />

                        {/* TOP HEADER BAR */}
                        <div className="relative z-10 flex items-center justify-between gap-1.5 pb-1">
                          <div className="flex items-center gap-1 min-w-0">
                            <span
                              className={`basic-silver-tag px-2 py-0.5 font-body font-extrabold italic text-[9px] tracking-wide shrink-0 ${
                                isVip ? 'text-[#854D0E]' : 'text-[#2E1028]'
                              }`}
                            >
                              {meta.badge}
                            </span>
                            <span className="text-xs shrink-0">
                              {isVip ? '★' : '☆'}
                            </span>
                            <h2 className="font-body font-extrabold text-[16px] tracking-tight text-[#2E1028] truncate">
                              {card.id === 'card-duo'
                                ? 'Rosie&Deloniel'
                                : card.id === 'card-rosie-vip'
                                ? 'Rosie VIP'
                                : card.id === 'card-rosie'
                                ? 'Rosie'
                                : 'Deloniel'}
                            </h2>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 tabular-nums">
                            <span className="font-body font-extrabold text-[10px]">
                              LP
                            </span>
                            <span className="font-body font-extrabold text-[18px] leading-none">
                              {meta.lpLabel}
                            </span>
                            <EnergyOrb variant="pink" size={18} />
                          </div>
                        </div>

                        {/* METALLIC SILVER ILLUSTRATION FRAME */}
                        <div className="relative z-10 silver-bevel rounded-md p-1.5">
                          {isLocked ? (
                            <div className="h-44 border border-[#94A3B8] bg-gradient-to-b from-[#FCE7F3] to-[#E9D5FF] text-[#481D3F] flex flex-col items-center justify-center p-4 text-center gap-2">
                              <Lock className="w-8 h-8 text-[#DB2777]" />
                              <p className="font-pixel text-[8px] text-[#6B2D5C]">
                                UNLOCKS AT {card.unlockRequirementLp} LP
                              </p>
                              <p className="font-body text-xs text-[#DB2777] font-bold">
                                ({progress.lovePoints} / {card.unlockRequirementLp} LP)
                              </p>
                            </div>
                          ) : (
                            <DreamyMeadowScene
                              bubbleText={meta.bubble}
                              heightClass="h-44"
                              showCompanions={card.id === 'card-duo' || isVip}
                            >
                              {card.id === 'card-rosie' && (
                                <RosieSprite pose="waving" size={76} />
                              )}
                              {card.id === 'card-deloniel' && (
                                <DelonielSprite pose="sending-hearts" size={76} />
                              )}
                              {isVip && (
                                <div className="relative flex flex-col items-center">
                                  <div className="mb-0.5 px-2 py-0.5 rounded bg-[#FEF08A] border border-[#6B2D5C] inline-flex items-center gap-1 shadow-xs">
                                    <Crown className="w-3 h-3 text-[#854D0E]" />
                                    <span className="font-pixel text-[6px] text-[#6B2D5C]">
                                      VIP
                                    </span>
                                  </div>
                                  <RosieSprite pose="sending-hearts" size={74} />
                                </div>
                              )}
                              {card.id === 'card-duo' && (
                                <div className="flex items-end gap-1.5">
                                  <RosieSprite pose="smiling" size={72} />
                                  <div className="mb-11 animate-heartbeat">
                                    <PixelHeart size={16} color="#EC4899" />
                                  </div>
                                  <DelonielSprite pose="smiling" size={72} />
                                </div>
                              )}
                            </DreamyMeadowScene>
                          )}

                          <div className="pt-1 text-center font-body font-bold text-[10px] text-[#475569]">
                            {meta.caption}
                          </div>
                        </div>

                        {/* ABILITY 1 */}
                        <div className="relative z-10 pt-1.5 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 shrink-0">
                              <EnergyOrb variant="psychic" size={16} />
                              <EnergyOrb variant="pink" size={16} />
                            </div>
                            <h3 className="font-body font-extrabold text-[14px] text-[#2E1028] text-center flex-1">
                              {meta.ability1Title}
                            </h3>
                            <span className="font-body font-bold text-sm shrink-0">×</span>
                          </div>
                          <p className="font-body font-semibold text-[11.5px] leading-[1.3] text-[#2E1028]">
                            {meta.ability1Desc}
                          </p>
                        </div>

                        {/* ABILITY 2 */}
                        <div className="relative z-10 pt-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 shrink-0">
                              <EnergyOrb variant="pink" size={16} />
                              <EnergyOrb variant="pink" size={16} />
                              <EnergyOrb variant="pink" size={16} />
                            </div>
                            <h3 className="font-body font-extrabold text-[14px] text-[#2E1028] flex-1 text-center pr-6">
                              {meta.ability2Title}
                            </h3>
                          </div>
                          <p className="font-body font-semibold text-[11.5px] leading-[1.3] text-[#2E1028]">
                            {meta.ability2Desc}
                          </p>
                        </div>

                        {/* BOTTOM STATS & FOOTER */}
                        <div className="relative z-10 pt-1 space-y-1">
                          <div className="grid grid-cols-12 gap-1.5 items-center text-[9.5px] font-body font-bold">
                            <div className="col-span-7 silver-bevel rounded-full px-2 py-0.5 flex items-center justify-between gap-0.5 text-[#2E1028]">
                              <span className="inline-flex items-center gap-0.5">
                                weak <EnergyOrb variant="dark" size={12} /> ×2
                              </span>
                              <span className="text-[#94A3B8]">|</span>
                              <span className="inline-flex items-center gap-0.5">
                                resist <EnergyOrb variant="psychic" size={12} /> -30
                              </span>
                            </div>

                            <div className="col-span-5 silver-bevel rounded-full px-2 py-0.5 flex items-center justify-between gap-0.5 text-[#2E1028]">
                              <span>retreat</span>
                              <div className="flex items-center gap-0.5">
                                {[0, 1, 2, 3, 4].map((s) => (
                                  <EnergyOrb key={s} variant="star" size={10} />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-2 pt-0.5 text-[#2E1028]">
                            <div className="text-[8.5px] leading-tight shrink-0 space-y-0.5 font-body">
                              <p className="italic font-bold">Illus. Deloniel</p>
                              <p className="font-extrabold text-[9.5px]">ROSIE-001</p>
                              <p className="text-[8px] font-semibold">© ROSIE.EXE</p>
                            </div>
                            <p className="font-body italic font-semibold text-[9.5px] leading-tight text-right max-w-[62%]">
                              {meta.flavor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="card-face card-face-back yellow-card-shell rounded-[24px] p-2.5 flex flex-col">
                      <div
                        className={`flex-1 rounded-[14px] border-2 border-[#6B2D5C] p-4 flex flex-col justify-between text-[#481D3F] ${
                          isVip
                            ? 'bg-gradient-to-br from-[#FFFDF7] via-[#FEF9C3] to-[#FFD4E7]'
                            : 'bg-gradient-to-br from-[#FFFDF9] via-[#FFE8F4] to-[#E9D5FF]/65'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b-2 border-[#F472B6] pb-2.5">
                          <div>
                            <p className="font-pixel text-[7px] text-[#DB2777]">
                              {card.number} · {card.rarity}
                            </p>
                            <span className="font-body font-extrabold text-base text-[#481D3F]">
                              {card.backTitle ?? card.name}
                            </span>
                          </div>
                          {isVip ? (
                            <span className="w-8 h-8 rounded-full bg-[#FDE047] border-2 border-[#6B2D5C] inline-flex items-center justify-center">
                              <Crown className="w-4 h-4 text-[#6B2D5C]" />
                            </span>
                          ) : (
                            <PixelHeart size={20} color="#EC4899" />
                          )}
                        </div>

                        <div
                          className={`rounded-xl border-2 p-3.5 space-y-2 ${
                            isVip
                              ? 'bg-[#FFFDF9] border-[#FDE047] shadow-xs'
                              : 'bg-[#FFFDF9] border-[#F472B6]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-body font-extrabold text-[#DB2777]">
                            <span>{card.type}</span>
                            <span>★ SPECIAL NOTE</span>
                          </div>
                          <p className="font-body font-bold text-xs sm:text-[13px] leading-relaxed text-[#481D3F] whitespace-pre-line">
                            {card.backNote}
                          </p>
                          {card.backSignature && (
                            <p className="font-body italic font-extrabold text-xs text-[#C92778] text-right pt-0.5">
                              {card.backSignature}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 font-pixel text-[7.5px] tabular-nums">
                          {Object.entries(card.stats).map(([key, val]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between uppercase">
                                <span className="text-[#6B2D5C]">{key}</span>
                                <span className="text-[#DB2777]">{val}</span>
                              </div>
                              <div className="w-full h-2 bg-[#FFD4E7] border border-[#6B2D5C]/50 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    isVip ? 'bg-[#FDE047]' : 'bg-[#EC4899]'
                                  }`}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-center font-pixel text-[7px] text-[#DB2777]">
                          TAP TO FLIP BACK ↻
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {card.id === 'card-duo' && (
                  <button
                    type="button"
                    disabled={!duoUnlocked}
                    onClick={() => {
                      awardLovePoints(20, 'Legendary Card Surprise ♡');
                      setDuoSurpriseOpen(true);
                    }}
                    className={`w-full pixel-button py-2.5 font-pixel text-[9px] inline-flex items-center justify-center gap-2 ${
                      duoUnlocked
                        ? 'bg-[#EC4899] hover:bg-[#DB2777] text-white cursor-pointer'
                        : 'bg-[#FFF9FC] text-[#6B2D5C]/60 cursor-not-allowed'
                    }`}
                  >
                    {duoUnlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>OPEN LEGENDARY SURPRISE ♡</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>UNLOCKS AT {LEGENDARY_CARD_UNLOCK_LP} LP</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LEGENDARY CARD SURPRISE MODAL */}
      {duoSurpriseOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#6B2D5C]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDuoSurpriseOpen(false)}
        >
          <div
            className="w-full max-w-lg yellow-card-shell rounded-[24px] p-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-magenta-texture rounded-2xl border-2 border-[#6B2D5C] p-5 sm:p-6 text-center space-y-5">
              <div className="flex items-center justify-center gap-2 font-body font-extrabold text-base text-[#2E1028]">
                <Sparkles className="w-4 h-4" />
                <span>LEGENDARY CARD SURPRISE</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="silver-bevel rounded-lg p-1.5">
                <DreamyMeadowScene
                  bubbleText={
                    duoPhase === 'laugh'
                      ? 'haha stop!! <3'
                      : duoPhase === 'chat'
                      ? 'you deserve nice things <3'
                      : undefined
                  }
                  heightClass="h-48"
                >
                  <div className="flex items-end gap-2">
                    <RosieSprite
                      pose={duoPhase === 'laugh' ? 'blushing' : 'waving'}
                      size={76}
                    />
                    <div className="mb-12 animate-heartbeat">
                      <PixelHeart size={18} color="#EC4899" />
                    </div>
                    <DelonielSprite
                      pose={duoPhase === 'laugh' ? 'sending-hearts' : 'blushing'}
                      size={76}
                    />
                  </div>
                </DreamyMeadowScene>
              </div>

              <div className="silver-bevel rounded-xl p-4 space-y-1.5 text-[#481D3F]">
                <p className="font-body font-extrabold text-base">
                  &ldquo;You are special in your own little way, Rosie.&rdquo;
                </p>
                <p className="font-body italic font-bold text-xs">— Deloniel ♡</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <PixelStar size={18} color="#FEF08A" />
                <button
                  type="button"
                  onClick={() => setDuoSurpriseOpen(false)}
                  className="pixel-button px-6 py-2.5 bg-[#FEF08A] hover:bg-[#FFF9FC] text-[#481D3F] font-pixel text-[10px] cursor-pointer"
                >
                  CLOSE ♡
                </button>
                <PixelStar size={18} color="#FEF08A" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
