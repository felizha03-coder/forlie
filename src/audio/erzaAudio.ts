class ErzaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private muted = false;
  private volume = 0.7;
  private buttonSfxEnabled = true;
  private gameSfxEnabled = true;

  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private currentAudioSrc: string | null = null;
  private onEndedCb: (() => void) | null = null;
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
      this.analyser.smoothingTimeConstant = 0.78;
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

      audio.addEventListener('loadedmetadata', () => {
        if (this.currentAudioSrc && Number.isFinite(audio.duration) && audio.duration > 0) {
          this.onMetadataCb?.(this.currentAudioSrc, audio.duration);
        }
      });

      this.audioEl = audio;
    }

    if (ctx && this.masterGain && !this.mediaSource && this.audioEl) {
      this.mediaSource = ctx.createMediaElementSource(this.audioEl);
      this.mediaSource.connect(this.masterGain);
    }

    return this.audioEl;
  }

  public syncPreferences(prefs: {
    volume: number;
    muted: boolean;
    buttonSfxEnabled: boolean;
    gameSfxEnabled: boolean;
  }): void {
    this.volume = Math.max(0, Math.min(1, prefs.volume));
    this.muted = prefs.muted;
    this.buttonSfxEnabled = prefs.buttonSfxEnabled;
    this.gameSfxEnabled = prefs.gameSfxEnabled;
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

  public getVolume(): number {
    return this.volume;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainLevel = 0.08,
    delay = 0,
    slideTo?: number,
    channel: 'button' | 'game' | 'system' = 'button'
  ): void {
    if (this.muted) return;
    if (channel === 'button' && !this.buttonSfxEnabled) return;
    if (channel === 'game' && !this.gameSfxEnabled) return;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainLevel, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  public playClick(): void {
    this.playTone(640, 0.04, 'triangle', 0.08, 0, undefined, 'button');
  }

  public playNav(): void {
    this.playTone(540, 0.045, 'square', 0.055, 0, undefined, 'button');
  }

  public playConfirm(): void {
    this.playTone(660, 0.06, 'square', 0.065, 0, undefined, 'button');
    this.playTone(880, 0.09, 'square', 0.065, 0.05, undefined, 'button');
  }

  public playBack(): void {
    this.playTone(460, 0.06, 'triangle', 0.075, 0, undefined, 'button');
    this.playTone(330, 0.08, 'triangle', 0.07, 0.05, undefined, 'button');
  }

  public playSmileChime(): void {
    this.playTone(523.25, 0.08, 'triangle', 0.08, 0, undefined, 'button');
    this.playTone(659.25, 0.08, 'triangle', 0.08, 0.06, undefined, 'button');
    this.playTone(783.99, 0.14, 'sine', 0.09, 0.12, undefined, 'button');
  }

  public playSdInsert(): void {
    this.playTone(190, 0.05, 'square', 0.11, 0, 120, 'system');
    this.playTone(523.25, 0.1, 'triangle', 0.09, 0.09, undefined, 'system');
    this.playTone(659.25, 0.1, 'triangle', 0.09, 0.18, undefined, 'system');
    this.playTone(1046.5, 0.22, 'sine', 0.11, 0.27, undefined, 'system');
  }

  public playSdEject(): void {
    this.playTone(520, 0.08, 'triangle', 0.08, 0, 260, 'system');
    this.playTone(220, 0.1, 'square', 0.08, 0.09, 140, 'system');
  }

  public playPowerOn(): void {
    this.playTone(1046.5, 0.09, 'square', 0.08, 0, undefined, 'system');
    this.playTone(2093.0, 0.34, 'square', 0.075, 0.09, undefined, 'system');
  }

  public playPowerOff(): void {
    this.playTone(680, 0.16, 'triangle', 0.08, 0, 110, 'system');
  }

  public playEnvelopeOpen(): void {
    this.playTone(392.0, 0.1, 'sine', 0.08, 0, undefined, 'game');
    this.playTone(493.88, 0.11, 'sine', 0.08, 0.08, undefined, 'game');
    this.playTone(587.33, 0.14, 'sine', 0.09, 0.16, undefined, 'game');
    this.playTone(783.99, 0.24, 'triangle', 0.09, 0.25, undefined, 'game');
  }

  public playCapsuleOpen(): void {
    this.playTone(440, 0.05, 'triangle', 0.07, 0, undefined, 'game');
    this.playTone(554.37, 0.05, 'triangle', 0.07, 0.07, undefined, 'game');
    this.playTone(659.25, 0.06, 'triangle', 0.08, 0.14, undefined, 'game');
    this.playTone(880, 0.18, 'square', 0.07, 0.21, undefined, 'game');
  }

  public playCatchPoint(): void {
    this.playTone(740, 0.06, 'square', 0.06, 0, undefined, 'game');
    this.playTone(1046.5, 0.11, 'square', 0.065, 0.05, undefined, 'game');
  }

  public playJump(): void {
    this.playTone(320, 0.11, 'square', 0.06, 0, 680, 'game');
  }

  public playGameWin(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.14, 'square', 0.07, idx * 0.09, undefined, 'game');
    });
  }

  public playGameFail(): void {
    this.playTone(340, 0.12, 'sawtooth', 0.065, 0, 260, 'game');
    this.playTone(240, 0.22, 'sawtooth', 0.07, 0.13, 140, 'game');
  }

  public playSecretUnlock(): void {
    const seq = [330, 659.25, 493.88, 880, 783.99, 1046.5, 1318.5];
    seq.forEach((n, idx) => {
      this.playTone(
        n,
        0.1,
        idx % 2 === 0 ? 'square' : 'triangle',
        0.075,
        idx * 0.055,
        undefined,
        'system'
      );
    });
  }

  /* ---------------- REAL AUDIO PLAYER ---------------- */
  public setAudioCallbacks(callbacks: {
    onEnded?: () => void;
    onLoadedMetadata?: (src: string, durationSec: number) => void;
  }): void {
    this.onEndedCb = callbacks.onEnded ?? null;
    this.onMetadataCb = callbacks.onLoadedMetadata ?? null;
  }

  public async loadAndPlayAudio(src: string, seekSec?: number): Promise<boolean> {
    const el = this.ensureAudioElement();
    if (!el) return false;

    if (this.currentAudioSrc !== src) {
      this.currentAudioSrc = src;
      el.src = src;
      el.load();
    }

    if (typeof seekSec === 'number' && Number.isFinite(seekSec) && seekSec > 0.1) {
      if (el.readyState >= 1 && Number.isFinite(el.duration)) {
        el.currentTime = Math.max(0, Math.min(el.duration, seekSec));
      } else {
        const target = Math.max(0, seekSec);
        const onReady = () => {
          el.removeEventListener('loadedmetadata', onReady);
          if (Number.isFinite(el.duration)) {
            el.currentTime = Math.max(0, Math.min(el.duration, target));
          }
        };
        el.addEventListener('loadedmetadata', onReady);
      }
    }

    try {
      await el.play();
      return true;
    } catch {
      return false;
    }
  }

  public pauseAudio(): void {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
  }

  public stopAudio(): void {
    if (this.audioEl) {
      this.audioEl.pause();
      try {
        this.audioEl.currentTime = 0;
      } catch {
        // Ignore before metadata load
      }
    }
  }

  public seekAudio(sec: number): void {
    if (!this.audioEl) return;
    if (Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
      this.audioEl.currentTime = Math.max(0, Math.min(this.audioEl.duration, sec));
    }
  }

  public primeAudio(preloadSrc?: string): void {
    this.ensureContext();
    const el = this.ensureAudioElement();
    if (el && preloadSrc && this.currentAudioSrc !== preloadSrc && el.paused) {
      this.currentAudioSrc = preloadSrc;
      el.src = preloadSrc;
      el.load();
    }
  }

  public preloadTrackMetadata(src: string): void {
    const el = this.ensureAudioElement();
    if (!el) return;
    if (this.currentAudioSrc !== src && el.paused) {
      this.currentAudioSrc = src;
      el.src = src;
      el.load();
    }
  }

  public getAudioState(): {
    src: string | null;
    currentTime: number;
    duration: number;
    paused: boolean;
    ended: boolean;
  } {
    const el = this.audioEl;
    return {
      src: this.currentAudioSrc,
      currentTime: el && Number.isFinite(el.currentTime) ? el.currentTime : 0,
      duration: el && Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0,
      paused: el ? el.paused : true,
      ended: el ? el.ended : false,
    };
  }

  public getVisualizerBars(count = 14): number[] {
    const isPlaying = Boolean(this.audioEl && !this.audioEl.paused);
    if (!this.analyser || !isPlaying || this.muted) {
      return Array.from({ length: count }, (_, idx) => 12 + ((idx * 5) % 14));
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return Array.from({ length: count }, (_, i) => {
      const binIndex = Math.min(data.length - 1, Math.floor((i / count) * (data.length * 0.75)));
      const sample = data[binIndex] ?? 0;
      const pulse = Math.round((sample / 255) * 82);
      return Math.max(14, Math.min(98, pulse + 14));
    });
  }
}

export const erzaAudio = new ErzaAudioEngine();
