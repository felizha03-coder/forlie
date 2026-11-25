import React from 'react';

export type ArcadePhase = 'IDLE' | 'BOOT_1' | 'BOOT_2' | 'BOOT_3' | 'DONE';

interface ArcadeScreenProps {
  phase: ArcadePhase;
  coinInserted: boolean;
  onTriggerStart: () => void;
}

export const ArcadeScreen: React.FC<ArcadeScreenProps> = ({
  phase,
  coinInserted,
  onTriggerStart,
}) => {
  return (
    <div
      onClick={() => {
        if (phase !== 'DONE') onTriggerStart();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (phase !== 'DONE' && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onTriggerStart();
        }
      }}
      aria-label={phase === 'IDLE' ? 'Click screen to insert coin and start arcade' : 'Click to skip arcade boot'}
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-[3px] border-[#050608] bg-[#040706] shadow-[inset_0_0_28px_rgba(16,185,129,0.18)] select-none cursor-pointer group"
    >
      {/* Subtle CRT scanlines + curvature vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 crt-scanlines crt-flicker" />
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, transparent 56%, rgba(0,0,0,0.68) 100%), linear-gradient(125deg, rgba(255,255,255,0.06) 0%, transparent 32%)',
        }}
      />

      {phase === 'IDLE' ? (
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-4 sm:p-6 text-center">
          {/* Top Telemetry Strip */}
          <div className="w-full flex items-center justify-between font-silk text-[9px] sm:text-[10px] tracking-widest text-[#34D399]/80">
            <span>1UP // LIE</span>
            <span>CREDIT {coinInserted ? '01' : '00'}</span>
          </div>

          {/* Center Prompt */}
          <div className="flex flex-col items-center gap-3 my-auto">
            {/* Pixel Coin / Star Emblem */}
            <div className="w-11 h-11 rounded-lg border border-[#34D399]/60 bg-[#0A1410] flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.28)] group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 border-2 border-[#4ADE80] rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#A3E635]" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-silk text-[10px] sm:text-[11px] tracking-[0.22em] text-[#CBD5E1]/90">
                A LITTLE SOMETHING FOR LIE
              </p>
              <h1 className="font-pixel text-[13px] sm:text-[16px] leading-relaxed text-[#34D399] drop-shadow-[0_0_12px_rgba(52,211,153,0.65)]">
                INSERT COIN TO START
              </h1>
            </div>

            <div className="mt-2 px-3 py-1.5 rounded border border-[#10B981]/50 bg-[#0D1A14]/90 animate-pulse">
              <span className="font-pixel text-[8px] sm:text-[9px] tracking-[0.16em] text-[#A3E635]">
                ► PRESS START OR CLICK SCREEN
              </span>
            </div>
          </div>

          {/* Bottom Controls Hint */}
          <div className="w-full flex items-center justify-between font-silk text-[8px] sm:text-[9px] text-[#94A3B8]">
            <span>ARCADE UNIT // REV-99</span>
            <span>READY</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-5 sm:p-6 font-silk text-left">
          <div className="flex items-center justify-between text-[9px] text-[#34D399]">
            <span>BOOT SEQUENCE</span>
            <span>MEM: OK</span>
          </div>

          <div className="my-auto space-y-3 font-pixel text-[10px] sm:text-[12px] leading-relaxed">
            <p className="text-[#CBD5E1]">
              &gt; INITIALIZING SYSTEM...
              {phase === 'BOOT_1' && <span className="inline-block w-2 h-3 ml-1 bg-[#34D399] animate-pulse" />}
            </p>
            {(phase === 'BOOT_2' || phase === 'BOOT_3' || phase === 'DONE') && (
              <p className="text-[#34D399]">
                &gt; LOADING SOMETHING SPECIAL...
                {phase === 'BOOT_2' && <span className="inline-block w-2 h-3 ml-1 bg-[#34D399] animate-pulse" />}
              </p>
            )}
            {(phase === 'BOOT_3' || phase === 'DONE') && (
              <p className="text-[#A3E635] text-[13px] sm:text-[15px] pt-1 drop-shadow-[0_0_10px_rgba(163,230,53,0.65)]">
                &gt; HELLO, LIE.
                <span className="inline-block w-2.5 h-3.5 ml-1.5 bg-[#A3E635] animate-pulse" />
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 rounded-sm bg-[#0E1713] border border-[#10B981]/40 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#84CC16] transition-all duration-500"
                style={{
                  width:
                    phase === 'BOOT_1'
                      ? '36%'
                      : phase === 'BOOT_2'
                        ? '74%'
                        : '100%',
                }}
              />
            </div>
            <div className="flex items-center justify-between font-silk text-[8px] text-[#94A3B8] tracking-widest">
              <span>PREPARING PORTABLE CONSOLE...</span>
              <span className="text-[#34D399]">CLICK TO SKIP &gt;&gt;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
