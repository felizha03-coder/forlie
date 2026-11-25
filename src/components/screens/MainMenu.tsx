import React, { useEffect, useRef, useState } from 'react';
import { Disc3, Gamepad2, Mail, Sparkles, Star } from 'lucide-react';
import { ConsoleButtonId, GameBoyScreenId } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';

interface MainMenuProps {
  onNavigate: (screen: GameBoyScreenId) => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
  nowPlayingTitle: string | null;
}

const MENU_APPS: {
  id: GameBoyScreenId;
  num: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'LETTER',
    num: '01',
    label: 'LOVE LETTER',
    desc: 'A note written specially for you',
    icon: <Mail className="w-3.5 h-3.5 text-[#34D399]" />,
  },
  {
    id: 'REMINDERS',
    num: '02',
    label: 'LITTLE REMINDERS',
    desc: '36 random capsules for tough days',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />,
  },
  {
    id: 'MUSIC',
    num: '03',
    label: 'MUSIC PLAYER',
    desc: 'Sounds that remind me of you',
    icon: <Disc3 className="w-3.5 h-3.5 text-[#34D399]" />,
  },
  {
    id: 'GAMES',
    num: '04',
    label: 'MINI GAMES',
    desc: 'Snake • Catch Stars • Memory Match',
    icon: <Gamepad2 className="w-3.5 h-3.5 text-[#4ADE80]" />,
  },
  {
    id: 'FINALE',
    num: '★',
    label: 'CREDITS / FINALE',
    desc: 'Closing note & replay',
    icon: <Star className="w-3.5 h-3.5 text-[#34D399]" />,
  },
];

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  navSignal,
  nowPlayingTitle,
}) => {
  const [cursor, setCursor] = useState(0);
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);

  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    const { btn } = navSignal;
    if (btn === 'UP' || btn === 'LEFT') {
      setCursor((prev) => (prev - 1 + MENU_APPS.length) % MENU_APPS.length);
    } else if (btn === 'DOWN' || btn === 'RIGHT') {
      setCursor((prev) => (prev + 1) % MENU_APPS.length);
    } else if (btn === 'A' || btn === 'START') {
      lieAudio.playConfirm();
      onNavigate(MENU_APPS[cursor].id);
    } else if (btn === 'SELECT') {
      lieAudio.playConfirm();
      onNavigate('FINALE');
    }
  }, [navSignal, cursor, onNavigate]);

  return (
    <div className="h-full w-full flex flex-col justify-between p-3 sm:p-3.5 select-none">
      {/* OS Top Bar */}
      <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1.5 mb-2">
        <div>
          <p className="font-pixel text-[9px] text-[#34D399] tracking-wide">LIE OS // v1.0</p>
          <p className="font-silk text-[8px] text-[#94A3B8]">SD MOUNTED • SELECT PROGRAM</p>
        </div>
        {nowPlayingTitle && (
          <div className="px-2 py-0.5 rounded bg-[#0E1E17] border border-[#34D399]/40 max-w-[125px] truncate">
            <span className="font-silk text-[8px] text-[#A3E635]">♪ {nowPlayingTitle}</span>
          </div>
        )}
      </div>

      {/* App List */}
      <div className="flex-1 overflow-y-auto lcd-scroll pr-1 space-y-1.5">
        {MENU_APPS.map((item, idx) => {
          const active = idx === cursor;
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setCursor(idx)}
              onClick={() => {
                setCursor(idx);
                lieAudio.playConfirm();
                onNavigate(item.id);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                active
                  ? 'bg-[#10B981]/18 border-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0C1210]/70 border-[#1E293B] hover:border-[#34D399]/50'
              }`}
            >
              <span
                className={`font-pixel text-[9px] w-3 ${
                  active ? 'text-[#A3E635] animate-pulse' : 'text-transparent'
                }`}
              >
                ►
              </span>
              <span className="w-6 h-6 rounded bg-[#080D0B] border border-[#334155]/60 flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-pixel text-[8px] sm:text-[9px] truncate ${
                      active ? 'text-[#E2E8F0]' : 'text-[#CBD5E1]'
                    }`}
                  >
                    {item.num}. {item.label}
                  </span>
                </div>
                <p className="font-vt text-[15px] leading-none text-[#94A3B8] truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Helper Hint */}
      <div className="mt-2 pt-1.5 border-t border-[#10B981]/25 flex items-center justify-between font-silk text-[8px] text-[#94A3B8]">
        <span>D-PAD: MOVE</span>
        <span className="text-[#34D399]">A / CLICK: OPEN</span>
        <span>SELECT: FINALE</span>
      </div>
    </div>
  );
};
