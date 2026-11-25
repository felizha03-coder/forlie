import React from 'react';
import { Download } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import {
  CharacterSprite,
  PixelHeartIcon,
  PixelStarIcon,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';
import { downloadHannaIdCardPng } from '../utils/idCardPng';

const ID_FIELDS = [
  { label: 'NAME', value: 'HANNALLE DEWYROSE' },
  { label: 'CLASS', value: 'SPECIAL ADVENTURER' },
  { label: 'RANK', value: 'ONE OF A KIND' },
  { label: 'STATUS', value: 'LEGENDARY FRIEND' },
  { label: 'ROLE', value: 'MAIN CHARACTER' },
  { label: 'SPECIAL ABILITY', value: 'MAKING THE WORLD MORE FUN' },
  { label: 'CARD NUMBER', value: 'HANNA-001' },
];

export const PlayerIdCardScreen: React.FC = () => {
  const { navigate } = useHanna();

  const handleDownload = () => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playSelect();
    downloadHannaIdCardPng();
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-5">
        {/* Pink Retro Computer Window Card */}
        <section className="pixel-frame-pink p-3 sm:p-5 space-y-4 text-[#211A2B]">
          {/* Retro Computer Window Title Bar */}
          <div className="bg-[#C24280] border-4 border-[#211A2B] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 text-[#FFF0D5]">
            <div className="flex items-center gap-2 min-w-0">
              <PixelHeartIcon size={16} color="#F5A6C8" />
              <h1 className="font-pixel text-[9px] sm:text-xs truncate">
                PLAYER IDENTIFICATION CARD
              </h1>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-4 h-4 bg-[#8CE5E8] border-2 border-[#211A2B] inline-block" />
              <span className="w-4 h-4 bg-[#FF9B38] border-2 border-[#211A2B] inline-block" />
            </div>
          </div>

          {/* Inner Cream Computer Profile Screen */}
          <div className="bg-[#FFF0D5] border-4 border-[#211A2B] p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Column: Portrait Frame, Character Badge, Hearts, Rarity */}
              <div className="md:col-span-4 space-y-3">
                <div className="bg-[#8C265A] border-4 border-[#211A2B] p-4 flex flex-col items-center gap-3 relative">
                  <div className="w-full flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#8CE5E8] border-2 border-[#211A2B] font-pixel text-[7px] text-[#211A2B]">
                      HANNA-001
                    </span>
                    <div className="flex items-center gap-1">
                      <PixelHeartIcon size={13} color="#F5A6C8" />
                      <PixelHeartIcon size={13} color="#F5A6C8" />
                      <PixelHeartIcon size={13} color="#FF9B38" />
                    </div>
                  </div>

                  {/* Decorative Inner Frame */}
                  <div className="w-full py-4 bg-[#F5A6C8] border-2 border-[#FFF0D5] flex items-center justify-center">
                    <CharacterSprite id="hanna" size={120} />
                  </div>

                  {/* Small Character Badge */}
                  <div className="w-full px-2 py-1.5 bg-[#FFB78C] border-2 border-[#211A2B] flex items-center justify-center gap-1.5">
                    <PixelStarIcon size={12} color="#FF9B38" />
                    <span className="font-pixel text-[7.5px] text-[#211A2B]">
                      RARITY: LEGENDARY
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Retro Computer Terminal Data Fields */}
              <div className="md:col-span-8 space-y-2.5">
                <div className="flex items-center justify-between border-b-2 border-[#211A2B] pb-2">
                  <span className="font-pixel text-[9px] text-[#A82C6A]">
                    ADVENTURER PROFILE LOG
                  </span>
                  <span className="font-pixel text-[10px] text-[#FF9B38] animate-pixel-blink">
                    _
                  </span>
                </div>

                <dl className="space-y-2">
                  {ID_FIELDS.map((field) => (
                    <div
                      key={field.label}
                      className="bg-[#FFDCEB] border-2 border-[#211A2B] px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                    >
                      <dt className="font-pixel text-[8px] text-[#A82C6A]">
                        {field.label}:
                      </dt>
                      <dd className="font-silk font-bold text-xs sm:text-sm text-[#211A2B]">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Personalized Message Strip */}
            <div className="bg-[#FFB78C] border-4 border-[#211A2B] p-4 flex items-start gap-3">
              <PixelHeartIcon size={22} color="#F5A6C8" className="shrink-0 mt-0.5" />
              <p className="font-vt text-xl sm:text-2xl text-[#211A2B] leading-snug">
                &ldquo;Every great adventure needs someone who makes the journey memorable. This little world was created just for you!&rdquo;
                <span className="inline-block ml-1.5 w-2.5 h-4 bg-[#211A2B] align-middle animate-pixel-blink" />
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownload}
                className="pixel-btn px-5 py-3 bg-[#FF9B38] text-[#211A2B] font-pixel text-[10px] inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD ID CARD</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('COLLECTION')}
                className="pixel-btn px-5 py-3 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
              >
                CARD COLLECTION ▶
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
