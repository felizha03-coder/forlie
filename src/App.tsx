import React, { useCallback, useEffect, useState } from 'react';
import { ThreeAmbientScene } from './components/ThreeAmbientScene';
import { ArcadeMachine } from './components/ArcadeMachine';
import { GameBoyConsole } from './components/GameBoyConsole';
import { LIE_SOUNDTRACK } from './data/lieData';
import { lieAudio } from './audio/lieAudio';
import { ExperienceStage, TrackItem } from './types/lie';
import { getAudioPrefs, saveAudioPrefs } from './utils/lieStorage';

export function App() {
  const [stage, setStage] = useState<ExperienceStage>('ARCADE');
  const [tracks, setTracks] = useState<TrackItem[]>(() => LIE_SOUNDTRACK);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState(() => getAudioPrefs());

  useEffect(() => {
    lieAudio.syncPreferences(prefs);
    saveAudioPrefs(prefs);
  }, [prefs]);

  const handleToggleMute = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, muted: !prev.muted };
      lieAudio.setMuted(next.muted);
      return next;
    });
  }, []);

  const handleChangeVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setPrefs((prev) => {
      const next = { ...prev, volume: clamped, muted: clamped === 0 ? true : false };
      lieAudio.syncPreferences(next);
      return next;
    });
  }, []);

  const playTrackByIndex = useCallback(
    async (idx: number, list: TrackItem[] = tracks) => {
      const track = list[idx];
      if (!track) return;
      const src = track.uploadedUrl || track.defaultPath;
      setActiveTrackIndex(idx);
      setMusicError(null);

      const res = await lieAudio.loadAndPlayMusic(src);
      if (res.ok) {
        setIsMusicPlaying(true);
        setMusicError(null);
      } else {
        setIsMusicPlaying(false);
        setMusicError(res.error ?? 'Audio unavailable');
      }
    },
    [tracks]
  );

  useEffect(() => {
    lieAudio.setMusicCallbacks({
      onEnded: () => {
        const nextIdx = (activeTrackIndex + 1) % tracks.length;
        void playTrackByIndex(nextIdx, tracks);
      },
      onError: (_src, msg) => {
        setIsMusicPlaying(false);
        setMusicError(msg);
      },
    });
  }, [activeTrackIndex, tracks, playTrackByIndex]);

  const handleSelectTrack = useCallback(
    (index: number, autoPlay = true) => {
      if (autoPlay) {
        void playTrackByIndex(index);
      } else {
        setActiveTrackIndex(index);
      }
    },
    [playTrackByIndex]
  );

  const handleToggleMusicPlay = useCallback(() => {
    if (isMusicPlaying && !musicError) {
      lieAudio.pauseMusic();
      setIsMusicPlaying(false);
    } else {
      void playTrackByIndex(activeTrackIndex);
    }
  }, [isMusicPlaying, musicError, activeTrackIndex, playTrackByIndex]);

  const handlePrevTrack = useCallback(() => {
    const prevIdx = (activeTrackIndex - 1 + tracks.length) % tracks.length;
    void playTrackByIndex(prevIdx);
  }, [activeTrackIndex, tracks.length, playTrackByIndex]);

  const handleNextTrack = useCallback(() => {
    const nextIdx = (activeTrackIndex + 1) % tracks.length;
    void playTrackByIndex(nextIdx);
  }, [activeTrackIndex, tracks.length, playTrackByIndex]);

  const handleUploadTrackFile = useCallback(
    (trackIndex: number, file: File) => {
      const objectUrl = URL.createObjectURL(file);
      const updated = tracks.map((t, i) =>
        i === trackIndex
          ? { ...t, uploadedUrl: objectUrl, uploadedFileName: file.name }
          : t
      );
      setTracks(updated);
      void playTrackByIndex(trackIndex, updated);
    },
    [tracks, playTrackByIndex]
  );

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden lie-backdrop">
      {/* Subtle Film Grain */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none opacity-60 lie-grain"
      />

      {/* Ambient Three.js Obsidian + Emerald + Silver Props */}
      <ThreeAmbientScene />

      {stage === 'ARCADE' ? (
        <ArcadeMachine
          muted={prefs.muted}
          onToggleMute={handleToggleMute}
          onEnterGameBoy={() => setStage('GAMEBOY')}
        />
      ) : (
        <GameBoyConsole
          muted={prefs.muted}
          volume={prefs.volume}
          tracks={tracks}
          activeTrackIndex={activeTrackIndex}
          isMusicPlaying={isMusicPlaying}
          musicError={musicError}
          onToggleMute={handleToggleMute}
          onChangeVolume={handleChangeVolume}
          onSelectTrack={handleSelectTrack}
          onToggleMusicPlay={handleToggleMusicPlay}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onUploadTrackFile={handleUploadTrackFile}
          onReturnToArcade={() => setStage('ARCADE')}
        />
      )}
    </div>
  );
}

export default App;
