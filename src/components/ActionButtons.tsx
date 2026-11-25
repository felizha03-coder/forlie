import React from 'react';
import { ConsoleButtonId } from '../types/lie';

interface ActionButtonsProps {
  pressedBtn: ConsoleButtonId | null;
  onPress: (btn: 'A' | 'B' | 'SELECT' | 'START') => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ pressedBtn, onPress }) => {
  return (
    <div className="flex flex-col items-end gap-4 select-none">
      {/* Diagonal Emerald Illuminated B / A Cluster */}
      <div className="flex items-center gap-4 -rotate-12 pr-1">
        <div className="flex flex-col items-center gap-1 translate-y-2.5">
          <button
            type="button"
            aria-label="B Button (Back)"
            onClick={() => onPress('B')}
            className={`w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full gb-emerald-btn flex items-center justify-center font-pixel text-[13px] text-[#04120C] cursor-pointer ${
              pressedBtn === 'B' ? 'is-pressed' : ''
            }`}
          >
            B
          </button>
          <span className="font-silk text-[8px] tracking-widest text-[#94A3B8]">BACK</span>
        </div>

        <div className="flex flex-col items-center gap-1 -translate-y-1.5">
          <button
            type="button"
            aria-label="A Button (Select / Confirm)"
            onClick={() => onPress('A')}
            className={`w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full gb-emerald-btn flex items-center justify-center font-pixel text-[13px] text-[#04120C] cursor-pointer ${
              pressedBtn === 'A' ? 'is-pressed' : ''
            }`}
          >
            A
          </button>
          <span className="font-silk text-[8px] tracking-widest text-[#34D399]">OK</span>
        </div>
      </div>

      {/* SELECT & START Rubberized Pills */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex flex-col items-center gap-1 -rotate-12">
          <button
            type="button"
            aria-label="Select Button"
            onClick={() => onPress('SELECT')}
            className={`w-11 h-3.5 rounded-full gb-pill-dark cursor-pointer ${
              pressedBtn === 'SELECT' ? 'is-pressed' : ''
            }`}
          />
          <span className="font-silk text-[8px] tracking-[0.18em] text-[#94A3B8]">SELECT</span>
        </div>

        <div className="flex flex-col items-center gap-1 -rotate-12">
          <button
            type="button"
            aria-label="Start Button"
            onClick={() => onPress('START')}
            className={`w-11 h-3.5 rounded-full gb-pill-dark cursor-pointer ${
              pressedBtn === 'START' ? 'is-pressed' : ''
            }`}
          />
          <span className="font-silk text-[8px] tracking-[0.18em] text-[#34D399]">START</span>
        </div>
      </div>
    </div>
  );
};
