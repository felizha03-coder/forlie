import React from 'react';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  PixelCloud,
  PixelHeart,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';

export const RosieFinalScreen: React.FC = () => {
  const { navigate, settings } = useRosie();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid relative overflow-hidden flex flex-col items-center justify-center px-4 py-8">
      {settings.animationsEnabled && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="animate-petal absolute w-3 h-2 bg-[#EC4899]/55 border border-[#382033]/40"
              style={{
                left: `${(i * 11 + 4) % 95}%`,
                animationDuration: `${5 + (i % 4) * 1.4}s`,
                animationDelay: `${(i % 5) * 0.7}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-4 flex justify-between px-6 opacity-90"
      >
        <div className="animate-cloud-drift">
          <PixelCloud size={78} />
        </div>
        <div className="animate-cloud-drift-reverse mt-5">
          <PixelCloud size={70} />
        </div>
      </div>

      <section className="relative z-10 w-full max-w-[540px] yellow-card-shell rounded-[26px] p-3">
        <div className="card-magenta-texture rounded-[18px] border-2 border-[#6B2D5C] px-4 sm:px-5 py-5 space-y-4 text-[#2E1028]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                FINALE
              </span>
              <span className="text-sm">☆</span>
              <h1 className="font-body font-extrabold text-base sm:text-lg">
                WORLD EXPLORED!
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-body font-extrabold text-xs">LP</span>
              <span className="font-body font-extrabold text-xl">999</span>
              <EnergyOrb variant="pink" size={18} />
            </div>
          </div>

          <div className="silver-bevel rounded-lg p-1.5">
            <DreamyMeadowScene bubbleText="stay awesome, Rosie <3" heightClass="h-52">
              <div className="flex items-end gap-2">
                <RosieSprite pose="smiling" size={86} />
                <div className="mb-12 animate-heartbeat">
                  <PixelHeart size={18} color="#EC4899" />
                </div>
                <DelonielSprite pose="smiling" size={86} />
              </div>
            </DreamyMeadowScene>
            <div className="pt-1 text-center font-body font-bold text-xs text-[#1E293B]">
              rosie-001 · a little digital world
            </div>
          </div>

          <div className="space-y-1.5 text-center px-1">
            <h2 className="font-pixel text-xs sm:text-sm text-[#181016] leading-relaxed">
              THANKS FOR VISITING ROSIE.EXE!
            </h2>
            <p className="font-body font-bold text-sm text-[#181016]">
              &ldquo;You are special in your own little way, Hannalle Dewyrose.&rdquo;
            </p>
          </div>

          <div className="silver-bevel rounded-xl p-4 font-body text-sm text-[#181016] leading-relaxed text-center">
            No big occasion or formal label—just a cozy pixel corner of the internet built by Deloniel whenever you want a reminder that you&apos;re appreciated.
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-[10px] font-body leading-tight">
              <p className="italic font-bold">Created by Deloniel ♡</p>
              <p className="font-extrabold">for Hannalle Dewyrose · © ROSIE.EXE</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('TITLE')}
              className="pixel-button px-5 py-2.5 bg-[#FCE24F] hover:bg-[#FFF5E8] text-[#181016] font-pixel text-[10px] cursor-pointer"
            >
              [ PLAY AGAIN ]
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
