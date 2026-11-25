import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
} from 'lucide-react';
import { ConsoleButtonId, TrackItem } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';

interface MusicPlayerProps {
  tracks: TrackItem[];
  activeIndex: number;
  isPlaying: boolean;
  audioError: string | null;
  volume: number;
  onSelectTrack: (index: number, autoPlay?: boolean) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onChangeVolume: (vol: number) => void;
  onUploadTrackFile: (trackIndex: number, file: File) => void;
  onBack: () => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
}

function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  activeIndex,
  isPlaying,
  audioError,
  volume,
  onSelectTrack,
  onTogglePlay,
  onPrev,
  onNext,
  onChangeVolume,
  onUploadTrackFile,
  onBack,
  navSignal,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array(16).fill(14));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);
  const activeTrack = tracks[activeIndex] ?? tracks[0];

  useEffect(() => {
    const sync = () => {
      const state = lieAudio.getMusicState();
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
      setBars(lieAudio.getVisualizerBars(16));
    };
    sync();
    const id = window.setInterval(sync, 140);
    return () => window.clearInterval(id);
  }, [activeIndex, isPlaying]);

  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    const { btn } = navSignal;
    if (btn === 'B') {
      lieAudio.playBack();
      onBack();
    } else if (btn === 'UP') {
      onPrev();
    } else if (btn === 'DOWN') {
      onNext();
    } else if (btn === 'LEFT') {
      onChangeVolume(Math.max(0, Number((volume - 0.1).toFixed(2))));
    } else if (btn === 'RIGHT') {
      onChangeVolume(Math.min(1, Number((volume + 0.1).toFixed(2))));
    } else if (btn === 'A' || btn === 'START') {
      onTogglePlay();
    }
  }, [navSignal, onBack, onPrev, onNext, onTogglePlay, onChangeVolume, volume]);

  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div className="h-full w-full flex flex-col justify-between p-2.5 sm:p-3 select-none">
      {/* Hidden File Input for Replacing Track Audio */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onUploadTrackFile(activeIndex, file);
          }
          e.target.value = '';
        }}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1 mb-1.5">
        <div>
          <h2 className="font-pixel text-[8px] sm:text-[9px] text-[#34D399]">MUSIC PLAYER</h2>
          <p className="font-silk text-[8px] text-[#94A3B8]">
            SOUNDS THAT REMIND ME OF YOU
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            lieAudio.playBack();
            onBack();
          }}
          className="px-2 py-0.5 rounded border border-[#334155] bg-[#0B100E] hover:border-[#34D399] font-silk text-[8px] text-[#CBD5E1] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-2.5 h-2.5" /> MENU
        </button>
      </div>

      {/* Cassette Deck & Mini-Disc + Visualizer */}
      <div className="rounded-lg border border-[#34D399]/35 bg-[#080E0C] p-2 mb-1.5">
        <div className="flex items-center gap-2.5">
          {/* Rotating Mini-Disc */}
          <div
            className={`w-11 h-11 rounded-full border-2 border-[#CBD5E1]/70 bg-[radial-gradient(circle,#34D399_0%,#064E3B_40%,#050608_100%)] flex items-center justify-center shrink-0 ${
              isPlaying && !audioError ? 'animate-spin-reel' : ''
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#050608] border border-[#E2E8F0]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-pixel text-[8px] text-[#E2E8F0] truncate">
                {activeTrack.title}
              </p>
              <span className="font-silk text-[8px] text-[#34D399] shrink-0">
                {isPlaying && !audioError ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>
            <p className="font-vt text-[15px] leading-none text-[#94A3B8] truncate mt-0.5">
              {activeTrack.artist}
              {activeTrack.uploadedFileName ? ` • ${activeTrack.uploadedFileName}` : ''}
            </p>

            {/* Pixel Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4 mt-1.5">
              {bars.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-xs transition-all duration-100"
                  style={{
                    height: `${val}%`,
                    backgroundColor:
                      isPlaying && !audioError
                        ? i % 3 === 0
                          ? '#A3E635'
                          : '#34D399'
                        : '#1E293B',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Honest Missing-File Notice OR Scrubbable Progress Bar */}
        {audioError ? (
          <div className="mt-2 rounded border border-amber-400/45 bg-amber-950/35 px-2 py-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertTriangle className="w-3 h-3 text-amber-300 shrink-0" />
              <p className="font-silk text-[8px] text-amber-200 leading-tight truncate">
                No MP3 at {activeTrack.defaultPath} — upload file to play
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-300/60 hover:bg-amber-400/35 font-silk text-[8px] text-amber-100 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-2.5 h-2.5" /> LOAD MP3
            </button>
          </div>
        ) : (
          <div className="mt-1.5 space-y-1">
            <input
              type="range"
              aria-label="Track seek bar"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              disabled={!duration}
              onChange={(e) => lieAudio.seekMusic(Number(e.target.value))}
              className="w-full h-1.5 accent-[#34D399] cursor-pointer"
            />
            <div className="flex items-center justify-between font-silk text-[8px] text-[#94A3B8]">
              <span>{formatClock(currentTime)}</span>
              <span>{progressPct.toFixed(0)}%</span>
              <span>{formatClock(duration)}</span>
            </div>
          </div>
        )}

        {/* Playback Controls + Volume */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous track"
              onClick={onPrev}
              className="p-1.5 rounded border border-[#334155] bg-[#101715] hover:border-[#34D399] text-[#CBD5E1] cursor-pointer"
            >
              <SkipBack className="w-3 h-3" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
              onClick={onTogglePlay}
              className="px-2.5 py-1 rounded bg-[#10B981] hover:bg-[#34D399] text-[#050608] font-pixel text-[8px] flex items-center gap-1 cursor-pointer"
            >
              {isPlaying && !audioError ? (
                <>
                  <Pause className="w-3 h-3" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> PLAY
                </>
              )}
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={onNext}
              className="p-1.5 rounded border border-[#334155] bg-[#101715] hover:border-[#34D399] text-[#CBD5E1] cursor-pointer"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Load local MP3 file for this track"
              className="p-1 rounded border border-[#334155] bg-[#0C1210] hover:border-[#34D399] text-[#CBD5E1] cursor-pointer"
            >
              <Upload className="w-3 h-3" />
            </button>
            <Volume2 className="w-3 h-3 text-[#34D399]" />
            <input
              type="range"
              aria-label="Volume"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-14 h-1.5 accent-[#34D399] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 6-Track Playlist */}
      <div className="flex-1 overflow-y-auto lcd-scroll pr-1 space-y-1">
        {tracks.map((track, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectTrack(idx, true)}
              className={`w-full text-left px-2 py-1 rounded border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#10B981]/20 border-[#34D399] text-[#E2E8F0]'
                  : 'bg-[#090E0C]/70 border-[#1E293B] text-[#94A3B8] hover:border-[#34D399]/50'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-pixel text-[8px] text-[#34D399]">
                  {isActive && isPlaying && !audioError ? '♪' : String(idx + 1).padStart(2, '0')}
                </span>
                <span className="font-vt text-[17px] leading-none truncate">
                  {track.title}
                </span>
              </div>
              <span className="font-silk text-[7px] shrink-0 text-[#64748B]">
                {track.uploadedUrl ? 'CUSTOM' : 'MP3'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
