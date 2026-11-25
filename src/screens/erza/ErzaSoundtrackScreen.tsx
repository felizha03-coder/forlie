import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
} from 'lucide-react';
import { erzaAudio } from '../../audio/erzaAudio';
import { PixelCloud, PixelMusicIcon, PixelStar } from '../../components/ErzaPixelArt';
import { ERZA_INITIAL_SOUNDTRACK } from '../../data/erzaData';
import { DirectionInput, SoundtrackItem, ThemeMode } from '../../types/erza';

interface ErzaSoundtrackScreenProps {
  themeMode: ThemeMode;
  tracks: SoundtrackItem[];
  trackIdx: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: boolean;
  durations: Record<string, number>;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSelectTrack: (idx: number) => void;
  onUploadTrack: (track: SoundtrackItem) => void;
  onBack: () => void;
  navSignal: { dir: DirectionInput; tick: number } | null;
  confirmTrigger: number;
}

function formatSec(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

export const ErzaSoundtrackScreen: React.FC<ErzaSoundtrackScreenProps> = ({
  themeMode,
  tracks,
  trackIdx,
  isPlaying,
  shuffle,
  repeat,
  durations,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleRepeat,
  onSelectTrack,
  onUploadTrack,
  onBack,
  navSignal,
  confirmTrigger,
}) => {
  const [elapsed, setElapsed] = useState(() => erzaAudio.getAudioState().currentTime);
  const [volume, setVolume] = useState(() => erzaAudio.getVolume());
  const [bars, setBars] = useState<number[]>(() => Array(14).fill(14));

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isNight = themeMode === 'NIGHT';
  const currentTrack = tracks[trackIdx] ?? tracks[0];
  const currentDuration = durations[currentTrack.audioSrc] ?? currentTrack.durationSec;

  useEffect(() => {
    setElapsed(erzaAudio.getAudioState().currentTime);
    if (!isPlaying) {
      setBars(Array(14).fill(14));
      return;
    }

    const timer = window.setInterval(() => {
      const state = erzaAudio.getAudioState();
      setElapsed(state.currentTime);
      setBars(erzaAudio.getVisualizerBars(14));
    }, 120);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, trackIdx]);

  useEffect(() => {
    if (!navSignal) return;
    if (navSignal.dir === 'RIGHT') onNext();
    else if (navSignal.dir === 'LEFT') onPrev();
  }, [navSignal, onNext, onPrev]);

  useEffect(() => {
    if (confirmTrigger === 0) return;
    onTogglePlay();
  }, [confirmTrigger, onTogglePlay]);

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = ratio * currentDuration;
    setElapsed(targetSec);
    erzaAudio.seekAudio(targetSec);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    erzaAudio.setVolume(val);
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').toUpperCase();
    const customTrack: SoundtrackItem = {
      id: `upload-${Date.now()}`,
      title: cleanTitle,
      artist: 'CUSTOM CASSETTE',
      durationSec: 180,
      audioSrc: objectUrl,
      coverAccent: '#641C32',
      caption: 'Your uploaded soundtrack on Auclair’s Game Boy.',
      personalNote: ERZA_INITIAL_SOUNDTRACK[0].personalNote,
      spotifyUrl: ERZA_INITIAL_SOUNDTRACK[0].spotifyUrl,
      youtubeUrl: ERZA_INITIAL_SOUNDTRACK[0].youtubeUrl,
      isUserUpload: true,
    };
    onUploadTrack(customTrack);
    setElapsed(0);
    e.target.value = '';
  };

  return (
    <div className="h-full flex flex-col p-2.5 sm:p-3 overflow-y-auto lcd-scroll select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer shrink-0 ${
            isNight
              ? 'bg-[#190D13]/85 border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]'
          }`}
        >
          ◀ MENU
        </button>
        <span
          className={`font-pixel text-[8px] truncate ${
            isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
          }`}
        >
          OUR SOUNDTRACK
        </span>
      </div>

      {/* Maroon Cassette-Inspired Player */}
      <div className="rounded-xl bg-[#4A101F] border-2 border-[#D9A0A9] p-2.5 text-[#F5E9E6] shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Pixel Album Art & Spinning Reels */}
          <div
            className="w-16 h-16 rounded-lg border-2 border-[#F5E9E6]/80 flex flex-col items-center justify-center relative shrink-0 overflow-hidden"
            style={{ backgroundColor: currentTrack.coverAccent }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 border-[#F5E9E6] bg-[#190D13] flex items-center justify-center ${
                  isPlaying ? 'animate-spin-reel' : ''
                }`}
              >
                <div className="w-1 h-1 bg-[#D9A0A9] rounded-full" />
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 border-[#F5E9E6] bg-[#190D13] flex items-center justify-center ${
                  isPlaying ? 'animate-spin-reel' : ''
                }`}
              >
                <div className="w-1 h-1 bg-[#D9A0A9] rounded-full" />
              </div>
            </div>
            <PixelMusicIcon size={18} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-pixel text-[8.5px] text-[#F5E9E6] truncate">
                {currentTrack.title}
              </span>
              <span className="font-silk text-[7.5px] text-[#D8C4C1] shrink-0">
                CASSETTE
              </span>
            </div>
            <p className="font-pixel text-[7.5px] text-[#D9A0A9] mt-0.5 truncate">
              {currentTrack.artist}
            </p>
            <p className="font-vt text-[14px] text-[#F5E9E6] leading-tight truncate mt-0.5">
              {currentTrack.caption}
            </p>

            {/* Burgundy Visualizer Bars */}
            <div className="mt-1 h-4 flex items-end gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[#922B45] via-[#D9A0A9] to-[#F5E9E6] transition-all duration-100"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glowing Progress Indicator */}
        <div className="mt-2">
          <div
            onClick={handleScrub}
            role="slider"
            aria-label="Song progress"
            aria-valuemin={0}
            aria-valuemax={Math.floor(currentDuration)}
            aria-valuenow={Math.floor(elapsed)}
            tabIndex={0}
            className="w-full h-2.5 rounded-full bg-[#190D13] cursor-pointer overflow-hidden border border-[#D9A0A9]/60"
          >
            <div
              className="h-full bg-gradient-to-r from-[#800F2F] via-[#D9A0A9] to-[#F5E9E6] shadow-[0_0_8px_#D9A0A9] transition-all duration-150"
              style={{
                width: `${
                  currentDuration > 0
                    ? Math.min(100, (elapsed / currentDuration) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="mt-0.5 flex items-center justify-between font-silk text-[8.5px] text-[#D8C4C1] tabular-nums">
            <span>{formatSec(elapsed)}</span>
            <div className="flex items-center gap-2">
              <a
                href={currentTrack.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#F5E9E6] hover:text-[#D9A0A9] underline"
              >
                Spotify <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={currentTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#F5E9E6] hover:text-[#D9A0A9] underline"
              >
                YouTube <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <span>{formatSec(currentDuration)}</span>
          </div>
        </div>

        {/* Pixel-Style Playback Controls + Volume */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleShuffle}
              aria-label="Shuffle"
              className={`p-1.5 rounded-lg border cursor-pointer ${
                shuffle
                  ? 'bg-[#800F2F] border-[#F5E9E6] text-[#F5E9E6]'
                  : 'bg-[#190D13] border-[#D9A0A9]/45 text-[#D8C4C1]'
              }`}
            >
              <Shuffle className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous"
              className="p-1.5 rounded-lg bg-[#190D13] border border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F] cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="px-2.5 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] text-[#F5E9E6] hover:brightness-110 cursor-pointer flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next"
              className="p-1.5 rounded-lg bg-[#190D13] border border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F] cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleRepeat}
              aria-label="Repeat"
              className={`p-1.5 rounded-lg border cursor-pointer ${
                repeat
                  ? 'bg-[#800F2F] border-[#F5E9E6] text-[#F5E9E6]'
                  : 'bg-[#190D13] border-[#D9A0A9]/45 text-[#D8C4C1]'
              }`}
            >
              <Repeat className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-24">
            <Volume2 className="w-3.5 h-3.5 text-[#D8C4C1] shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              aria-label="Volume"
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-[#D9A0A9] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Personal Message Box */}
      <div
        className={`mt-2 rounded-xl border-2 p-2.5 shrink-0 ${
          isNight
            ? 'bg-[#4A101F]/90 border-[#D9A0A9]/45 text-[#F5E9E6]'
            : 'bg-[#F5E9E6]/95 border-[#800F2F]/55 text-[#4A101F]'
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <PixelCloud size={15} color={isNight ? '#D9A0A9' : '#922B45'} />
          <PixelStar size={12} color={isNight ? '#D8C4C1' : '#800F2F'} />
          <span
            className={`font-pixel text-[6.5px] ${
              isNight ? 'text-[#D9A0A9]' : 'text-[#800F2F]'
            }`}
          >
            LINER NOTES
          </span>
        </div>
        <p className="font-vt text-[15.5px] leading-tight">
          &ldquo;{currentTrack.personalNote}&rdquo;
        </p>
      </div>

      {/* Audio Upload & Cassette Queue */}
      <div className="mt-2 flex items-center justify-between gap-2 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleUploadAudio}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-pixel text-[6.5px] cursor-pointer ${
            isNight
              ? 'bg-[#190D13]/90 border-[#D9A0A9]/60 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#D8C4C1] border-[#800F2F] text-[#4A101F] hover:bg-[#D9A0A9]'
          }`}
        >
          <Upload className="w-3 h-3" />
          <span>UPLOAD OWN AUDIO</span>
        </button>

        {tracks.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {tracks.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setElapsed(0);
                  onSelectTrack(i);
                }}
                className={`px-2 py-1 rounded font-silk text-[8px] border cursor-pointer ${
                  i === trackIdx
                    ? 'bg-[#800F2F] text-[#F5E9E6] border-[#F5E9E6]'
                    : 'bg-[#D8C4C1] text-[#4A101F] border-[#800F2F]'
                }`}
              >
                T{i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
