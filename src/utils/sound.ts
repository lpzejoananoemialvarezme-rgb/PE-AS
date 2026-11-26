export type AndeanTrackId = 'altiplano' | 'charango' | 'ceremonia' | 'fiesta';

export type AmbientSceneId =
  | 'altiplano_breeze'
  | 'plaza_market'
  | 'colonial_sanctuary'
  | 'ancient_trail'
  | 'sacred_cave'
  | 'summit_wind'
  | 'victory_glow';

export interface AmbientSceneMeta {
  id: AmbientSceneId;
  label: string;
}

export const AMBIENT_SCENES: Record<AmbientSceneId, AmbientSceneMeta> = {
  altiplano_breeze: { id: 'altiplano_breeze', label: 'Brisa del Altiplano' },
  plaza_market: { id: 'plaza_market', label: 'Mercado y Plaza Viva' },
  colonial_sanctuary: { id: 'colonial_sanctuary', label: 'Atrio del Templo Colonial' },
  ancient_trail: { id: 'ancient_trail', label: 'Sendero de Paja Brava' },
  sacred_cave: { id: 'sacred_cave', label: 'Eco en Gruta Granítica' },
  summit_wind: { id: 'summit_wind', label: 'Viento de Alta Montaña' },
  victory_glow: { id: 'victory_glow', label: 'Cumbre Dorada de Peñas' }
};

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

const AMBIENT_CROSSFADE_S = 2.0;

function buildEqualPowerFadeInCurve(targetLevel: number, steps = 64): Float32Array {
  const curve = new Float32Array(steps);
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    curve[i] = Math.sin(t * Math.PI * 0.5) * targetLevel;
  }
  return curve;
}

function buildEqualPowerFadeOutCurve(startLevel: number, steps = 64): Float32Array {
  const curve = new Float32Array(steps);
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    curve[i] = Math.max(0, Math.cos(t * Math.PI * 0.5) * startLevel);
  }
  curve[steps - 1] = 0;
  return curve;
}

interface ActiveAmbientRig {
  sceneId: AmbientSceneId;
  gain: GainNode;
  targetLevel: number;
  sources: Array<{ stop: () => void; disconnect: () => void }>;
  nodes: AudioNode[];
  accentTimer: number | null;
  cleanupTimer: number | null;
}

class AndeanSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private pinkNoiseBuffer: AudioBuffer | null = null;

  private muted = false;
  private volume = 0.6;
  private musicPlaying = false;
  private ambientEnabled = true;
  private ambientScene: AmbientSceneId = 'altiplano_breeze';
  private activeAmbient: ActiveAmbientRig | null = null;
  private fadingAmbients = new Set<ActiveAmbientRig>();
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
        this.ambientGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.musicGain.gain.value = 0.5;
        this.ambientGain.gain.value = this.ambientEnabled ? 0.36 : 0;
        this.sfxGain.gain.value = 0.9;
        this.masterGain.gain.value = this.muted ? 0 : this.volume;

        this.musicGain.connect(this.masterGain);
        this.ambientGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        // Short white noise buffer for zampona breath transients
        const len = this.ctx.sampleRate * 1;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buf;

        // 4-second seamless pink/brown ambient noise buffer for wind, market & cave air
        const ambLen = this.ctx.sampleRate * 4;
        const ambBuf = this.ctx.createBuffer(1, ambLen, this.ctx.sampleRate);
        const ambData = ambBuf.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;
        for (let i = 0; i < ambLen; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          ambData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }
        // Smooth loop seam crossfade across first/last 0.15s
        const fadeSamples = Math.floor(this.ctx.sampleRate * 0.15);
        for (let i = 0; i < fadeSamples; i++) {
          const w = i / fadeSamples;
          const tailIdx = ambLen - fadeSamples + i;
          const blended = ambData[i] * w + ambData[tailIdx] * (1 - w);
          ambData[i] = blended;
          ambData[tailIdx] = blended;
        }
        this.pinkNoiseBuffer = ambBuf;
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

  public isAmbientEnabled(): boolean {
    return this.ambientEnabled;
  }

  public getAmbientScene(): AmbientSceneId {
    return this.ambientScene;
  }

  public setAmbientEnabled(enabled: boolean) {
    this.ambientEnabled = enabled;
    if (this.ctx && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(enabled ? 0.36 : 0, this.ctx.currentTime, 0.25);
    }
    if (enabled && this.musicPlaying && !this.activeAmbient) {
      this.startAmbientLayer(this.ambientScene);
    } else if (!enabled) {
      this.stopAmbientLayer();
    }
    this.notify();
  }

  public syncAmbientContext(
    screen: 'TITLE_MENU' | 'MAP_VIEW' | 'STAGE_MODAL' | 'VICTORY_SCREEN',
    activeStageId: number | null
  ) {
    let nextScene: AmbientSceneId = 'altiplano_breeze';
    if (screen === 'VICTORY_SCREEN') {
      nextScene = 'victory_glow';
    } else if ((screen === 'MAP_VIEW' || screen === 'STAGE_MODAL') && activeStageId !== null) {
      switch (activeStageId) {
        case 1:
          nextScene = 'plaza_market';
          break;
        case 2:
          nextScene = 'colonial_sanctuary';
          break;
        case 3:
          nextScene = 'ancient_trail';
          break;
        case 4:
        case 5:
          nextScene = 'sacred_cave';
          break;
        case 6:
        case 7:
          nextScene = 'summit_wind';
          break;
        default:
          nextScene = 'altiplano_breeze';
      }
    }

    if (nextScene === this.ambientScene && this.activeAmbient) {
      return;
    }
    this.ambientScene = nextScene;
    if (this.musicPlaying && this.ambientEnabled && this.ctx) {
      this.startAmbientLayer(nextScene);
    }
    this.notify();
  }

  private disposeRigNodes(rig: ActiveAmbientRig) {
    if (rig.accentTimer !== null) {
      window.clearInterval(rig.accentTimer);
      rig.accentTimer = null;
    }
    if (rig.cleanupTimer !== null) {
      window.clearTimeout(rig.cleanupTimer);
      rig.cleanupTimer = null;
    }
    rig.sources.forEach((s) => {
      try {
        s.stop();
        s.disconnect();
      } catch {
        // ignore
      }
    });
    rig.nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        // ignore
      }
    });
    try {
      rig.gain.disconnect();
    } catch {
      // ignore
    }
    this.fadingAmbients.delete(rig);
  }

  private teardownRig(rig: ActiveAmbientRig, immediate = false, fadeDurationS = AMBIENT_CROSSFADE_S) {
    if (rig.accentTimer !== null) {
      window.clearInterval(rig.accentTimer);
      rig.accentTimer = null;
    }
    if (rig.cleanupTimer !== null) {
      window.clearTimeout(rig.cleanupTimer);
      rig.cleanupTimer = null;
    }

    const ctx = this.ctx;
    if (!ctx || immediate) {
      this.disposeRigNodes(rig);
      return;
    }

    this.fadingAmbients.add(rig);
    const now = ctx.currentTime;
    const param = rig.gain.gain;
    const currentLevel = Math.max(0.0001, Math.min(1, param.value || rig.targetLevel));

    try {
      const paramWithHold = param as AudioParam & { cancelAndHoldAtTime?: (t: number) => void };
      if (typeof paramWithHold.cancelAndHoldAtTime === 'function') {
        paramWithHold.cancelAndHoldAtTime(now);
      } else {
        param.cancelScheduledValues(now);
      }
      param.setValueCurveAtTime(
        buildEqualPowerFadeOutCurve(currentLevel),
        now + 0.01,
        fadeDurationS
      );
    } catch {
      param.setTargetAtTime(0, now, fadeDurationS * 0.28);
    }

    rig.cleanupTimer = window.setTimeout(() => {
      this.disposeRigNodes(rig);
    }, Math.ceil(fadeDurationS * 1000) + 160);
  }

  private stopAmbientLayer(immediate = false) {
    if (immediate) {
      Array.from(this.fadingAmbients).forEach((rig) => this.disposeRigNodes(rig));
    }
    if (!this.activeAmbient) return;
    const prev = this.activeAmbient;
    this.activeAmbient = null;
    this.teardownRig(prev, immediate, immediate ? 0 : 1.1);
  }

  private startAmbientLayer(sceneId: AmbientSceneId) {
    const ctx = this.ensureContext();
    if (!ctx || !this.ambientGain || !this.pinkNoiseBuffer || !this.ambientEnabled) return;

    const hadPrevious = Boolean(this.activeAmbient || this.fadingAmbients.size > 0);
    if (this.activeAmbient) {
      const prev = this.activeAmbient;
      this.activeAmbient = null;
      this.teardownRig(prev, false, AMBIENT_CROSSFADE_S);
    }

    const now = ctx.currentTime;
    const rigGain = ctx.createGain();
    rigGain.gain.value = 0;
    rigGain.connect(this.ambientGain);

    const rig: ActiveAmbientRig = {
      sceneId,
      gain: rigGain,
      targetLevel: 0.55,
      sources: [],
      nodes: [],
      accentTimer: null,
      cleanupTimer: null
    };

    const addLoopNoise = (
      filterType: BiquadFilterType,
      baseFreq: number,
      qVal: number,
      lfoRate: number,
      lfoDepth: number,
      layerGainVal: number,
      rate = 1
    ) => {
      if (!this.pinkNoiseBuffer) return;
      const src = ctx.createBufferSource();
      src.buffer = this.pinkNoiseBuffer;
      src.loop = true;
      src.playbackRate.value = rate;

      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.setValueAtTime(qVal, now);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(lfoRate, now);
      const lfoAmp = ctx.createGain();
      lfoAmp.gain.setValueAtTime(lfoDepth, now);
      lfo.connect(lfoAmp);
      lfoAmp.connect(filter.frequency);

      const layerGain = ctx.createGain();
      layerGain.gain.setValueAtTime(layerGainVal, now);

      src.connect(filter);
      filter.connect(layerGain);
      layerGain.connect(rigGain);

      src.start(now);
      lfo.start(now);

      rig.sources.push(src, lfo);
      rig.nodes.push(filter, lfoAmp, layerGain);
    };

    const addWarmPad = (freqs: number[], padLevel: number) => {
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(620, now);

        const g = ctx.createGain();
        g.gain.setValueAtTime(padLevel / freqs.length, now);

        osc.connect(lp);
        lp.connect(g);
        g.connect(rigGain);

        osc.start(now);
        rig.sources.push(osc);
        rig.nodes.push(lp, g);
      });
    };

    let targetLevel = 0.55;

    switch (sceneId) {
      case 'altiplano_breeze': {
        // Warm wide breeze + subtle golden harmonic horizon
        addLoopNoise('bandpass', 360, 1.3, 0.14, 150, 0.42, 0.95);
        addLoopNoise('lowpass', 220, 0.7, 0.08, 70, 0.25, 0.8);
        addWarmPad([NOTE.A2, NOTE.E3], 0.055);
        targetLevel = 0.58;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          if (Math.random() < 0.45) {
            this.playAmbientChime(ctx, rigGain, [NOTE.A4, NOTE.E5, NOTE.C5][Math.floor(Math.random() * 3)], 0.016, 1.5);
          }
        }, 4200);
        break;
      }

      case 'plaza_market': {
        // Soft bustling plaza murmur (layered mid-band voice-like swells) + sunlit courtyard air
        addLoopNoise('bandpass', 640, 2.2, 0.36, 210, 0.32, 1.08);
        addLoopNoise('bandpass', 1120, 2.8, 0.48, 280, 0.16, 1.15);
        addLoopNoise('lowpass', 260, 0.8, 0.11, 60, 0.22, 0.9);
        addWarmPad([NOTE.C3, NOTE.G3], 0.04);
        targetLevel = 0.62;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          const roll = Math.random();
          if (roll < 0.52) {
            // Soft ceramic/wooden artisan stall clack
            this.playSoftMarketTap(ctx, rigGain);
          } else if (roll < 0.8) {
            // Gentle plaza bird chirp
            this.playDistantBird(ctx, rigGain);
          }
        }, 2100);
        break;
      }

      case 'colonial_sanctuary': {
        // Warm echoing adobe-stone stillness + distant golden bell overtones
        addLoopNoise('bandpass', 270, 1.8, 0.09, 80, 0.26, 0.82);
        addWarmPad([NOTE.D3, NOTE.A3, NOTE['F#4']], 0.065);
        targetLevel = 0.55;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          if (Math.random() < 0.6) {
            const note = Math.random() < 0.5 ? NOTE.A4 : NOTE.D5;
            this.playAmbientChime(ctx, rigGain, note, 0.022, 2.4);
          }
        }, 4600);
        break;
      }

      case 'ancient_trail': {
        // Breeze rustling across dry paja brava grass + distant pastoral llama bell
        addLoopNoise('bandpass', 520, 1.5, 0.21, 220, 0.34, 1.0);
        addLoopNoise('highpass', 1650, 0.9, 0.26, 480, 0.09, 1.12);
        addWarmPad([NOTE.E3, NOTE.B3], 0.045);
        targetLevel = 0.58;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          const roll = Math.random();
          if (roll < 0.48) {
            this.playAmbientChime(ctx, rigGain, Math.random() < 0.5 ? NOTE.E5 : NOTE.B4, 0.018, 1.1);
          } else if (roll < 0.78) {
            this.playDistantBird(ctx, rigGain);
          }
        }, 3200);
        break;
      }

      case 'sacred_cave': {
        // Deep warm granitic cave resonance + soft echoing water drops
        addLoopNoise('lowpass', 175, 1.4, 0.08, 45, 0.48, 0.72);
        addLoopNoise('bandpass', 320, 2.4, 0.11, 70, 0.14, 0.78);
        addWarmPad([NOTE.A2, NOTE.E3], 0.06);
        targetLevel = 0.6;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          if (Math.random() < 0.68) {
            this.playCaveWaterDrop(ctx, rigGain);
          }
        }, 2800);
        break;
      }

      case 'summit_wind': {
        // Sweeping high-Cordillera mountain wind + epic warm ridge drone
        addLoopNoise('bandpass', 430, 1.9, 0.16, 260, 0.44, 1.05);
        addLoopNoise('bandpass', 920, 2.6, 0.12, 340, 0.18, 1.18);
        addLoopNoise('lowpass', 190, 0.8, 0.09, 55, 0.3, 0.85);
        addWarmPad([NOTE.D3, NOTE.A3, NOTE.E4], 0.058);
        targetLevel = 0.64;
        rig.accentTimer = window.setInterval(() => {
          if (!this.musicPlaying || !this.ambientEnabled || this.muted) return;
          if (Math.random() < 0.4) {
            this.playAmbientChime(ctx, rigGain, NOTE.A4, 0.015, 2.1);
          }
        }, 4400);
        break;
      }

      case 'victory_glow': {
        // Warm golden summit breeze + celebratory harmonic pad
        addLoopNoise('bandpass', 400, 1.4, 0.13, 170, 0.3, 0.98);
        addWarmPad([NOTE.D3, NOTE.A3, NOTE['F#4']], 0.06);
        targetLevel = 0.5;
        break;
      }
    }

    rig.targetLevel = targetLevel;
    const fadeInDuration = hadPrevious ? AMBIENT_CROSSFADE_S : 1.35;
    try {
      rigGain.gain.cancelScheduledValues(now);
      rigGain.gain.setValueCurveAtTime(
        buildEqualPowerFadeInCurve(targetLevel),
        now + 0.01,
        fadeInDuration
      );
    } catch {
      rigGain.gain.setTargetAtTime(targetLevel, now, fadeInDuration * 0.32);
    }
    this.activeAmbient = rig;
  }

  private playAmbientChime(
    ctx: AudioContext,
    dest: GainNode,
    freq: number,
    level: number,
    duration: number
  ) {
    const now = ctx.currentTime + 0.02;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.0, now);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(0.22, now);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(level, now + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(env);
    overtone.connect(overGain);
    overGain.connect(env);
    env.connect(dest);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
  }

  private playSoftMarketTap(ctx: AudioContext, dest: GainNode) {
    if (!this.noiseBuffer) return;
    const now = ctx.currentTime + 0.02;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(900 + Math.random() * 900, now);
    bp.Q.setValueAtTime(6, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.024, now + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    src.connect(bp);
    bp.connect(env);
    env.connect(dest);

    src.start(now);
    src.stop(now + 0.09);
  }

  private playDistantBird(ctx: AudioContext, dest: GainNode) {
    const now = ctx.currentTime + 0.02;
    const base = 1850 + Math.random() * 650;
    [0, 0.14].forEach((offset, idx) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base + idx * 140, t);
      osc.frequency.exponentialRampToValueAtTime(base + 340, t + 0.08);

      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.011, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

      osc.connect(env);
      env.connect(dest);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  private playCaveWaterDrop(ctx: AudioContext, dest: GainNode) {
    const now = ctx.currentTime + 0.02;
    const startFreq = 680 + Math.random() * 440;
    // Primary drop + soft echo repeat
    [
      { delay: 0, amp: 0.024 },
      { delay: 0.24, amp: 0.009 }
    ].forEach(({ delay, amp }) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.48, t + 0.09);

      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(amp, t + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(env);
      env.connect(dest);
      osc.start(t);
      osc.stop(t + 0.24);
    });
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
    if (this.ambientEnabled && !this.activeAmbient) {
      this.startAmbientLayer(this.ambientScene);
    }
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
    this.stopAmbientLayer(false);
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

