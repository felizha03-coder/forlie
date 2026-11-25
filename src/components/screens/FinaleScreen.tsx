import React, { useEffect, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { ConsoleButtonId } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';
import { getDrawnReminderIds, getHighScores } from '../../utils/lieStorage';
import { LIE_REMINDERS } from '../../data/lieData';

interface FinaleScreenProps {
  onReplayExperience: () => void;
  onBackMenu: () => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
}

export const FinaleScreen: React.FC<FinaleScreenProps> = ({
  onReplayExperience,
  onBackMenu,
  navSignal,
}) => {
  const scores = getHighScores();
  const drawnCount = getDrawnReminderIds().length;
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);

  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    if (navSignal.btn === 'START') {
      lieAudio.playVictory();
      onReplayExperience();
    } else if (navSignal.btn === 'B') {
      lieAudio.playBack();
      onBackMenu();
    }
  }, [navSignal, onReplayExperience, onBackMenu]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-3.5 text-center select-none">
      {/* Top Tag */}
      <div className="w-full flex items-center justify-between font-silk text-[8px] text-[#94A3B8] border-b border-[#10B981]/30 pb-1">
        <span>END // CREDITS</span>
        <span className="text-[#34D399]">PLAYER: LIE</span>
      </div>

      {/* Center Message */}
      <div className="my-auto flex flex-col items-center gap-2.5 px-1">
        <div className="w-11 h-11 rounded-xl border border-[#34D399]/70 bg-[#0A1712] shadow-[0_0_22px_rgba(16,185,129,0.4)] flex items-center justify-center animate-float-gentle">
          <Sparkles className="w-6 h-6 text-[#A3E635]" />
        </div>

        <h2 className="font-pixel text-[10px] sm:text-[11px] leading-relaxed text-[#34D399] drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
          THANKS FOR PLAYING, LIE.
        </h2>

        <p className="font-pixel text-[8px] text-[#E2E8F0]">
          THIS LITTLE WORLD IS JUST FOR YOU.
        </p>

        <p className="font-vt text-[18px] leading-tight text-[#CBD5E1] max-w-[270px]">
          &ldquo;No matter how far life takes us, I&apos;m glad we met.&rdquo;
        </p>

        {/* Quick Run Stats */}
        <div className="w-full grid grid-cols-3 gap-1.5 pt-1 text-center">
          <div className="rounded border border-[#1E293B] bg-[#0A0E0C] py-1 px-1">
            <p className="font-silk text-[7px] text-[#94A3B8]">SNAKE</p>
            <p className="font-pixel text-[8px] text-[#34D399]">{scores.SNAKE}</p>
          </div>
          <div className="rounded border border-[#1E293B] bg-[#0A0E0C] py-1 px-1">
            <p className="font-silk text-[7px] text-[#94A3B8]">STARS</p>
            <p className="font-pixel text-[8px] text-[#34D399]">{scores.STARS}</p>
          </div>
          <div className="rounded border border-[#1E293B] bg-[#0A0E0C] py-1 px-1">
            <p className="font-silk text-[7px] text-[#94A3B8]">NOTES</p>
            <p className="font-pixel text-[8px] text-[#A3E635]">
              {drawnCount}/{LIE_REMINDERS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            lieAudio.playBack();
            onBackMenu();
          }}
          className="px-3 py-2 rounded-lg border border-[#334155] bg-[#0B100E] hover:border-[#34D399] font-pixel text-[8px] text-[#CBD5E1] cursor-pointer"
        >
          MENU (B)
        </button>
        <button
          type="button"
          onClick={() => {
            lieAudio.playVictory();
            onReplayExperience();
          }}
          className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#34D399] hover:to-[#4ADE80] text-[#050608] font-pixel text-[8px] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> PLAY AGAIN (START)
        </button>
      </div>
    </div>
  );
};
