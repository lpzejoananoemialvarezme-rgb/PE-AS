import { soundEngine } from './sound';

type VoiceListener = (speaking: boolean) => void;

const MAX_CLIENT_AUDIO_CACHE = 32;

class TataVoiceEngine {
  private speaking = false;
  private listeners = new Set<VoiceListener>();
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioDataCache = new Map<string, ArrayBuffer>();
  private audioCtx: AudioContext | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private sharedAudio: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAbort: AbortController | null = null;
  private sequenceId = 0;
  private pauseTimer: number | null = null;
  private keepAliveTimer: number | null = null;
  private startGuardTimer: number | null = null;
  private initialized = false;
  private audioUnlocked = false;
  private onCompleteCallback: (() => void) | null = null;
  private serverTtsAvailable: boolean | null = null;
  private serverProbePromise: Promise<boolean> | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    try {
      if ('speechSynthesis' in window) {
        const refreshVoices = () => {
          try {
            const list = window.speechSynthesis.getVoices();
            if (list && list.length > 0) {
              this.cachedVoices = list;
            }
          } catch {
            // Ignore restricted environments
          }
        };
        refreshVoices();
        if (typeof window.speechSynthesis.addEventListener === 'function') {
          window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
        } else {
          window.speechSynthesis.onvoiceschanged = refreshVoices;
        }
      }

      const unlockOnGesture = () => {
        this.unlockMobileAudio();
        window.removeEventListener('pointerdown', unlockOnGesture, true);
        window.removeEventListener('touchstart', unlockOnGesture, true);
        window.removeEventListener('click', unlockOnGesture, true);
        window.removeEventListener('keydown', unlockOnGesture, true);
      };

      window.addEventListener('pointerdown', unlockOnGesture, { capture: true, passive: true });
      window.addEventListener('touchstart', unlockOnGesture, { capture: true, passive: true });
      window.addEventListener('click', unlockOnGesture, { capture: true, passive: true });
      window.addEventListener('keydown', unlockOnGesture, { capture: true, passive: true });

      soundEngine.subscribe(() => {
        if (soundEngine.isMuted() && this.speaking) {
          this.stop();
        }
      });

      void this.probeServerTts();
    } catch {
      // Safe fallback
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.audioCtx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public unlockMobileAudio(): void {
    if (typeof window === 'undefined') return;

    const ctx = this.ensureAudioContext();
    if (ctx && !this.audioUnlocked) {
      this.audioUnlocked = true;
      try {
        const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      } catch {
        // Ignore silent buffer unlock issues
      }
    }

    if (!this.sharedAudio && typeof Audio !== 'undefined') {
      try {
        const el = new Audio();
        el.preload = 'auto';
        el.setAttribute('playsinline', 'true');
        el.setAttribute('webkit-playsinline', 'true');
        this.sharedAudio = el;
      } catch {
        // Ignore restricted Audio element environments
      }
    }
  }

  private async probeServerTts(): Promise<boolean> {
    if (this.serverTtsAvailable !== null) {
      return this.serverTtsAvailable;
    }
    if (this.serverProbePromise) {
      return this.serverProbePromise;
    }
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      this.serverTtsAvailable = false;
      return false;
    }

    this.serverProbePromise = (async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 1600);
      try {
        const res = await fetch('/api/tata-tts/status', {
          method: 'GET',
          signal: controller.signal
        });
        if (!res.ok) {
          this.serverTtsAvailable = false;
          return false;
        }
        const data = (await res.json()) as { available?: boolean };
        this.serverTtsAvailable = Boolean(data?.available);
        return this.serverTtsAvailable;
      } catch {
        this.serverTtsAvailable = false;
        return false;
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();

    return this.serverProbePromise;
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      typeof Audio !== 'undefined' ||
      ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined')
    );
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }

  public subscribe(listener: VoiceListener): () => void {
    this.listeners.add(listener);
    listener(this.speaking);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setSpeaking(next: boolean): void {
    if (this.speaking === next) return;
    this.speaking = next;
    this.listeners.forEach((cb) => {
      try {
        cb(next);
      } catch {
        // Ignore subscriber error
      }
    });
  }

  /**
   * Strongly prioritizes warm, deep Latin American elder male voices
   * (avoiding Peninsular Spain es-ES voices whenever a LatAm voice exists).
   */
  public pickElderMaleSpanishVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    let voices = this.cachedVoices;
    if (!voices.length) {
      try {
        voices = window.speechSynthesis.getVoices();
        if (voices.length) this.cachedVoices = voices;
      } catch {
        return null;
      }
    }

    const spanish = voices.filter((v) => {
      const norm = (v.lang || '').replace(/_/g, '-').toLowerCase();
      return norm.startsWith('es') || norm.startsWith('spa');
    });
    if (spanish.length === 0) return null;

    const scoreVoice = (voice: SpeechSynthesisVoice): number => {
      const name = (voice.name || '').toLowerCase();
      const uri = (voice.voiceURI || '').toLowerCase();
      const lang = (voice.lang || '').replace(/_/g, '-').toLowerCase();
      let score = 0;

      // Strongly avoid robotic / low-fi synthesizers
      if (/espeak|compact|festival|mbrola|flite|pico/.test(name + ' ' + uri)) {
        score -= 260;
      }

      // Strongly prefer neural / natural / enhanced voices
      if (/natural|neural|online|enhanced|premium|wavenet|studio/.test(name)) {
        score += 140;
      } else if (/google|microsoft|apple|siri|samsung/.test(name)) {
        score += 50;
      }

      // Strongly prefer Latin American Spanish accents over Spain (es-ES)
      if (lang.includes('es-bo')) score += 95;
      else if (lang.includes('es-pe') || lang.includes('es-419') || lang.includes('es-ec')) {
        score += 85;
      } else if (
        lang.includes('es-co') ||
        lang.includes('es-cl') ||
        lang.includes('es-ar') ||
        lang.includes('es-mx') ||
        lang.includes('es-uy') ||
        lang.includes('es-py') ||
        lang.includes('es-us')
      ) {
        score += 75;
      } else if (lang.includes('es-es')) {
        score -= 60;
      }

      if (/latin|latino|latam|estados unidos|united states|mexico|méxico|colombia|peru|perú|bolivia|argentina|chile/.test(name)) {
        score += 55;
      }

      // Prefer deep warm male voices (avoid female voices so Tata sounds like an elder man)
      if (
        /\b(alonso|jorge|tomas|tomás|raul|raúl|diego|gerardo|salomon|salomón|emilio|rodrigo|carlos|juan|enrique|miguel|pablo|pedro|mateo|andres|andrés|sebastian|sebastián|nicolas|nicolás|dario|darío|ernesto|oscar|óscar|luis|antonio|eddy|reed|grandpa|male|hombre|man)\b/.test(
          name
        )
      ) {
        score += 110;
      }
      if (/\b(alvaro|álvaro)\b/.test(name)) {
        score += 70;
      }
      if (
        /\b(sabina|paulina|helena|elena|monica|mónica|laura|maria|maría|sofia|sofía|lucia|lucía|paloma|dalia|camila|salome|salomé|catalina|valeria|isabela|carmen|jimena|ximena|andrea|female|mujer|woman)\b/.test(
          name
        )
      ) {
        score -= 115;
      }

      if (voice.localService) score += 4;
      return score;
    };

    const sorted = [...spanish].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sorted[0] || null;
  }

  public cleanForSpeech(rawText: string): string {
    return rawText
      .replace(/m\s*s\.\s*n\.\s*m\./gi, 'metros sobre el nivel del mar')
      .replace(/\bkm\b/gi, 'kilómetros')
      .replace(/\s*[•·|]+\s*/g, ', ')
      .replace(/\(([^)]+)\)/g, ', $1, ')
      .replace(/[«»"“”]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private splitIntoCalmChunks(text: string): string[] {
    const normalized = this.cleanForSpeech(text);
    if (!normalized) return [];

    // Protect common decimal numbers like 4.000 or 1.5 before splitting sentences
    const protectedText = normalized.replace(/(\d)\.(\d)/g, '$1__DOT__$2');
    const rawParts = protectedText
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.replace(/__DOT__/g, '.').trim())
      .filter(Boolean);

    const merged: string[] = [];
    for (const part of rawParts) {
      if (merged.length > 0 && merged[merged.length - 1].length + part.length < 135) {
        merged[merged.length - 1] = `${merged[merged.length - 1]} ${part}`;
      } else {
        merged.push(part);
      }
    }
    return merged;
  }

  private clearTimers(): void {
    if (typeof window === 'undefined') return;
    if (this.pauseTimer !== null) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }
    if (this.keepAliveTimer !== null) {
      window.clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    if (this.startGuardTimer !== null) {
      window.clearTimeout(this.startGuardTimer);
      this.startGuardTimer = null;
    }
  }

  public stop(): void {
    this.sequenceId += 1;
    this.onCompleteCallback = null;
    this.clearTimers();
    this.activeUtterance = null;

    if (this.activeAbort) {
      this.activeAbort.abort();
      this.activeAbort = null;
    }

    if (this.activeSource) {
      try {
        this.activeSource.onended = null;
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch {
        // Ignore already stopped source
      }
      this.activeSource = null;
    }

    if (this.sharedAudio) {
      try {
        this.sharedAudio.onended = null;
        this.sharedAudio.onerror = null;
        this.sharedAudio.pause();
        this.sharedAudio.currentTime = 0;
      } catch {
        // Ignore media reset error
      }
    }

    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch {
        // Ignore revoke error
      }
      this.activeObjectUrl = null;
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      }
    } catch {
      // Ignore mobile WebView errors
    }

    this.setSpeaking(false);
  }

  public preload(rawText: string): void {
    if (this.serverTtsAvailable === false || typeof fetch === 'undefined') return;
    const cleaned = this.cleanForSpeech(rawText);
    if (!cleaned || this.audioDataCache.has(cleaned)) return;

    void this.probeServerTts().then((available) => {
      if (!available || this.audioDataCache.has(cleaned)) return;
      void fetch('/api/tata-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned })
      })
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 404 || res.status === 405 || res.status === 503) {
              this.serverTtsAvailable = false;
            }
            return;
          }
          const buffer = await res.arrayBuffer();
          if (buffer.byteLength > 44) {
            this.storeAudioCache(cleaned, buffer);
          }
        })
        .catch(() => {
          // Ignore silent prefetch errors
        });
    });
  }

  private storeAudioCache(key: string, buffer: ArrayBuffer): void {
    if (this.audioDataCache.size >= MAX_CLIENT_AUDIO_CACHE) {
      const oldestKey = this.audioDataCache.keys().next().value;
      if (oldestKey) this.audioDataCache.delete(oldestKey);
    }
    this.audioDataCache.set(key, buffer);
  }

  private speakWithBrowserFallback(cleanedText: string, currentSeq: number): void {
    if (
      currentSeq !== this.sequenceId ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      this.setSpeaking(false);
      this.onCompleteCallback = null;
      return;
    }

    const chunks = this.splitIntoCalmChunks(cleanedText);
    if (chunks.length === 0) {
      this.setSpeaking(false);
      this.onCompleteCallback = null;
      return;
    }

    const voice = this.pickElderMaleSpanishVoice();
    let anyChunkStarted = false;

    const finishSpeech = (invokeCallback: boolean) => {
      if (currentSeq !== this.sequenceId) return;
      this.clearTimers();
      this.activeUtterance = null;
      this.setSpeaking(false);
      const done = this.onCompleteCallback;
      this.onCompleteCallback = null;
      if (invokeCallback) done?.();
    };

    // Chrome / Android watchdog so long lines never pause mid-sentence
    this.keepAliveTimer = window.setInterval(() => {
      if (currentSeq !== this.sequenceId) return;
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {
        // Ignore resume errors
      }
    }, 10000);

    // If a mobile browser silently ignores un-gestured auto-speak, clear active UI state cleanly
    this.startGuardTimer = window.setTimeout(() => {
      if (
        currentSeq === this.sequenceId &&
        !anyChunkStarted &&
        !window.speechSynthesis.speaking &&
        !window.speechSynthesis.pending
      ) {
        finishSpeech(false);
      }
    }, 950);

    const speakChunk = (index: number) => {
      if (currentSeq !== this.sequenceId) return;
      if (index >= chunks.length) {
        finishSpeech(true);
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        this.activeUtterance = utterance;
        utterance.lang = voice?.lang || 'es-BO';
        if (voice) utterance.voice = voice;
        // Warm elder grandfather voice at a natural, fluent conversational pace
        utterance.pitch = 0.8;
        utterance.rate = 0.94;
        utterance.volume = 1;

        utterance.onstart = () => {
          if (currentSeq !== this.sequenceId) return;
          anyChunkStarted = true;
          if (this.startGuardTimer !== null) {
            window.clearTimeout(this.startGuardTimer);
            this.startGuardTimer = null;
          }
          this.setSpeaking(true);
        };

        utterance.onend = () => {
          if (currentSeq !== this.sequenceId) return;
          this.pauseTimer = window.setTimeout(() => {
            speakChunk(index + 1);
          }, 95);
        };

        utterance.onerror = () => {
          finishSpeech(false);
        };

        this.setSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } catch {
        finishSpeech(false);
      }
    };

    speakChunk(0);
  }

  private async playAudioBuffer(wavBuffer: ArrayBuffer, currentSeq: number): Promise<boolean> {
    if (currentSeq !== this.sequenceId) return false;

    const ctx = this.ensureAudioContext();
    if (ctx) {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        const decoded = await ctx.decodeAudioData(wavBuffer.slice(0));
        if (currentSeq !== this.sequenceId) return true;

        const source = ctx.createBufferSource();
        source.buffer = decoded;
        const gain = ctx.createGain();
        gain.gain.value = 0.98;
        source.connect(gain);
        gain.connect(ctx.destination);

        this.activeSource = source;
        source.onended = () => {
          if (currentSeq !== this.sequenceId) return;
          this.activeSource = null;
          this.setSpeaking(false);
          const done = this.onCompleteCallback;
          this.onCompleteCallback = null;
          done?.();
        };

        this.setSpeaking(true);
        source.start(0);
        return true;
      } catch {
        // Fall through to HTMLAudioElement playback
      }
    }

    if (typeof Audio === 'undefined') return false;

    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const objectUrl = URL.createObjectURL(blob);
    this.activeObjectUrl = objectUrl;

    const audio = this.sharedAudio || new Audio();
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.volume = 0.98;
    audio.src = objectUrl;
    this.sharedAudio = audio;

    audio.onended = () => {
      if (currentSeq !== this.sequenceId) return;
      if (this.activeObjectUrl) {
        URL.revokeObjectURL(this.activeObjectUrl);
        this.activeObjectUrl = null;
      }
      this.setSpeaking(false);
      const done = this.onCompleteCallback;
      this.onCompleteCallback = null;
      done?.();
    };

    audio.onerror = () => {
      if (currentSeq !== this.sequenceId) return;
      if (this.activeObjectUrl) {
        URL.revokeObjectURL(this.activeObjectUrl);
        this.activeObjectUrl = null;
      }
      this.setSpeaking(false);
      this.onCompleteCallback = null;
    };

    try {
      await audio.play();
      if (currentSeq !== this.sequenceId) {
        audio.pause();
        return true;
      }
      this.setSpeaking(true);
      return true;
    } catch (err) {
      if (this.activeObjectUrl) {
        URL.revokeObjectURL(this.activeObjectUrl);
        this.activeObjectUrl = null;
      }
      // Autoplay blocked by browser policy
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        this.setSpeaking(false);
        this.onCompleteCallback = null;
        return true;
      }
      return false;
    }
  }

  public speak(
    rawText: string,
    options?: {
      onEnd?: () => void;
      forceUnmute?: boolean;
    }
  ): boolean {
    if (!this.isSupported()) return false;
    if (soundEngine.isMuted() && !options?.forceUnmute) {
      return false;
    }

    const cleaned = this.cleanForSpeech(rawText);
    if (!cleaned) return false;

    this.unlockMobileAudio();
    this.stop();
    const currentSeq = this.sequenceId;
    this.onCompleteCallback = options?.onEnd || null;

    const cachedWav = this.audioDataCache.get(cleaned);
    if (cachedWav) {
      this.setSpeaking(true);
      void this.playAudioBuffer(cachedWav, currentSeq).then((handled) => {
        if (!handled && currentSeq === this.sequenceId) {
          this.speakWithBrowserFallback(cleaned, currentSeq);
        }
      });
      return true;
    }

    // If static deployment (e.g. GitHub Pages) or TTS backend unavailable,
    // run browser speechSynthesis SYNCHRONOUSLY to preserve mobile user-gesture activation!
    if (this.serverTtsAvailable === false) {
      this.speakWithBrowserFallback(cleaned, currentSeq);
      return true;
    }

    const controller = new AbortController();
    this.activeAbort = controller;
    this.setSpeaking(true);

    void fetch('/api/tata-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleaned }),
      signal: controller.signal
    })
      .then(async (res) => {
        if (currentSeq !== this.sequenceId) return;
        if (!res.ok) {
          if (res.status === 404 || res.status === 405 || res.status === 503) {
            this.serverTtsAvailable = false;
          }
          throw new Error(`TTS_${res.status}`);
        }
        this.serverTtsAvailable = true;
        const wavBuffer = await res.arrayBuffer();
        if (currentSeq !== this.sequenceId || wavBuffer.byteLength <= 44) return;

        this.storeAudioCache(cleaned, wavBuffer);
        const handled = await this.playAudioBuffer(wavBuffer, currentSeq);
        if (!handled && currentSeq === this.sequenceId) {
          this.speakWithBrowserFallback(cleaned, currentSeq);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (currentSeq !== this.sequenceId) return;
        this.speakWithBrowserFallback(cleaned, currentSeq);
      });

    return true;
  }
}

export const tataVoice = new TataVoiceEngine();
