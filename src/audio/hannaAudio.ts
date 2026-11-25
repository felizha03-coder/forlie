// Synthesized 8-bit chiptune BGM and retro arcade SFX engine (Web Audio API)

class HannaPixelAudio {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private step = 0;
  private musicEnabled = true;
  private sfxEnabled = true;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlockFromUserGesture(): void {
    this.ensureContext();
    if (this.musicEnabled && this.musicTimer === null) {
      this.startMusicLoop();
    }
  }

  public syncSettings(musicEnabled: boolean, sfxEnabled: boolean): void {
    this.musicEnabled = musicEnabled;
    this.sfxEnabled = sfxEnabled;
    if (!musicEnabled) {
      this.stopMusicLoop();
    } else if (this.ctx && this.ctx.state === 'running' && this.musicTimer === null) {
      this.startMusicLoop();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainLevel = 0.06,
    delay = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainLevel, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  public startMusicLoop(): void {
    if (!this.musicEnabled || this.musicTimer !== null || typeof window === 'undefined') {
      return;
    }
    // Playful 8-bit chiptune adventure progression
    const melody = [
      392, 523.25, 659.25, 523.25,
      587.33, 659.25, 783.99, 659.25,
      440, 523.25, 659.25, 587.33,
      523.25, 493.88, 392, 0,
    ];
    const bass = [
      196, 196, 261.63, 261.63,
      293.66, 293.66, 196, 196,
      220, 220, 174.61, 174.61,
      196, 196, 261.63, 196,
    ];

    this.musicTimer = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const m = melody[this.step % melody.length];
      const b = bass[this.step % bass.length];
      if (m > 0) this.playTone(m, 0.14, 'square', 0.022);
      if (b > 0) this.playTone(b, 0.17, 'triangle', 0.028);
      this.step = (this.step + 1) % melody.length;
    }, 240);
  }

  public stopMusicLoop(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public playClick(): void {
    if (!this.sfxEnabled) return;
    this.playTone(660, 0.06, 'square', 0.055);
    this.playTone(880, 0.05, 'square', 0.04, 0.035);
  }

  public playSelect(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.07, 'square', 0.06);
    this.playTone(659.25, 0.07, 'square', 0.06, 0.06);
    this.playTone(783.99, 0.12, 'square', 0.06, 0.12);
  }

  public playCardFlip(): void {
    if (!this.sfxEnabled) return;
    this.playTone(587.33, 0.06, 'triangle', 0.07);
    this.playTone(880, 0.09, 'square', 0.05, 0.05);
  }

  public playAttack(): void {
    if (!this.sfxEnabled) return;
    this.playTone(310, 0.06, 'sawtooth', 0.06);
    this.playTone(180, 0.09, 'square', 0.06, 0.05);
  }

  public playSpecial(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.07, 'square', 0.06);
    this.playTone(783.99, 0.07, 'square', 0.06, 0.06);
    this.playTone(1046.5, 0.16, 'square', 0.065, 0.12);
  }

  public playDefend(): void {
    if (!this.sfxEnabled) return;
    this.playTone(392, 0.08, 'triangle', 0.07);
    this.playTone(523.25, 0.1, 'triangle', 0.06, 0.06);
  }

  public playHeal(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.08, 'triangle', 0.06);
    this.playTone(659.25, 0.08, 'triangle', 0.06, 0.07);
    this.playTone(1046.5, 0.14, 'triangle', 0.06, 0.14);
  }

  public playMonsterHit(): void {
    if (!this.sfxEnabled) return;
    this.playTone(190, 0.08, 'sawtooth', 0.065);
    this.playTone(130, 0.12, 'square', 0.06, 0.06);
  }

  public playVictory(): void {
    if (!this.sfxEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.15, 'square', 0.06, idx * 0.09);
    });
  }

  public playChestOpen(): void {
    if (!this.sfxEnabled) return;
    const fanfare = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    fanfare.forEach((n, idx) => {
      this.playTone(n, 0.18, 'square', 0.06, idx * 0.09);
    });
  }
}

export const hannaAudio = new HannaPixelAudio();
