import React, { useState } from 'react';
import { ArrowLeft, Crown, RotateCw } from 'lucide-react';
import {
  DreamyMeadowScene,
  EnergyOrb,
  PixelHeart,
  PixelStar,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { ROSIE_ID_CARD } from '../data/rosieData';

export const RosieIdCardScreen: React.FC = () => {
  const { navigate, settings, markIdCardFlipped } = useRosie();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    markIdCardFlipped();
    setIsFlipped((prev) => !prev);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header Bar */}
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#6B2D5C] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#181016]">
                  ID PASS
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  ROSIE&apos;S PERSONAL ID CARD
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/90">
                Click or tap the card below to flip it in 3D and read Deloniel&apos;s note!
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="pixel-button px-4 py-2 bg-[#FEF08A] hover:bg-[#FFF9FC] font-pixel text-[9px] text-[#181016] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORLD</span>
            </button>
          </div>
        </div>

        {/* Interactive 3D Flippable Personal ID Card */}
        <div className="w-full max-w-[390px] mx-auto space-y-4">
          <div
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlip();
              }
            }}
            aria-label="Flip Rosie personal ID card"
            className="group card-perspective w-full h-[610px] cursor-pointer select-none"
          >
            <div className={`card-inner-3d ${isFlipped ? 'is-flipped' : ''}`}>
              {/* FRONT SIDE: Rosie's Full Identity & Sprite */}
              <div className="card-face yellow-card-shell rounded-[24px] p-2.5 flex flex-col">
                <div className="relative flex-1 rounded-[14px] border-2 border-[#6B2D5C]/70 card-vip-texture px-3.5 py-3 flex flex-col justify-between overflow-hidden text-[#2E1028]">
                  {/* Hover Holo Shimmer */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 holo-foil opacity-0"
                  />

                  {/* Top Card Strip */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#854D0E]">
                        VIP ID
                      </span>
                      <span className="text-xs">★</span>
                      <h2 className="font-body font-extrabold text-lg text-[#181016]">
                        {ROSIE_ID_CARD.nickname.toUpperCase()}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1 tabular-nums">
                      <span className="font-pixel text-[9px] text-[#6B2D5C]">
                        {ROSIE_ID_CARD.id}
                      </span>
                      <EnergyOrb variant="pink" size={18} />
                    </div>
                  </div>

                  {/* Illustration Frame */}
                  <div className="relative z-10 silver-bevel rounded-lg p-1.5">
                    <DreamyMeadowScene bubbleText="one of a kind ♡" heightClass="h-44">
                      <div
                        className={`flex flex-col items-center ${
                          settings.animationsEnabled ? 'animate-float-slow' : ''
                        }`}
                      >
                        <div className="mb-0.5 px-2 py-0.5 rounded bg-[#FEF08A] border border-[#6B2D5C] inline-flex items-center gap-1 shadow-xs">
                          <Crown className="w-3 h-3 text-[#854D0E]" />
                          <span className="font-pixel text-[6px] text-[#6B2D5C]">
                            {ROSIE_ID_CARD.id}
                          </span>
                        </div>
                        <RosieSprite pose="sending-hearts" size={76} />
                      </div>
                    </DreamyMeadowScene>
                    <div className="pt-1 text-center font-body font-bold text-[10px] text-[#475569]">
                      OFFICIAL ROSIE.EXE PLAYER PASS
                    </div>
                  </div>

                  {/* Structured ID Information Fields */}
                  <div className="relative z-10 silver-bevel rounded-xl p-3 space-y-1.5 text-[11px] sm:text-xs font-body text-[#181016]">
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">NAME:</span>
                      <span className="font-extrabold text-right">{ROSIE_ID_CARD.name}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">NICKNAME:</span>
                      <span className="font-extrabold">{ROSIE_ID_CARD.nickname}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">ID:</span>
                      <span className="font-pixel text-[9px] text-[#C92778] self-center">
                        {ROSIE_ID_CARD.id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">SPECIAL STATUS:</span>
                      <span className="font-extrabold">{ROSIE_ID_CARD.specialStatus}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">CREATED BY:</span>
                      <span className="font-extrabold">{ROSIE_ID_CARD.createdBy}</span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-[#94A3B8]/40 pb-1">
                      <span className="font-extrabold text-[#6B2D5C]">TYPE:</span>
                      <span className="font-extrabold text-right">{ROSIE_ID_CARD.type}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="font-extrabold text-[#6B2D5C]">MOOD:</span>
                      <span className="font-extrabold text-right text-[#C92778]">
                        {ROSIE_ID_CARD.mood}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-body font-extrabold text-[#2E1028] pt-0.5">
                    <span>Illus. Deloniel · © ROSIE.EXE</span>
                    <span className="inline-flex items-center gap-1 text-[#6B2D5C]">
                      <RotateCw className="w-3 h-3" />
                      <span>TAP TO FLIP</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* BACK SIDE: Exact Required Personal Message */}
              <div className="card-face card-face-back yellow-card-shell rounded-[24px] p-2.5 flex flex-col">
                <div className="flex-1 rounded-[14px] border-2 border-[#6B2D5C] p-5 flex flex-col justify-between text-[#481D3F] bg-gradient-to-br from-[#FFFDF7] via-[#FEF9C3] to-[#FFD4E7]">
                  <div className="flex items-center justify-between border-b-2 border-[#F472B6] pb-3">
                    <div>
                      <p className="font-pixel text-[8px] text-[#DB2777]">
                        {ROSIE_ID_CARD.id} · {ROSIE_ID_CARD.specialStatus}
                      </p>
                      <h3 className="font-body font-extrabold text-lg text-[#481D3F]">
                        {ROSIE_ID_CARD.name}
                      </h3>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#FDE047] border-2 border-[#6B2D5C] inline-flex items-center justify-center">
                      <Crown className="w-4 h-4 text-[#6B2D5C]" />
                    </span>
                  </div>

                  <div className="flex justify-center py-2">
                    <div className="relative">
                      <RosieSprite pose="blushing" size={92} />
                      <div className="absolute -top-2 -right-3 animate-heartbeat">
                        <PixelHeart size={20} color="#EC4899" />
                      </div>
                    </div>
                  </div>

                  {/* Required Back-of-Card Message */}
                  <div className="bg-[#FFFDF9] border-2 border-[#F472B6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-[10px] font-body font-extrabold text-[#DB2777]">
                      <span>{ROSIE_ID_CARD.type}</span>
                      <span>★ PERSONAL NOTE</span>
                    </div>
                    <p className="font-body font-bold text-sm sm:text-[15px] leading-relaxed text-[#481D3F]">
                      &ldquo;{ROSIE_ID_CARD.backMessage}&rdquo;
                    </p>
                    <p className="font-body italic font-extrabold text-xs text-[#C92778] text-right">
                      — {ROSIE_ID_CARD.createdBy} ♡
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <PixelStar size={14} color="#A78BFA" />
                      <PixelStar size={14} color="#EC4899" />
                    </div>
                    <p className="font-pixel text-[7.5px] text-[#DB2777]">
                      TAP TO FLIP BACK ↻
                    </p>
                    <div className="flex items-center gap-1">
                      <PixelStar size={14} color="#EC4899" />
                      <PixelStar size={14} color="#A78BFA" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleFlip}
              className="pixel-button px-5 py-2.5 bg-[#FCE24F] hover:bg-white text-[#181016] font-pixel text-[9px] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'SHOW FRONT SIDE' : 'FLIP ID CARD ♡'}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
