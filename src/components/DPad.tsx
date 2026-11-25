import React from 'react';
import { ConsoleButtonId } from '../types/lie';

interface DPadProps {
  pressedBtn: ConsoleButtonId | null;
  onPress: (btn: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export const DPad: React.FC<DPadProps> = ({ pressedBtn, onPress }) => {
  return (
    <div className="relative w-[108px] h-[108px] sm:w-[116px] sm:h-[116px] select-none shrink-0">
      {/* Recessed Housing Ring */}
      <div className="absolute inset-0 rounded-full bg-[#06080A] border border-[#334155]/45 shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)]" />

      {/* Vertical Cross Arm */}
      <div className="absolute left-1/2 top-[11px] bottom-[11px] w-[34px] -translate-x-1/2 rounded-md bg-[#090B0E]" />
      {/* Horizontal Cross Arm */}
      <div className="absolute top-1/2 left-[11px] right-[11px] h-[34px] -translate-y-1/2 rounded-md bg-[#090B0E]" />

      {/* UP */}
      <button
        type="button"
        aria-label="D-Pad Up"
        onClick={() => onPress('UP')}
        className={`absolute top-[12px] left-1/2 -translate-x-1/2 w-[32px] h-[34px] rounded-t-md gb-dpad-arm flex items-start justify-center pt-1.5 cursor-pointer ${
          pressedBtn === 'UP' ? 'is-pressed' : ''
        }`}
      >
        <span className="text-[9px] text-[#34D399]/80 leading-none">▲</span>
      </button>

      {/* DOWN */}
      <button
        type="button"
        aria-label="D-Pad Down"
        onClick={() => onPress('DOWN')}
        className={`absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[32px] h-[34px] rounded-b-md gb-dpad-arm flex items-end justify-center pb-1.5 cursor-pointer ${
          pressedBtn === 'DOWN' ? 'is-pressed' : ''
        }`}
      >
        <span className="text-[9px] text-[#34D399]/80 leading-none">▼</span>
      </button>

      {/* LEFT */}
      <button
        type="button"
        aria-label="D-Pad Left"
        onClick={() => onPress('LEFT')}
        className={`absolute left-[12px] top-1/2 -translate-y-1/2 w-[34px] h-[32px] rounded-l-md gb-dpad-arm flex items-center justify-start pl-1.5 cursor-pointer ${
          pressedBtn === 'LEFT' ? 'is-pressed' : ''
        }`}
      >
        <span className="text-[9px] text-[#34D399]/80 leading-none">◀</span>
      </button>

      {/* RIGHT */}
      <button
        type="button"
        aria-label="D-Pad Right"
        onClick={() => onPress('RIGHT')}
        className={`absolute right-[12px] top-1/2 -translate-y-1/2 w-[34px] h-[32px] rounded-r-md gb-dpad-arm flex items-center justify-end pr-1.5 cursor-pointer ${
          pressedBtn === 'RIGHT' ? 'is-pressed' : ''
        }`}
      >
        <span className="text-[9px] text-[#34D399]/80 leading-none">▶</span>
      </button>

      {/* Center Thumb Pivot */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-[#11151B] border border-[#334155]/45 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]" />
    </div>
  );
};
