import { soundEngine } from './sound';

type VoiceListener = (speaking: boolean) => void;

class TataVoiceEngine {
  private speaking = false;
  private listeners = new Set<VoiceListener>();
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioCache = new Map<string, string>();
  private activeAudio: HTMLAudioElement | null = null;
  private activeAbort: AbortController | null = null;
  private sequenceId = 0;
  private pauseTimer: number | null = null;
  private initialized = false;
  private onCompleteCallback: (() => void) | null = null;
  private serverTtsAvailable = true;

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

      soundEngine.subscribe(() => {
        if (soundEngine.isMuted() && this.speaking) {
          this.stop();
        }
      });
    } catch {
      // Safe fallback
    }
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

    const spanish = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'));
    if (spanish.length === 0) return null;

    const scoreVoice = (voice: SpeechSynthesisVoice): number => {
      const name = (voice.name || '').toLowerCase();
      const uri = (voice.voiceURI || '').toLowerCase();
      const lang = (voice.lang || '').toLowerCase();
      let score = 0;

      // Strongly avoid robotic / low-fi synthesizers
      if (/espeak|compact|festival|mbrola|flite|pico/.test(name + ' ' + uri)) {
        score -= 260;
      }

      // Strongly prefer neural / natural / enhanced voices
      if (/natural|neural|online|enhanced|premium|wavenet|studio/.test(name)) {
        score += 140;
      } else if (/google|microsoft|apple|siri/.test(name)) {
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

      if (/latin|latino|latam|estados unidos|mexico|méxico|colombia|peru|perú|bolivia|argentina|chile/.test(name)) {
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
      if (
        /\b(alvaro|álvaro)\b/.test(name)
      ) {
        score += 70;
      }
      if (
        /\b(sabina|paulina|helena|elena|monica|mónica|laura|maria|maría|sofia|sofía|lucia|lucía|paloma|dalia|camila|salome|salomé|catalina|valeria|isabela|carmen|jimena|ximena|andrea|elena|female|mujer|woman)\b/.test(
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

  public stop(): void {
    this.sequenceId += 1;
    this.onCompleteCallback = null;

    if (this.activeAbort) {
      this.activeAbort.abort();
      this.activeAbort = null;
    }

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // Ignore media reset error
      }
      this.activeAudio = null;
    }

    if (this.pauseTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Ignore mobile WebView errors
    }

    this.setSpeaking(false);
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
    const speakChunk = (index: number) => {
      if (currentSeq !== this.sequenceId) return;
      if (index >= chunks.length) {
        this.setSpeaking(false);
        const done = this.onCompleteCallback;
        this.onCompleteCallback = null;
        done?.();
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.lang = voice?.lang || 'es-BO';
        if (voice) utterance.voice = voice;
        // Warm elder voice at a natural, fluent conversational pace
        utterance.pitch = 0.84;
        utterance.rate = 0.96;
        utterance.volume = 0.98;

        utterance.onstart = () => {
          if (currentSeq === this.sequenceId) {
            this.setSpeaking(true);
          }
        };

        utterance.onend = () => {
          if (currentSeq !== this.sequenceId) return;
          this.pauseTimer = window.setTimeout(() => {
            speakChunk(index + 1);
          }, 120);
        };

        utterance.onerror = () => {
          if (currentSeq === this.sequenceId) {
            this.setSpeaking(false);
            this.onCompleteCallback = null;
          }
        };

        this.setSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } catch {
        this.setSpeaking(false);
      }
    };

    speakChunk(0);
  }

  private async playAudioUrl(objectUrl: string, currentSeq: number): Promise<boolean> {
    if (currentSeq !== this.sequenceId || typeof Audio === 'undefined') return false;

    const audio = new Audio(objectUrl);
    audio.volume = 0.98;
    this.activeAudio = audio;

    audio.onended = () => {
      if (currentSeq !== this.sequenceId) return;
      this.activeAudio = null;
      this.setSpeaking(false);
      const done = this.onCompleteCallback;
      this.onCompleteCallback = null;
      done?.();
    };

    audio.onerror = () => {
      if (currentSeq !== this.sequenceId) return;
      this.activeAudio = null;
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
      this.activeAudio = null;
      // If autoplay was blocked by browser policy, don't fallback to robotic speech loudly
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

    this.stop();
    const currentSeq = this.sequenceId;
    this.onCompleteCallback = options?.onEnd || null;

    const cachedUrl = this.audioCache.get(cleaned);
    if (cachedUrl) {
      this.setSpeaking(true);
      void this.playAudioUrl(cachedUrl, currentSeq).then((handled) => {
        if (!handled && currentSeq === this.sequenceId) {
          this.speakWithBrowserFallback(cleaned, currentSeq);
        }
      });
      return true;
    }

    if (!this.serverTtsAvailable) {
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
          if (res.status === 503) {
            this.serverTtsAvailable = false;
          }
          throw new Error(`TTS_${res.status}`);
        }
        const blob = await res.blob();
        if (currentSeq !== this.sequenceId || blob.size === 0) return;

        const objectUrl = URL.createObjectURL(blob);
        this.audioCache.set(cleaned, objectUrl);
        const handled = await this.playAudioUrl(objectUrl, currentSeq);
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
