import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { LIE_LOVE_LETTER } from '../../data/lieData';
import { ConsoleButtonId } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';

interface LoveLetterProps {
  onBack: () => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ onBack, navSignal }) => {
  const [opened, setOpened] = useState(false);
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);
  const fullBody = useMemo(
    () =>
      [
        LIE_LOVE_LETTER.salutation,
        '',
        ...LIE_LOVE_LETTER.paragraphs.flatMap((p) => [p, '']),
        LIE_LOVE_LETTER.closing,
        LIE_LOVE_LETTER.signature,
      ].join('\n'),
    []
  );

  const [charCount, setCharCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  const openEnvelope = () => {
    if (opened) return;
    lieAudio.playEnvelopeOpen();
    setOpened(true);
    setCharCount(0);
    setTypingDone(false);
  };

  const replayTyping = () => {
    lieAudio.playConfirm();
    setCharCount(0);
    setTypingDone(false);
  };

  useEffect(() => {
    if (!opened || typingDone) return;
    const timer = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= fullBody.length) {
          setTypingDone(true);
          window.clearInterval(timer);
          return prev;
        }
        return prev + 2;
      });
    }, 22);
    return () => window.clearInterval(timer);
  }, [opened, typingDone, fullBody]);

  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    if (navSignal.btn === 'B') {
      lieAudio.playBack();
      onBack();
    } else if (navSignal.btn === 'A' || navSignal.btn === 'START') {
      if (!opened) {
        openEnvelope();
      } else if (!typingDone) {
        setCharCount(fullBody.length);
        setTypingDone(true);
      }
    }
  }, [navSignal, opened, typingDone, fullBody.length, onBack]);

  return (
    <div className="h-full w-full flex flex-col justify-between p-3 sm:p-3.5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1.5 mb-2">
        <div>
          <h2 className="font-pixel text-[9px] text-[#34D399]">{LIE_LOVE_LETTER.heading}</h2>
          <p className="font-vt text-[15px] leading-none text-[#94A3B8]">
            {LIE_LOVE_LETTER.subtitle}
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

      {!opened ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          {/* Sealed Pixel Envelope */}
          <button
            type="button"
            onClick={openEnvelope}
            className="group relative w-44 h-28 rounded-xl border-2 border-[#34D399]/70 bg-[#0D1613] shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:scale-105 transition-transform cursor-pointer flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Flap V-lines */}
            <div className="absolute top-0 left-0 right-0 h-14 border-b border-[#34D399]/50 bg-[#13221C]/60" />
            <div className="relative z-10 w-8 h-8 rounded border border-[#A3E635]/80 bg-[#050807] flex items-center justify-center mb-1">
              <span className="font-pixel text-[10px] text-[#34D399] animate-pulse">★</span>
            </div>
            <span className="relative z-10 font-pixel text-[8px] text-[#E2E8F0]">
              OPEN LETTER
            </span>
          </button>

          <p className="font-vt text-[18px] text-[#CBD5E1]">
            Encrypted file for <span className="text-[#34D399]">Lie</span> — press{' '}
            <span className="text-[#A3E635]">A</span> or tap envelope to unseal.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto lcd-scroll letter-sheet-dark rounded-lg border border-[#34D399]/35 p-3 relative">
            {/* Decorative Corner Pixel Stars */}
            <span className="absolute top-1.5 right-2 font-pixel text-[8px] text-[#34D399]/60 animate-pulse">
              ✦
            </span>

            <pre className="whitespace-pre-wrap font-vt text-[18px] sm:text-[19px] leading-[1.26] text-[#E2E8F0]">
              {fullBody.slice(0, charCount)}
              <span className="inline-block w-2 h-3.5 ml-0.5 align-middle bg-[#34D399] animate-pulse" />
            </pre>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={replayTyping}
              className="px-2.5 py-1.5 rounded border border-[#34D399]/50 bg-[#0C1914] hover:bg-[#10B981]/20 font-pixel text-[8px] text-[#34D399] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" /> REPLAY TYPING
            </button>

            {!typingDone && (
              <button
                type="button"
                onClick={() => {
                  setCharCount(fullBody.length);
                  setTypingDone(true);
                }}
                className="px-2.5 py-1.5 rounded border border-[#334155] bg-[#0B100E] hover:border-[#A3E635] font-silk text-[8px] text-[#CBD5E1] cursor-pointer"
              >
                SKIP TYPE (A)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
