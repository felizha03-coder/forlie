import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LIE_REMINDERS } from '../../data/lieData';
import { ConsoleButtonId, ReminderItem } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';
import { getDrawnReminderIds, saveDrawnReminderIds } from '../../utils/lieStorage';

interface LittleRemindersProps {
  onBack: () => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
}

export const LittleReminders: React.FC<LittleRemindersProps> = ({ onBack, navSignal }) => {
  const [drawnIds, setDrawnIds] = useState<number[]>(() => getDrawnReminderIds());
  const [currentReminder, setCurrentReminder] = useState<ReminderItem | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);

  const drawReminder = useCallback(() => {
    if (isOpening) return;
    lieAudio.playCapsuleOpen();
    setIsOpening(true);
    setFlipped(false);

    window.setTimeout(() => {
      let pool = LIE_REMINDERS.filter((r) => !drawnIds.includes(r.id));
      let updatedIds = drawnIds;
      if (pool.length === 0) {
        pool = LIE_REMINDERS;
        updatedIds = [];
      }

      const pick = pool[Math.floor(Math.random() * pool.length)];
      const nextIds = [...updatedIds, pick.id];
      setDrawnIds(nextIds);
      saveDrawnReminderIds(nextIds);
      setCurrentReminder(pick);
      setIsOpening(false);

      window.setTimeout(() => setFlipped(true), 60);
    }, 440);
  }, [drawnIds, isOpening]);

  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    if (navSignal.btn === 'B') {
      lieAudio.playBack();
      onBack();
    } else if (navSignal.btn === 'A' || navSignal.btn === 'START') {
      drawReminder();
    }
  }, [navSignal, drawReminder, onBack]);

  return (
    <div className="h-full w-full flex flex-col justify-between p-3 sm:p-3.5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1.5 mb-2">
        <div>
          <h2 className="font-pixel text-[9px] text-[#34D399]">LITTLE REMINDERS</h2>
          <p className="font-silk text-[8px] text-[#94A3B8]">
            DRAWN: {drawnIds.length} / {LIE_REMINDERS.length} CAPSULES
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            lieAudio.playBack();
            onBack();
          }}
          className="px-2 py-1 rounded border border-[#334155] bg-[#0B100E] hover:border-[#34D399] font-silk text-[8px] text-[#CBD5E1] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-2.5 h-2.5" /> MENU
        </button>
      </div>

      {/* Center Capsule / Card Display */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0">
        {!currentReminder ? (
          <div className="flex flex-col items-center text-center gap-3">
            {/* Pixel Mystery Box / Capsule */}
            <button
              type="button"
              onClick={drawReminder}
              disabled={isOpening}
              className={`w-24 h-24 rounded-2xl border-2 border-[#34D399]/70 bg-[#0D1A14] hover:border-[#A3E635] shadow-[0_0_24px_rgba(16,185,129,0.28)] flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                isOpening ? 'animate-capsule-shake' : 'animate-float-gentle'
              }`}
            >
              <Sparkles className="w-8 h-8 text-[#A3E635] mb-1" />
              <span className="font-pixel text-[8px] text-[#34D399]">BOX // 36</span>
            </button>
            <p className="font-vt text-[18px] text-[#CBD5E1] max-w-[250px] leading-tight">
              Open a pixel capsule whenever you need grounding, comfort, or a quick laugh.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[300px] h-[162px] card-perspective">
            <div className={`card-inner-3d ${flipped ? 'is-flipped' : ''}`}>
              {/* Front Back-of-Card */}
              <div className="card-face rounded-xl border-2 border-[#34D399]/60 bg-[#0B1411] flex flex-col items-center justify-center p-3">
                <Sparkles className="w-7 h-7 text-[#34D399] animate-pulse mb-1.5" />
                <span className="font-pixel text-[8px] text-[#A3E635]">DECRYPTING CAPSULE...</span>
              </div>

              {/* Revealed Reminder Card */}
              <div className="card-face card-face-back rounded-xl border border-[#34D399]/70 bg-gradient-to-br from-[#0F1B16] to-[#080C0B] p-3 flex flex-col justify-between shadow-[0_0_18px_rgba(16,185,129,0.18)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#34D399]/40 font-silk text-[8px] text-[#34D399]">
                    {currentReminder.categoryLabel}
                  </span>
                  <span className="font-pixel text-[8px] text-[#94A3B8]">
                    #{String(currentReminder.id).padStart(2, '0')}
                  </span>
                </div>

                <p className="font-vt text-[18px] sm:text-[19px] leading-[1.18] text-[#E2E8F0] my-auto py-1">
                  &ldquo;{currentReminder.text}&rdquo;
                </p>

                <div className="flex items-center justify-between font-silk text-[8px] text-[#94A3B8]">
                  <span>FOR LIE // KEEP GOING</span>
                  <span className="text-[#A3E635]">✦</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Draw Action Button */}
      <button
        type="button"
        onClick={drawReminder}
        disabled={isOpening}
        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#34D399] hover:to-[#4ADE80] text-[#050608] font-pixel text-[8px] sm:text-[9px] tracking-[0.08em] shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-60"
      >
        {isOpening ? 'OPENING CAPSULE...' : 'GET A RANDOM REMINDER (A)'}
      </button>
    </div>
  );
};
