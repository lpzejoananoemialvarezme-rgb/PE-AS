import { soundEngine } from './sound';
import { AppLanguage, getStoredLanguage } from '../i18n/types';

type VoiceListener = (speaking: boolean) => void;

const MAX_CLIENT_AUDIO_CACHE = 32;

class TataVoiceEngine {
  private speaking = false;
  private language: AppLanguage = getStoredLanguage();
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

  public setLanguage(lang: AppLanguage): void {
    this.language = lang;
  }

  public getLanguage(): AppLanguage {
    return this.language;
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

  private pickVoiceWithConfidence(): { voice: SpeechSynthesisVoice | null; isConfirmedMale: boolean } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { voice: null, isConfirmedMale: false };
    }
    let voices: SpeechSynthesisVoice[] = [];
    try {
      const fresh = window.speechSynthesis.getVoices();
      if (fresh && fresh.length > 0) {
        this.cachedVoices = fresh;
        voices = fresh;
      } else {
        voices = this.cachedVoices;
      }
    } catch {
      voices = this.cachedVoices;
    }

    if (this.language === 'en') {
      const english = voices.filter((v) => {
        const norm = (v.lang || '').replace(/_/g, '-').toLowerCase();
        return norm.startsWith('en');
      });
      if (english.length === 0) return { voice: null, isConfirmedMale: false };

      const enMalePattern =
        /\b(daniel|george|arthur|oliver|brian|matthew|david|mark|christopher|andrew|guy|eric|roger|ryan|stephen|steffan|tony|davis|jason|brandon|aaron|alex|fred|reed|grandpa|eddy|rocko|male|man|masculine)\b/;
      const enFemalePattern =
        /\b(samantha|victoria|karen|kate|serena|fiona|moira|tessa|allison|ava|susan|zira|hazel|jenny|aria|michelle|emma|sonia|libby|clara|flo|grandma|sandy|shelley|female|woman|girl)\b/;

      const classifyMale = (v: SpeechSynthesisVoice) =>
        enMalePattern.test(`${(v.name || '').toLowerCase()} ${(v.voiceURI || '').toLowerCase()}`);

      const scoreEn = (v: SpeechSynthesisVoice): number => {
        const name = (v.name || '').toLowerCase();
        const fullId = `${name} ${(v.voiceURI || '').toLowerCase()}`;
        const lang = (v.lang || '').replace(/_/g, '-').toLowerCase();
        let score = 0;

        if (/espeak|compact|festival|mbrola|flite|pico/.test(fullId)) score -= 950;
        if (classifyMale(v)) score += 650;
        if (/google\s+us\s+english$|google\s+uk\s+english\s+female/.test(name)) score -= 650;
        if (/google\s+uk\s+english\s+male/.test(name)) score += 650;
        if (enFemalePattern.test(fullId)) score -= 800;
        if (/natural|neural|online|enhanced|premium|wavenet|studio/.test(name)) score += 140;
        else if (/microsoft|apple|siri|samsung/.test(name)) score += 45;
        if (lang.includes('en-us')) score += 65;
        else if (lang.includes('en-gb') || lang.includes('en-ca')) score += 45;
        if (v.localService) score += 4;
        return score;
      };

      const best = [...english].sort((a, b) => scoreEn(b) - scoreEn(a))[0] || null;
      return { voice: best, isConfirmedMale: best ? classifyMale(best) : false };
    }

    if (this.language === 'pt') {
      const portuguese = voices.filter((v) => {
        const norm = (v.lang || '').replace(/_/g, '-').toLowerCase();
        return norm.startsWith('pt') || norm.startsWith('por');
      });
      if (portuguese.length === 0) return { voice: null, isConfirmedMale: false };

      const ptMalePattern =
        /\b(antonio|antônio|daniel|duarte|tiago|diogo|fabio|fábio|donato|nicolau|julio|júlio|valerio|valério|humberto|cristiano|joaquim|lucas|pedro|gabriel|rafael|eddy|reed|grandpa|rocko|male|homem|masculin)\b/;
      const ptFemalePattern =
        /\b(luciana|francisca|fernanda|joana|ines|inês|raquel|maria|thalita|leila|manuela|giovanna|yara|elsa|brenda|flo|grandma|sandy|shelley|female|mulher|femin)\b/;

      const classifyMale = (v: SpeechSynthesisVoice) =>
        ptMalePattern.test(`${(v.name || '').toLowerCase()} ${(v.voiceURI || '').toLowerCase()}`);

      const scorePt = (v: SpeechSynthesisVoice): number => {
        const name = (v.name || '').toLowerCase();
        const fullId = `${name} ${(v.voiceURI || '').toLowerCase()}`;
        const lang = (v.lang || '').replace(/_/g, '-').toLowerCase();
        let score = 0;

        if (/espeak|compact|festival|mbrola|flite|pico/.test(fullId)) score -= 950;
        if (classifyMale(v)) score += 650;
        if (/^google\s+portugu[eê]s/.test(name)) score -= 650;
        if (ptFemalePattern.test(fullId)) score -= 800;
        if (/natural|neural|online|enhanced|premium|wavenet|studio/.test(name)) score += 140;
        else if (/microsoft|apple|siri|samsung/.test(name)) score += 45;
        if (lang.includes('pt-br')) score += 75;
        else if (lang.includes('pt-pt')) score += 35;
        if (v.localService) score += 4;
        return score;
      };

      const best = [...portuguese].sort((a, b) => scorePt(b) - scorePt(a))[0] || null;
      return { voice: best, isConfirmedMale: best ? classifyMale(best) : false };
    }

    const spanish = voices.filter((v) => {
      const norm = (v.lang || '').replace(/_/g, '-').toLowerCase();
      return norm.startsWith('es') || norm.startsWith('spa');
    });
    if (spanish.length === 0) return { voice: null, isConfirmedMale: false };

    const maleNamePattern =
      /\b(alonso|jorge|tomas|tomás|raul|raúl|diego|gerardo|salomon|salomón|emilio|alvaro|álvaro|pablo|rodrigo|carlos|juan|enrique|miguel|pedro|mateo|andres|andrés|sebastian|sebastián|nicolas|nicolás|dario|darío|ernesto|oscar|óscar|luis|antonio|marcelo|gonzalo|alex|ramon|ramón|santiago|daniel|alejandro|hector|héctor|fernando|ricardo|eduardo|manuel|francisco|javier|alberto|sergio|victor|víctor|adrian|adrián|hugo|mario|ruben|rubén|ivan|iván|fabian|fabián|gustavo|roberto|patricio|lorenzo|arturo|cesar|césar|felix|félix|marcos|esteban|guillermo|agustin|agustín|bruno|lucas|gabriel|rafael|martin|martín|joaquin|joaquín|eddy|reed|grandpa|rocko|male|hombre|man|masculin)\b/;
    const androidMaleIdPattern = /es-us-x-es[df]|es-es-x-ee[cf]|es-mx-x-fs[hi]/;
    const femaleNamePattern =
      /\b(sabina|paulina|helena|elena|monica|mónica|laura|maria|maría|sofia|sofía|lucia|lucía|paloma|dalia|camila|salome|salomé|catalina|valeria|isabela|carmen|jimena|ximena|andrea|elvira|estrella|xime|abril|lia|lía|tania|veronica|verónica|trinidad|beatriz|patricia|ana|rosa|marisol|consuelo|soledad|clara|teresa|julia|nuria|silvia|angela|ángela|inma|lola|flo|grandma|sandy|shelley|female|mujer|woman|femenin)\b/;
    const androidFemaleIdPattern = /es-us-x-sf[abc]|es-es-x-ee[ad]|es-mx-x-fsg/;

    const classifyMale = (voice: SpeechSynthesisVoice): boolean => {
      const id = `${(voice.name || '').toLowerCase()} ${(voice.voiceURI || '').toLowerCase()}`;
      return maleNamePattern.test(id) || androidMaleIdPattern.test(id);
    };

    const scoreVoice = (voice: SpeechSynthesisVoice): number => {
      const name = (voice.name || '').toLowerCase();
      const uri = (voice.voiceURI || '').toLowerCase();
      const fullId = `${name} ${uri}`;
      const lang = (voice.lang || '').replace(/_/g, '-').toLowerCase();
      let score = 0;

      // Strongly avoid robotic / low-fi synthesizers
      if (/espeak|compact|festival|mbrola|flite|pico/.test(fullId)) {
        score -= 950;
      }

      // Confirmed male voices ALWAYS take precedence over female/ambiguous voices
      if (classifyMale(voice)) {
        score += 650;
      }

      // Chrome's default "Google español" and "Google español de Estados Unidos" are female
      if (/^google\s+espa[ñn]ol/.test(name)) {
        score -= 650;
      }

      if (femaleNamePattern.test(fullId) || androidFemaleIdPattern.test(fullId)) {
        score -= 800;
      }

      // Prefer neural / natural / enhanced voices among the chosen gender
      if (/natural|neural|online|enhanced|premium|wavenet|studio/.test(name)) {
        score += 140;
      } else if (/microsoft|apple|siri|samsung/.test(name)) {
        score += 45;
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
        score -= 40;
      }

      if (/latin|latino|latam|estados unidos|united states|mexico|méxico|colombia|peru|perú|bolivia|argentina|chile/.test(name)) {
        score += 35;
      }

      if (voice.localService) score += 4;
      return score;
    };

    const sorted = [...spanish].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    const best = sorted[0] || null;
    return {
      voice: best,
      isConfirmedMale: best ? classifyMale(best) : false
    };
  }

  /**
   * Strongly prioritizes warm, deep elder male voices across Spanish, English, and Portuguese.
   */
  public pickElderMaleSpanishVoice(): SpeechSynthesisVoice | null {
    return this.pickVoiceWithConfidence().voice;
  }

  public cleanForSpeech(rawText: string): string {
    let text = rawText;
    if (this.language === 'en') {
      text = text
        .replace(/m\s*(?:a\.s\.l\.|s\.\s*n\.\s*m\.)/gi, 'meters above sea level')
        .replace(/\bkm\b/gi, 'kilometers');
    } else if (this.language === 'pt') {
      text = text
        .replace(/m\s*s\.\s*n\.\s*m\./gi, 'metros acima do nível do mar')
        .replace(/\bkm\b/gi, 'quilômetros');
    } else {
      text = text
        .replace(/m\s*s\.\s*n\.\s*m\./gi, 'metros sobre el nivel del mar')
        .replace(/\bkm\b/gi, 'kilómetros');
    }

    return text
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
    const activeLang = this.language;
    const cacheKey = `${activeLang}::${cleaned}`;
    if (!cleaned || this.audioDataCache.has(cacheKey)) return;

    void this.probeServerTts().then((available) => {
      if (!available || this.audioDataCache.has(cacheKey)) return;
      void fetch('/api/tata-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned, lang: activeLang })
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
            this.storeAudioCache(cacheKey, buffer);
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

    const { voice, isConfirmedMale } = this.pickVoiceWithConfidence();
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
        const fallbackLocale =
          this.language === 'en' ? 'en-US' : this.language === 'pt' ? 'pt-BR' : 'es-BO';
        utterance.lang = voice?.lang || fallbackLocale;
        if (voice) utterance.voice = voice;
        // Calm, warm elder male voice at a gentle unhurried pace
        utterance.pitch = isConfirmedMale ? 0.84 : 0.65;
        utterance.rate = isConfirmedMale ? 0.87 : 0.85;
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
          }, 185);
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

    const activeLang = this.language;
    const cacheKey = `${activeLang}::${cleaned}`;

    this.unlockMobileAudio();
    this.stop();
    const currentSeq = this.sequenceId;
    this.onCompleteCallback = options?.onEnd || null;

    const cachedWav = this.audioDataCache.get(cacheKey);
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
      body: JSON.stringify({ text: cleaned, lang: activeLang }),
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

        this.storeAudioCache(cacheKey, wavBuffer);
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
