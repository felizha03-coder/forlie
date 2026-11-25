import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { lieAudio } from '../audio/lieAudio';
import { ArcadePhase, ArcadeScreen } from './ArcadeScreen';

interface ArcadeMachineProps {
  muted: boolean;
  onToggleMute: () => void;
  onEnterGameBoy: () => void;
}

export const ArcadeMachine: React.FC<ArcadeMachineProps> = ({
  muted,
  onToggleMute,
  onEnterGameBoy,
}) => {
  const [phase, setPhase] = useState<ArcadePhase>('IDLE');
  const [coinInserted, setCoinInserted] = useState(false);
  const [joyOffset, setJoyOffset] = useState({ x: 0, y: 0 });
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const draggingJoyRef = useRef(false);
  const joyOriginRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const flashButton = (id: string) => {
    setPressedBtn(id);
    window.setTimeout(() => setPressedBtn((curr) => (curr === id ? null : curr)), 150);
  };

  const triggerBootSequence = useCallback(() => {
    if (phase === 'DONE') return;
    if (phase !== 'IDLE') {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      setPhase('DONE');
      lieAudio.playConfirm();
      onEnterGameBoy();
      return;
    }
    setCoinInserted(true);
    lieAudio.playArcadeCoin();
    flashButton('START');

    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('BOOT_1');
        lieAudio.playArcadeStartup();
      }, 280),
      window.setTimeout(() => {
        setPhase('BOOT_2');
      }, 1100),
      window.setTimeout(() => {
        setPhase('BOOT_3');
        lieAudio.playConfirm();
      }, 2000),
      window.setTimeout(() => {
        setPhase('DONE');
        onEnterGameBoy();
      }, 3050)
    );
  }, [phase, onEnterGameBoy]);

  const nudgeJoystick = useCallback((dx: number, dy: number) => {
    setJoyOffset({ x: dx, y: dy });
    lieAudio.playJoystickClick();
    window.setTimeout(() => setJoyOffset({ x: 0, y: 0 }), 170);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        nudgeJoystick(-12, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nudgeJoystick(12, 0);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        nudgeJoystick(0, -10);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        nudgeJoystick(0, 10);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerBootSequence();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nudgeJoystick, triggerBootSequence]);

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-3 py-5 sm:py-8">
      {/* Top Sound Utility */}
      <div className="w-full max-w-[490px] flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 font-silk text-[10px] tracking-[0.2em] text-[#94A3B8]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          <span>ARCADE CABINET // MODE 01</span>
        </div>
        <button
          type="button"
          onClick={onToggleMute}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#CBD5E1]/20 bg-[#0C0F12]/90 text-[#CBD5E1] hover:border-[#34D399]/60 hover:text-[#34D399] font-silk text-[10px] transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />}
          <span>{muted ? 'MUTED' : 'SFX ON'}</span>
        </button>
      </div>

      {/* 3D Vintage Pitch-Black Arcade Cabinet */}
      <div className="relative w-full max-w-[490px] arcade-cabinet rounded-[24px] p-4 sm:p-6">
        {/* Corner Steel Bolts */}
        <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#334155] border border-[#050608]" />
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#334155] border border-[#050608]" />

        {/* Illuminated Emerald Marquee Header */}
        <div className="arcade-marquee rounded-xl border border-[#34D399]/50 py-2.5 px-4 text-center mb-4 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-pixel text-[11px] sm:text-[13px] tracking-[0.16em] text-[#E2E8F0] drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]">
              LIE&apos;S ARCADE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          </div>
          <p className="font-silk text-[9px] tracking-[0.26em] text-[#34D399]">
            BLACK EDITION // PORTABLE EDITION
          </p>
        </div>

        {/* Speaker Vent Louvers */}
        <div className="flex items-center justify-center gap-6 mb-3 opacity-80">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-4 h-1 rounded-full bg-[#050608] border-b border-[#334155]/40" />
            ))}
          </div>
          <span className="font-silk text-[8px] tracking-[0.25em] text-[#64748B]">STEREO CRT</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-4 h-1 rounded-full bg-[#050608] border-b border-[#334155]/40" />
            ))}
          </div>
        </div>

        {/* CRT Screen Bezel */}
        <div className="gb-dark-bezel rounded-2xl p-2.5 sm:p-3.5 mb-5">
          <ArcadeScreen
            phase={phase}
            coinInserted={coinInserted}
            onTriggerStart={triggerBootSequence}
          />
        </div>

        {/* Sloped 3D Control Deck: Joystick + Emerald Action Buttons */}
        <div className="arcade-deck rounded-2xl p-4 sm:p-5 border border-[#CBD5E1]/15">
          <div className="flex items-center justify-between gap-4">
            {/* Interactive Draggable / Clickable 3D Joystick */}
            <div className="flex flex-col items-center gap-2">
              <div
                onPointerDown={(e) => {
                  draggingJoyRef.current = true;
                  joyOriginRef.current = { x: e.clientX, y: e.clientY };
                  e.currentTarget.setPointerCapture(e.pointerId);
                  lieAudio.playJoystickClick();
                }}
                onPointerMove={(e) => {
                  if (!draggingJoyRef.current) return;
                  const dx = Math.max(-14, Math.min(14, (e.clientX - joyOriginRef.current.x) * 0.45));
                  const dy = Math.max(-12, Math.min(12, (e.clientY - joyOriginRef.current.y) * 0.45));
                  setJoyOffset({ x: dx, y: dy });
                }}
                onPointerUp={() => {
                  draggingJoyRef.current = false;
                  setJoyOffset({ x: 0, y: 0 });
                }}
                onClick={() => nudgeJoystick(Math.random() > 0.5 ? 10 : -10, -6)}
                role="button"
                tabIndex={0}
                aria-label="Interactive Arcade Joystick"
                className="relative w-20 h-20 rounded-full bg-[#06080A] border-2 border-[#334155]/70 shadow-[inset_0_6px_12px_rgba(0,0,0,0.95)] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
              >
                {/* Dust washer */}
                <div className="w-10 h-10 rounded-full bg-[#161B22] border border-[#475569]/40 flex items-center justify-center">
                  {/* Metallic shaft */}
                  <div
                    className="w-2.5 h-8 rounded-full bg-gradient-to-r from-[#64748B] via-[#E2E8F0] to-[#475569] transition-transform duration-75"
                    style={{
                      transform: `translate(${joyOffset.x * 0.35}px, ${joyOffset.y * 0.35 - 6}px) rotate(${joyOffset.x * 1.4}deg)`,
                    }}
                  />
                </div>

                {/* Emerald Ball Top */}
                <div
                  className="absolute w-10 h-10 rounded-full bg-[radial-gradient(circle_at_30%_28%,#A7F3D0_0%,#34D399_32%,#10B981_68%,#064E3B_100%)] border border-[#A7F3D0]/60 shadow-[0_6px_14px_rgba(16,185,129,0.45)] transition-transform duration-75"
                  style={{
                    transform: `translate(${joyOffset.x}px, ${joyOffset.y - 10}px)`,
                  }}
                />
              </div>
              <span className="font-silk text-[8px] tracking-[0.2em] text-[#94A3B8]">
                DRAG / WASD
              </span>
            </div>

            {/* Arcade Physical Buttons Deck */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      flashButton('A');
                      triggerBootSequence();
                    }}
                    className={`w-11 h-11 rounded-full gb-emerald-btn flex items-center justify-center font-pixel text-[11px] text-[#050608] cursor-pointer ${
                      pressedBtn === 'A' ? 'is-pressed' : ''
                    }`}
                  >
                    A
                  </button>
                  <span className="font-silk text-[8px] text-[#34D399]">START</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      flashButton('B');
                      nudgeJoystick(-8, 4);
                    }}
                    className={`w-11 h-11 rounded-full bg-[radial-gradient(circle_at_32%_28%,#E2E8F0_0%,#64748B_42%,#1E293B_100%)] border-2 border-[#CBD5E1]/40 shadow-[0_5px_0_#020304] active:translate-y-[2px] flex items-center justify-center font-pixel text-[11px] text-[#050608] cursor-pointer ${
                      pressedBtn === 'B' ? 'translate-y-[2px]' : ''
                    }`}
                  >
                    B
                  </button>
                  <span className="font-silk text-[8px] text-[#94A3B8]">TEST</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  flashButton('COIN');
                  triggerBootSequence();
                }}
                disabled={phase !== 'IDLE'}
                className={`px-4 py-1.5 rounded-full gb-pill-dark font-pixel text-[9px] tracking-[0.14em] text-[#34D399] hover:text-[#A3E635] cursor-pointer disabled:opacity-50 ${
                  pressedBtn === 'START' || pressedBtn === 'COIN' ? 'is-pressed' : ''
                }`}
              >
                {phase === 'IDLE' ? 'INSERT COIN / START' : 'BOOTING...'}
              </button>
            </div>
          </div>
        </div>

        {/* Lower Coin Return Door */}
        <div className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#07090B] border border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-9 rounded border border-[#334155] bg-[#0B0F13] flex items-center justify-center">
              <div className="w-1 h-5 bg-[#10B981] rounded-full shadow-[0_0_8px_#10B981]" />
            </div>
            <div>
              <p className="font-pixel text-[8px] text-[#34D399]">25¢ // FREE PLAY</p>
              <p className="font-silk text-[8px] text-[#64748B]">DEDICATED TO LIE</p>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerBootSequence}
            disabled={phase !== 'IDLE'}
            className="px-2.5 py-1 rounded border border-[#10B981]/35 bg-[#0A1712] hover:bg-[#10B981]/20 font-silk text-[9px] text-[#34D399] cursor-pointer disabled:opacity-40"
          >
            DROP COIN
          </button>
        </div>
      </div>
    </div>
  );
};
