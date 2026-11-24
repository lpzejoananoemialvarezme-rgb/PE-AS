export type AndeanTrackId = 'altiplano' | 'charango' | 'ceremonia' | 'fiesta';

export interface AndeanTrackMeta {
  id: AndeanTrackId;
  title: string;
  instruments: string;
  tempoMs: number;
}

export const ANDEAN_TRACKS: AndeanTrackMeta[] = [
  {
    id: 'altiplano',
    title: 'Brisa del Altiplano',
    instruments: 'Zampoñas y Bombo',
    tempoMs: 410
  },
  {
    id: 'charango',
    title: 'Camino del Charango',
    instruments: 'Charango y Quena',
    tempoMs: 270
  },
  {
    id: 'ceremonia',
    title: 'Ceremonia de las Peñas',
    instruments: 'Siku, Charango y Viento',
    tempoMs: 350
  },
  {
    id: 'fiesta',
    title: 'Encuentro en Peñas',
    instruments: 'Tarka, Zampoña y Charango',
    tempoMs: 295
  }
];

// Frequencies in Hz (A minor / Andean pentatonic & Dorian notes)
const NOTE: Record<string, number> = {
  A2: 110.0,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  'F#4': 369.99,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  'F#5': 739.99,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  D6: 1174.66
};

interface StepEvent {
  zampona?: string;
  zamponaHarmony?: string;
  zamponaDur?: number;
  charango?: string[];
  horn?: string[];
  bombo?: boolean;
}

const TRACK_PATTERNS: Record<AndeanTrackId, StepEvent[]> = {
  altiplano: [
    { zampona: 'E5', zamponaDur: 0.75, bombo: true },
    { zampona: 'D5', zamponaDur: 0.38 },
    { zampona: 'C5', zamponaDur: 0.75, bombo: true },
    {},
    { zampona: 'A4', zamponaDur: 0.75, bombo: true },
    { zampona: 'C5', zamponaDur: 0.38 },
    { zampona: 'D5', zamponaDur: 0.85, bombo: true },
    {},
    { zampona: 'G5', zamponaDur: 0.7, bombo: true },
    { zampona: 'E5', zamponaDur: 0.38 },
    { zampona: 'D5', zamponaDur: 0.75, bombo: true },
    { zampona: 'C5', zamponaDur: 0.38 },
    { zampona: 'A4', zamponaDur: 1.1, bombo: true },
    {},
    { bombo: true },
    {}
  ],
  charango: [
    { charango: ['A3', 'C4', 'E4'], zampona: 'A4', zamponaDur: 0.45, bombo: true },
    { charango: ['E4', 'A4'] },
    { charango: ['C4', 'E4'], zampona: 'C5', zamponaDur: 0.45 },
    { charango: ['A4', 'C5'] },
    { charango: ['G3', 'B3', 'D4'], zampona: 'D5', zamponaDur: 0.5, bombo: true },
    { charango: ['D4', 'G4'] },
    { charango: ['B3', 'D4'], zampona: 'E5', zamponaDur: 0.55 },
    { charango: ['G4', 'B4'] },
    { charango: ['C3', 'G3', 'C4'], zampona: 'G5', zamponaDur: 0.45, bombo: true },
    { charango: ['E4', 'G4'] },
    { charango: ['C4', 'E4'], zampona: 'E5', zamponaDur: 0.45 },
    { charango: ['G4', 'C5'] },
    { charango: ['E3', 'B3', 'E4'], zampona: 'D5', zamponaDur: 0.45, bombo: true },
    { charango: ['G3', 'B3'] },
    { charango: ['A3', 'E4'], zampona: 'A4', zamponaDur: 0.7 },
    { charango: ['C4', 'A4'] }
  ],
  ceremonia: [
    { zampona: 'A4', zamponaDur: 0.9, charango: ['A3', 'E4', 'A4'], bombo: true },
    {},
    { zampona: 'C5', zamponaDur: 0.65, charango: ['C4', 'E4'] },
    { charango: ['A3', 'E4'] },
    { zampona: 'E5', zamponaDur: 0.9, charango: ['E3', 'B3', 'E4'], bombo: true },
    {},
    { zampona: 'D5', zamponaDur: 0.65, charango: ['D4', 'G4'] },
    { zampona: 'C5', zamponaDur: 0.45 },
    { zampona: 'G4', zamponaDur: 0.9, charango: ['G3', 'D4', 'G4'], bombo: true },
    {},
    { zampona: 'A4', zamponaDur: 0.7, charango: ['A3', 'C4', 'E4'] },
    {},
    { zampona: 'E4', zamponaDur: 1.0, charango: ['E3', 'B3', 'E4'], bombo: true },
    {},
    { bombo: true },
    {}
  ],
  fiesta: [
    { charango: ['C4', 'E4', 'G4'], zampona: 'G5', zamponaDur: 0.4, bombo: true },
    { charango: ['E4', 'G4'], zampona: 'E5', zamponaDur: 0.35 },
    { charango: ['C4', 'G4'], zampona: 'G5', zamponaDur: 0.4, bombo: true },
    { charango: ['E4', 'C5'], zampona: 'A5', zamponaDur: 0.45 },
    { charango: ['D4', 'G4', 'B4'], zampona: 'G5', zamponaDur: 0.45, bombo: true },
    { charango: ['B3', 'D4'], zampona: 'E5', zamponaDur: 0.38 },
    { charango: ['A3', 'C4', 'E4'], zampona: 'D5', zamponaDur: 0.45, bombo: true },
    { charango: ['C4', 'E4'], zampona: 'C5', zamponaDur: 0.4 },
    { charango: ['A3', 'E4'], zampona: 'D5', zamponaDur: 0.4, bombo: true },
    { charango: ['C4', 'A4'], zampona: 'E5', zamponaDur: 0.4 },
    { charango: ['G3', 'B3', 'D4'], zampona: 'D5', zamponaDur: 0.4, bombo: true },
    { charango: ['B3', 'D4'], zampona: 'C5', zamponaDur: 0.38 },
    { charango: ['A3', 'C4', 'E4'], zampona: 'A4', zamponaDur: 0.7, bombo: true },
    { charango: ['E4', 'A4'] },
    { bombo: true },
    {}
  ]
};

const VICTORY_TEMPO_MS = 250;

const VICTORY_PATTERN: StepEvent[] = [
  {
    horn: ['D3', 'A3', 'D4'],
    zampona: 'D5',
    zamponaHarmony: 'A4',
    zamponaDur: 0.75,
    charango: ['D4', 'F#4', 'A4'],
    bombo: true
  },
  { charango: ['A4', 'D5'], zampona: 'F#5', zamponaDur: 0.35 },
  {
    zampona: 'A5',
    zamponaHarmony: 'D5',
    zamponaDur: 0.65,
    charango: ['D4', 'A4', 'D5'],
    bombo: true
  },
  { charango: ['F#4', 'A4'] },
  {
    horn: ['B3', 'F#4', 'B4'],
    zampona: 'B5',
    zamponaHarmony: 'F#5',
    zamponaDur: 0.7,
    charango: ['B3', 'D4', 'F#4'],
    bombo: true
  },
  { zampona: 'A5', zamponaDur: 0.38, charango: ['D4', 'F#4'] },
  {
    zampona: 'F#5',
    zamponaHarmony: 'D5',
    zamponaDur: 0.65,
    charango: ['A3', 'D4', 'F#4'],
    bombo: true
  },
  { bombo: true, charango: ['D4', 'A4'] },
  {
    horn: ['G3', 'D4', 'G4'],
    zampona: 'G5',
    zamponaHarmony: 'D5',
    zamponaDur: 0.65,
    charango: ['G3', 'B3', 'D4'],
    bombo: true
  },
  { zampona: 'A5', zamponaDur: 0.4, charango: ['B3', 'D4', 'G4'] },
  {
    zampona: 'B5',
    zamponaHarmony: 'G5',
    zamponaDur: 0.65,
    charango: ['D4', 'G4', 'B4'],
    bombo: true
  },
  { zampona: 'A5', zamponaDur: 0.4, charango: ['A3', 'E4', 'A4'] },
  {
    horn: ['D3', 'A3', 'D4'],
    zampona: 'D6',
    zamponaHarmony: 'A5',
    zamponaDur: 1.05,
    charango: ['D4', 'F#4', 'A4', 'D5'],
    bombo: true
  },
  { charango: ['F#4', 'A4', 'D5'] },
  { zampona: 'A5', zamponaHarmony: 'F#5', zamponaDur: 0.55, bombo: true },
  { charango: ['D4', 'A4', 'D5'], bombo: true }
];

class AndeanSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private muted = false;
  private volume = 0.6;
  private musicPlaying = false;
  private victoryMode = false;
  private autoRotate = true;
  private trackId: AndeanTrackId = 'altiplano';
  private stepTimer: number | null = null;
  private stepIndex = 0;
  private loopsCompleted = 0;
  private listeners = new Set<() => void>();

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.musicGain.gain.value = 0.52;
        this.sfxGain.gain.value = 0.9;
        this.masterGain.gain.value = this.muted ? 0 : this.volume;

        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        const len = this.ctx.sampleRate * 1;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buf;
      } catch {
        this.ctx = null;
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private syncMasterGain() {
    if (!this.ctx || !this.masterGain) return;
    const target = this.muted ? 0 : this.volume;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.syncMasterGain();
    this.notify();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume > 0 && this.muted) {
      this.muted = false;
    }
    this.ensureContext();
    this.syncMasterGain();
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public getTrackId(): AndeanTrackId {
    return this.trackId;
  }

  public isAutoRotate(): boolean {
    return this.autoRotate;
  }

  public setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
    this.notify();
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public setVictoryMode(enabled: boolean) {
    if (this.victoryMode === enabled) return;
    this.victoryMode = enabled;
    this.stepIndex = 0;
    this.loopsCompleted = 0;
    if (this.musicPlaying) {
      this.restartScheduler();
    }
    this.notify();
  }

  public isVictoryMode(): boolean {
    return this.victoryMode;
  }

  public setTrack(trackId: AndeanTrackId) {
    this.trackId = trackId;
    this.stepIndex = 0;
    this.loopsCompleted = 0;
    if (this.musicPlaying && !this.victoryMode) {
      this.restartScheduler();
    }
    this.notify();
  }

  public startMusic() {
    this.ensureContext();
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    this.restartScheduler();
    this.notify();
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.stepTimer !== null) {
      window.clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    this.notify();
  }

  public toggleMusic() {
    if (this.musicPlaying) this.stopMusic();
    else this.startMusic();
  }

  private advanceNextTrack() {
    const idx = ANDEAN_TRACKS.findIndex((t) => t.id === this.trackId);
    const nextTrack = ANDEAN_TRACKS[(idx + 1) % ANDEAN_TRACKS.length];
    this.trackId = nextTrack.id;
    this.stepIndex = 0;
    this.loopsCompleted = 0;
    this.restartScheduler();
    this.notify();
  }

  private restartScheduler() {
    if (this.stepTimer !== null) {
      window.clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    const meta = ANDEAN_TRACKS.find((t) => t.id === this.trackId) || ANDEAN_TRACKS[0];
    const intervalMs = this.victoryMode ? VICTORY_TEMPO_MS : meta.tempoMs;
    this.runStep();
    this.stepTimer = window.setInterval(() => this.runStep(), intervalMs);
  }

  private runStep() {
    if (!this.musicPlaying || this.muted || this.volume <= 0.005) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain) return;

    const pattern = this.victoryMode ? VICTORY_PATTERN : TRACK_PATTERNS[this.trackId];
    const step = pattern[this.stepIndex % pattern.length];
    this.stepIndex += 1;

    if (this.stepIndex >= pattern.length) {
      this.stepIndex = 0;
      this.loopsCompleted += 1;
      // Automatically cycle to next Andean composition after 2 phrases during gameplay
      if (!this.victoryMode && this.autoRotate && this.loopsCompleted >= 2) {
        this.advanceNextTrack();
        return;
      }
    }

    const when = ctx.currentTime + 0.03;

    if (step.horn && step.horn.length > 0) {
      step.horn.forEach((n) => {
        if (NOTE[n]) {
          this.playHeroicHorn(ctx, NOTE[n], 0.95, when);
        }
      });
    }
    if (step.zampona && NOTE[step.zampona]) {
      this.playZamponaNote(ctx, NOTE[step.zampona], step.zamponaDur || 0.6, when);
    }
    if (step.zamponaHarmony && NOTE[step.zamponaHarmony]) {
      this.playZamponaNote(ctx, NOTE[step.zamponaHarmony], (step.zamponaDur || 0.6) * 0.9, when);
    }
    if (step.charango && step.charango.length > 0) {
      step.charango.forEach((n, idx) => {
        if (NOTE[n]) {
          this.playCharangoPluck(ctx, NOTE[n], when + idx * 0.022);
        }
      });
    }
    if (step.bombo) {
      this.playBomboDrum(ctx, when, this.victoryMode ? 0.22 : 0.16);
    }
  }

  private playHeroicHorn(ctx: AudioContext, freq: number, duration: number, when: number) {
    if (!this.musicGain) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, when);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, when);
    filter.frequency.linearRampToValueAtTime(1150, when + 0.16);
    filter.frequency.exponentialRampToValueAtTime(480, when + duration);

    env.gain.setValueAtTime(0.0001, when);
    env.gain.linearRampToValueAtTime(0.042, when + 0.08);
    env.gain.exponentialRampToValueAtTime(0.028, when + duration * 0.6);
    env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);

    osc.start(when);
    osc.stop(when + duration + 0.04);
  }

  private playZamponaNote(ctx: AudioContext, freq: number, duration: number, when: number) {
    if (!this.musicGain) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, when);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, when);

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(4.8, when);
    vibGain.gain.setValueAtTime(3.2, when);
    vibrato.connect(vibGain);
    vibGain.connect(osc1.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, when);

    env.gain.setValueAtTime(0.0001, when);
    env.gain.linearRampToValueAtTime(0.11, when + 0.06);
    env.gain.exponentialRampToValueAtTime(0.075, when + duration * 0.55);
    env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(Math.min(2400, freq * 2.2), when);
      bp.Q.setValueAtTime(2.5, when);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.0001, when);
      nGain.gain.linearRampToValueAtTime(0.024, when + 0.035);
      nGain.gain.exponentialRampToValueAtTime(0.0001, when + Math.min(0.28, duration));

      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(this.musicGain);
      noise.start(when);
      noise.stop(when + 0.3);
    }

    osc1.start(when);
    osc2.start(when);
    vibrato.start(when);
    osc1.stop(when + duration + 0.04);
    osc2.stop(when + duration + 0.04);
    vibrato.stop(when + duration + 0.04);
  }

  private playCharangoPluck(ctx: AudioContext, freq: number, when: number) {
    if (!this.musicGain) return;

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    oscA.type = 'triangle';
    oscB.type = 'sawtooth';
    oscA.frequency.setValueAtTime(freq, when);
    oscB.frequency.setValueAtTime(freq * 1.003, when);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, when);
    filter.frequency.exponentialRampToValueAtTime(650, when + 0.28);

    env.gain.setValueAtTime(0.0001, when);
    env.gain.linearRampToValueAtTime(0.065, when + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.32);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(env);
    env.connect(this.musicGain);

    oscA.start(when);
    oscB.start(when);
    oscA.stop(when + 0.35);
    oscB.stop(when + 0.35);
  }

  private playBomboDrum(ctx: AudioContext, when: number, level = 0.16) {
    if (!this.musicGain) return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(92, when);
    osc.frequency.exponentialRampToValueAtTime(44, when + 0.14);

    env.gain.setValueAtTime(0.0001, when);
    env.gain.linearRampToValueAtTime(level, when + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.24);

    osc.connect(env);
    env.connect(this.musicGain);

    osc.start(when);
    osc.stop(when + 0.26);
  }

  private playSfxTone(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0, gainVal = 0.1) {
    if (this.muted || this.volume <= 0.005) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick() {
    this.playSfxTone(520, 0.09, 'triangle', 0, 0.07);
  }

  public playTileSwap() {
    this.playSfxTone(440, 0.08, 'triangle', 0, 0.07);
    this.playSfxTone(587.33, 0.09, 'triangle', 0.04, 0.06);
  }

  public playWrong() {
    this.playSfxTone(196, 0.18, 'triangle', 0, 0.09);
    this.playSfxTone(164.81, 0.24, 'triangle', 0.09, 0.08);
  }

  public playRelicUnlock() {
    const notes = [587.33, 698.46, 783.99, 880, 1174.66];
    notes.forEach((n, idx) => {
      this.playSfxTone(n, 0.35, 'sine', idx * 0.075, 0.09);
    });
  }

  public playVictoryFanfare() {
    const notes = [440, 523.25, 587.33, 698.46, 880, 1046.5, 1174.66];
    notes.forEach((n, idx) => {
      this.playSfxTone(n, 0.48, 'triangle', idx * 0.09, 0.095);
    });
  }
}

export const soundEngine = new AndeanSoundEngine();
