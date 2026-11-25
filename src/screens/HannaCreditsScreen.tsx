import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import {
  CharacterSprite,
  PixelHeartIcon,
  PixelStarIcon,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';

export const HannaCreditsScreen: React.FC = () => {
  const { navigate } = useHanna();
  const [paused, setPaused] = useState(false);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full pixel-frame-purple p-4 sm:p-6 space-y-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <PixelStarIcon size={20} color="#FF9B38" />
          <h1 className="font-pixel text-sm sm:text-lg text-[#FF9B38]">
            THANKS FOR PLAYING!
          </h1>
          <PixelStarIcon size={20} color="#FF9B38" />
        </div>

        {/* Scrolling Arcade Credits Window */}
        <div className="relative h-80 sm:h-96 bg-[#8C265A] border-4 border-[#211A2B] overflow-hidden px-4 py-6">
          <div
            className="space-y-7 animate-credits-scroll"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
          >
            <div>
              <p className="font-pixel text-[9px] text-[#8CE5E8]">
                HANNA&apos;S PIXEL ADVENTURE
              </p>
              <p className="font-vt text-2xl text-[#FFF0D5] mt-1">
                A Little Adventure Made Just For You
              </p>
            </div>

            <div>
              <p className="font-pixel text-[9px] text-[#F5A6C8]">SPECIAL THANKS:</p>
              <p className="font-pixel text-sm sm:text-base text-[#FF9B38] mt-1.5">
                HANNALLE DEWYROSE
              </p>
            </div>

            <div>
              <p className="font-pixel text-[9px] text-[#8CE5E8]">GAME DESIGN:</p>
              <p className="font-pixel text-xs text-[#FFF0D5] mt-1.5">
                MADE WITH CARE
              </p>
            </div>

            <div>
              <p className="font-pixel text-[9px] text-[#FFB78C]">PIXEL WORLD:</p>
              <p className="font-pixel text-xs text-[#FFF0D5] mt-1.5">
                CREATED FOR A SPECIAL FRIEND
              </p>
            </div>

            <div>
              <p className="font-pixel text-[9px] text-[#F5A6C8]">VERSION:</p>
              <p className="font-pixel text-xs text-[#8CE5E8] mt-1.5">1.0</p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <CharacterSprite id="hanna" size={64} />
              <PixelHeartIcon size={22} color="#F5A6C8" />
              <CharacterSprite id="pixel-cat" size={64} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="pixel-btn px-4 py-2.5 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{paused ? 'RESUME ROLL' : 'PAUSE ROLL'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('HOME')}
            className="pixel-btn px-6 py-2.5 bg-[#FF9B38] text-[#211A2B] font-pixel text-[10px] cursor-pointer"
          >
            PLAY AGAIN ▶
          </button>
        </div>
      </div>
    </main>
  );
};
