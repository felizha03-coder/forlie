import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { erzaAudio } from '../../audio/erzaAudio';
import {
  PixelCloud,
  PixelFlowerIcon,
  PixelGamepadIcon,
  PixelSmiley,
  PixelStar,
} from '../../components/ErzaPixelArt';
import { ERZA_REMINDERS } from '../../data/erzaData';
import { ThemeMode } from '../../types/erza';

interface ErzaRemindersScreenProps {
  themeMode: ThemeMode;
  discoveredIndices: number[];
  onDiscoverReminder: (idx: number) => void;
  onBack: () => void;
  confirmTrigger: number;
}

export const ErzaRemindersScreen: React.FC<ErzaRemindersScreenProps> = ({
  themeMode,
  discoveredIndices,
  onDiscoverReminder,
  onBack,
  confirmTrigger,
}) => {
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const modalCardRef = useRef<HTMLDivElement | null>(null);

  const isNight = themeMode === 'NIGHT';
  const discoveredSet = new Set(discoveredIndices);

  const openCapsule = (idx: number) => {
    if (shakingIdx !== null) return;
    erzaAudio.playClick();
    setShakingIdx(idx);
    window.setTimeout(() => {
      setShakingIdx(null);
      setActiveIdx(idx);
      onDiscoverReminder(idx);
      erzaAudio.playCapsuleOpen();
    }, 440);
  };

  const openRandomCapsule = () => {
    const undiscovered = ERZA_REMINDERS.map((_, i) => i).filter(
      (i) => !discoveredSet.has(i)
    );
    const pool =
      undiscovered.length > 0 ? undiscovered : ERZA_REMINDERS.map((_, i) => i);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    openCapsule(chosen);
  };

  useEffect(() => {
    if (activeIdx === null || !modalCardRef.current) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      gsap.fromTo(
        modalCardRef.current,
        { scale: 0.72, y: 18, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.36, ease: 'back.out(1.7)' }
      );
    }
  }, [activeIdx]);

  useEffect(() => {
    if (confirmTrigger === 0) return;
    if (activeIdx !== null) {
      setActiveIdx(null);
    } else {
      openRandomCapsule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger]);

  const renderCapsuleDecor = (idx: number) => {
    const mod = idx % 5;
    if (mod === 0) return <PixelStar size={14} color="#D9A0A9" />;
    if (mod === 1) return <PixelCloud size={16} color="#F5E9E6" />;
    if (mod === 2) return <PixelSmiley size={14} color="#D8C4C1" />;
    if (mod === 3) return <PixelFlowerIcon size={14} />;
    return <PixelGamepadIcon size={15} />;
  };

  return (
    <div className="h-full flex flex-col p-3 relative overflow-hidden">
      {/* Header & Progress */}
      <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer shrink-0 ${
            isNight
              ? 'bg-[#190D13]/90 border-[#B76E79]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]/60'
          }`}
        >
          ◀ MENU
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <PixelStar size={14} color="#B76E79" />
          <span
            className={`font-pixel text-[7px] sm:text-[7.5px] truncate ${
              isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
            }`}
          >
            DISCOVERED: {discoveredIndices.length}/50
          </span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center mb-1.5 shrink-0">
        <h2
          className={`font-pixel text-[9px] ${
            isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
          }`}
        >
          LITTLE REMINDERS
        </h2>
        <p
          className={`font-silk text-[8px] mt-0.5 leading-tight ${
            isNight ? 'text-[#D9A0A9]' : 'text-[#800F2F]'
          }`}
        >
          OPEN ONE WHENEVER YOU NEED A LITTLE SUNSHINE.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[#4A101F]/25 overflow-hidden mb-1.5 shrink-0 border border-[#800F2F]/45">
        <div
          className="h-full bg-gradient-to-r from-[#800F2F] via-[#B76E79] to-[#D8C4C1] transition-all duration-300"
          style={{ width: `${(discoveredIndices.length / 50) * 100}%` }}
        />
      </div>

      {/* Quick Random Capsule Action */}
      <button
        type="button"
        onClick={openRandomCapsule}
        className="mb-2 py-1.5 px-3 rounded-xl bg-[#800F2F] hover:brightness-110 border-2 border-[#D8C4C1] text-[#F5E9E6] font-pixel text-[7.5px] shadow-[0_3px_0_#190D13] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 shrink-0"
      >
        <PixelStar size={13} color="#F5E9E6" />
        <span>OPEN RANDOM CAPSULE</span>
        <PixelSmiley size={13} color="#D8C4C1" />
      </button>

      {/* 50 Holographic Maroon Mystery Capsules */}
      <div className="flex-1 min-h-0 overflow-y-auto lcd-scroll pr-1">
        <div className="grid grid-cols-5 gap-1.5 pb-1">
          {ERZA_REMINDERS.map((_, idx) => {
            const isFound = discoveredSet.has(idx);
            const isShaking = shakingIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => openCapsule(idx)}
                title={`Capsule #${idx + 1}`}
                className={`relative rounded-xl py-1.5 px-1 border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isShaking ? 'animate-capsule-shake ring-2 ring-[#F5E9E6]' : ''
                } ${
                  isFound
                    ? 'holo-card-surface border-[#F5E9E6] text-[#4A101F] shadow-sm'
                    : isNight
                    ? 'bg-[#4A101F]/90 border-[#922B45]/65 text-[#D9A0A9] hover:border-[#F5E9E6] hover:-translate-y-0.5'
                    : 'bg-[#641C32]/92 border-[#B76E79] text-[#F5E9E6] hover:bg-[#800F2F] hover:-translate-y-0.5'
                }`}
              >
                <span className="font-pixel text-[6.5px]">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                {renderCapsuleDecor(idx)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Revealed Capsule Modal Overlay */}
      {activeIdx !== null && (
        <div
          onClick={() => setActiveIdx(null)}
          className="absolute inset-0 z-20 bg-[#190D13]/88 flex items-center justify-center p-3"
        >
          <div
            ref={modalCardRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[300px] holo-card-surface rounded-2xl border-2 border-[#F5E9E6] p-4 text-center shadow-2xl relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <PixelStar size={16} color="#800F2F" className="animate-float-gentle" />
              <span className="font-pixel text-[8px] text-[#4A101F] bg-[#F5E9E6]/95 px-2 py-1 rounded-md border border-[#800F2F]">
                CARD #{String(activeIdx + 1).padStart(2, '0')}
              </span>
              {renderCapsuleDecor(activeIdx)}
            </div>

            <div className="bg-[#F5E9E6]/95 rounded-xl border-2 border-[#800F2F] p-3.5 my-2 shadow-inner">
              <p className="font-vt text-[20px] sm:text-[21px] text-[#4A101F] leading-tight">
                &ldquo;{ERZA_REMINDERS[activeIdx]}&rdquo;
              </p>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={openRandomCapsule}
                className="px-3 py-1.5 rounded-lg bg-[#800F2F] text-[#F5E9E6] border border-[#D8C4C1] font-pixel text-[7.5px] cursor-pointer hover:brightness-110"
              >
                NEXT CAPSULE
              </button>
              <button
                type="button"
                onClick={() => {
                  erzaAudio.playClick();
                  setActiveIdx(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#190D13] text-[#F5E9E6] border border-[#B76E79] font-pixel text-[7.5px] cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
