export interface MusicEngineState {
  src: string | null;
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
  errorMsg: string | null;
}

class LieAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private muted = false;
  private volume = 0.75;
  private sfxEnabled = true;

  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private currentAudioSrc: string | null = null;
  private lastErrorMsg: string | null = null;
  private onEndedCb: (() => void) | null = null;
  private onErrorCb: ((src: string, msg: string) => void) | null = null;
  private onMetadataCb: ((src: string, durationSec: number) => void) | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.76;
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    const ctx = this.ensureContext();
    if (!this.audioEl) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = 1;
      audio.muted = this.muted;

      audio.addEventListener('ended', () => {
        this.onEndedCb?.();
      });

      audio.addEventListener('canplay', () => {
        this.lastErrorMsg = null;
      });

      audio.addEventListener('loadedmetadata', () => {
        this.lastErrorMsg = null;
        if (this.currentAudioSrc && Number.isFinite(audio.duration) && audio.duration > 0) {
          this.onMetadataCb?.(this.currentAudioSrc, audio.duration);
        }
      });

      audio.addEventListener('error', () => {
        const msg = 'UNABLE TO LOAD AUDIO FILE — TRY UPLOADING ANOTHER TRACK';
        this.lastErrorMsg = msg;
        if (this.currentAudioSrc) {
          this.onErrorCb?.(this.currentAudioSrc, msg);
        }
      });

      this.audioEl = audio;
    }

    if (ctx && this.masterGain && !this.mediaSource && this.audioEl) {
      try {
        this.mediaSource = ctx.createMediaElementSource(this.audioEl);
        this.mediaSource.connect(this.masterGain);
      } catch {
        // Fallback: audio element plays directly via browser output
      }
    }

    return this.audioEl;
  }

  public syncPreferences(prefs: { volume: number; muted: boolean; sfxEnabled: boolean }): void {
    this.volume = Math.max(0, Math.min(1, prefs.volume));
    this.muted = prefs.muted;
    this.sfxEnabled = prefs.sfxEnabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime,
        0.02
      );
    }
    if (this.audioEl) {
      this.audioEl.muted = this.muted;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(next: boolean): void {
    this.muted = next;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(next ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
    if (this.audioEl) {
      this.audioEl.muted = next;
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainLevel = 0.07,
    delay = 0,
    slideTo?: number,
    isSystem = false
  ): void {
    if (this.muted) return;
    if (!isSystem && !this.sfxEnabled) return;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, slideTo), start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainLevel, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  /* -------- ARCADE & GAME BOY PROCEDURAL SFX -------- */
  public playArcadeCoin(): void {
    this.playTone(987.77, 0.08, 'square', 0.085, 0, undefined, true);
    this.playTone(1318.51, 0.24, 'square', 0.085, 0.08, undefined, true);
  }

  public playArcadeStartup(): void {
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.09, 'square', 0.065, idx * 0.06, undefined, true);
    });
  }

  public playJoystickClick(): void {
    this.playTone(220, 0.032, 'triangle', 0.07, 0, 140);
  }

  public playNav(): void {
    this.playTone(540, 0.04, 'square', 0.05);
  }

  public playConfirm(): void {
    this.playTone(660, 0.055, 'square', 0.065);
    this.playTone(880, 0.085, 'square', 0.065, 0.048);
  }

  public playBack(): void {
    this.playTone(440, 0.055, 'triangle', 0.07);
    this.playTone(300, 0.08, 'triangle', 0.065, 0.048);
  }

  public playSdInsert(): void {
    this.playTone(170, 0.055, 'square', 0.1, 0, 110, true);
    this.playTone(523.25, 0.09, 'triangle', 0.085, 0.08, undefined, true);
    this.playTone(659.25, 0.09, 'triangle', 0.085, 0.17, undefined, true);
    this.playTone(1046.5, 0.24, 'sine', 0.1, 0.26, undefined, true);
  }

  public playSdEject(): void {
    this.playTone(520, 0.075, 'triangle', 0.075, 0, 260, true);
    this.playTone(210, 0.095, 'square', 0.075, 0.085, 130, true);
  }

  public playBootChime(): void {
    this.playTone(1046.5, 0.085, 'square', 0.07, 0, undefined, true);
    this.playTone(2093.0, 0.3, 'square', 0.065, 0.085, undefined, true);
  }

  public playEnvelopeOpen(): void {
    this.playTone(392.0, 0.09, 'sine', 0.075, 0);
    this.playTone(493.88, 0.1, 'sine', 0.075, 0.08);
    this.playTone(587.33, 0.12, 'sine', 0.08, 0.16);
    this.playTone(783.99, 0.22, 'triangle', 0.08, 0.24);
  }

  public playCapsuleOpen(): void {
    this.playTone(440, 0.05, 'triangle', 0.065, 0);
    this.playTone(554.37, 0.05, 'triangle', 0.065, 0.06);
    this.playTone(659.25, 0.06, 'triangle', 0.075, 0.12);
    this.playTone(880, 0.17, 'square', 0.065, 0.19);
  }

  public playPoint(): void {
    this.playTone(740, 0.055, 'square', 0.06);
    this.playTone(1046.5, 0.1, 'square', 0.065, 0.05);
  }

  public playGameOver(): void {
    this.playTone(330, 0.11, 'sawtooth', 0.06, 0, 240);
    this.playTone(230, 0.22, 'sawtooth', 0.065, 0.12, 130);
  }

  public playVictory(): void {
    const seq = [523.25, 659.25, 783.99, 1046.5];
    seq.forEach((n, idx) => {
      this.playTone(n, 0.13, 'square', 0.065, idx * 0.085);
    });
  }

  /* -------- HONEST HTML5 AUDIO MUSIC PLAYER -------- */
  public setMusicCallbacks(callbacks: {
    onEnded?: () => void;
    onError?: (src: string, msg: string) => void;
    onLoadedMetadata?: (src: string, durationSec: number) => void;
  }): void {
    this.onEndedCb = callbacks.onEnded ?? null;
    this.onErrorCb = callbacks.onError ?? null;
    this.onMetadataCb = callbacks.onLoadedMetadata ?? null;
  }

  public async loadAndPlayMusic(src: string): Promise<{ ok: boolean; error?: string }> {
    const el = this.ensureAudioElement();
    if (!el) return { ok: false, error: 'Browser audio unavailable' };

    this.lastErrorMsg = null;

    if (this.currentAudioSrc !== src) {
      this.currentAudioSrc = src;
      el.src = src;
      el.load();
    } else if (!el.paused) {
      return { ok: true };
    }

    try {
      await el.play();
      return { ok: true };
    } catch {
      const msg =
        this.lastErrorMsg ||
        'AUDIO FILE UNAVAILABLE — UPLOAD AN MP3 TO PLAY';
      this.lastErrorMsg = msg;
      return { ok: false, error: msg };
    }
  }

  public pauseMusic(): void {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
  }

  public stopMusic(): void {
    if (this.audioEl) {
      this.audioEl.pause();
      try {
        this.audioEl.currentTime = 0;
      } catch {
        // Ignore before metadata loads
      }
    }
  }

  public seekMusic(sec: number): void {
    if (!this.audioEl) return;
    if (Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
      this.audioEl.currentTime = Math.max(0, Math.min(this.audioEl.duration, sec));
    }
  }

  public getMusicState(): MusicEngineState {
    const el = this.audioEl;
    return {
      src: this.currentAudioSrc,
      currentTime: el && Number.isFinite(el.currentTime) ? el.currentTime : 0,
      duration: el && Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0,
      paused: el ? el.paused : true,
      ended: el ? el.ended : false,
      errorMsg: this.lastErrorMsg,
    };
  }

  public getVisualizerBars(count = 16): number[] {
    const isPlaying = Boolean(this.audioEl && !this.audioEl.paused && !this.lastErrorMsg);
    if (!this.analyser || !isPlaying || this.muted) {
      return Array.from({ length: count }, (_, idx) => 10 + ((idx * 3) % 8));
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return Array.from({ length: count }, (_, i) => {
      const binIndex = Math.min(data.length - 1, Math.floor((i / count) * (data.length * 0.72)));
      const sample = data[binIndex] ?? 0;
      const level = Math.round((sample / 255) * 84);
      return Math.max(14, Math.min(98, level + 12));
    });
  }
}

export const lieAudio = new LieAudioEngine();
