import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { AvatarConfig } from '../types/game';
import { AymaraAvatar } from './AymaraAvatar';
import { TataCutoutCharacter } from './TataCutoutCharacter';
import { soundEngine } from '../utils/sound';

interface PlazaHistoryVideoProps {
  playerAvatar: AvatarConfig;
  playerName: string;
  onWatchedEnough: () => void;
}

interface CutsceneSlide {
  id: string;
  shortLabel: string;
  title: string;
  imageUrl: string;
  narration: string;
  avatarBadge: string;
  highlightTag?: string;
  startPct: number;
  endPct: number;
}

const SLIDES: CutsceneSlide[] = [
  {
    id: 'plaza',
    shortLabel: '1. La Plaza',
    title: 'Plaza Principal de Peñas · 3.970 m s. n. m.',
    imageUrl: ASSETS.PLAZA_KATARI,
    narration:
      '¡Bienvenido a la Plaza Principal de Peñas, a 3.970 metros sobre el nivel del mar! Este apacible espacio fue epicentro de uno de los acontecimientos más importantes de la historia andina.',
    avatarBadge: 'Tata y Tú en la Plaza',
    highlightTag: '3.970 m s. n. m.',
    startPct: 0,
    endPct: 24
  },
  {
    id: 'rebelion',
    shortLabel: '2. 1781 y Plato Paceño',
    title: '1781 · Túpac Katari, Bartolina Sisa y el Plato Paceño',
    imageUrl: ASSETS.VIDEO_KATARI_BARTOLINA,
    narration:
      'En 1781, Julián Apaza, Túpac Katari, y su esposa Bartolina Sisa encabezaron la gran rebelión indígena y sitiaron La Paz. La escasez unió choclo, papa, habas y queso frito, dando origen al Plato Paceño.',
    avatarBadge: 'Katari y Bartolina Sisa',
    highlightTag: 'Choclo · Papa · Habas · Queso frito',
    startPct: 24,
    endPct: 54
  },
  {
    id: 'casona',
    shortLabel: '3. La Casona',
    title: 'La Casona Histórica · 14 de noviembre de 1781',
    imageUrl: ASSETS.VIDEO_CASONA_SENTENCIA,
    narration:
      'Tras ser traicionado, Katari fue juzgado en la casona de la plaza, que luego hospedó al presidente Andrés de Santa Cruz, y ejecutado por cuatro caballos proclamando: Volveré y seré millones.',
    avatarBadge: 'Memoria de 1781',
    highlightTag: '«Volveré y seré millones»',
    startPct: 54,
    endPct: 80
  },
  {
    id: 'radio',
    shortLabel: '4. Radio San Gabriel',
    title: 'Radio San Gabriel · Pionera en lengua aymara',
    imageUrl: ASSETS.VIDEO_RADIO_SAN_GABRIEL,
    narration:
      'Y en esta misma plaza nació Radio San Gabriel, emisora pionera en la radiodifusión en lengua aymara.',
    avatarBadge: 'Voz viva del Altiplano',
    highlightTag: 'Idioma Aymara',
    startPct: 80,
    endPct: 100
  }
];

function safeCancelSpeech() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore speechSynthesis restrictions in WebViews / Lockdown Mode
  }
}

function speakNarration(text: string, onDone?: () => void) {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    typeof window.SpeechSynthesisUtterance === 'undefined'
  ) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'es-BO';
    utterance.rate = 0.84;
    utterance.pitch = 0.64;

    const maleHint =
      /\b(jorge|diego|carlos|juan|pablo|raul|raúl|alonso|tomas|tomás|enrique|miguel|rodrigo|pedro|antonio|alejandro|andres|andrés|sebastian|sebastián|mateo|emilio|javier|fernando|hector|héctor|luis|dario|darío|male|hombre|masculin)\b/i;
    const femaleHint =
      /\b(monica|mónica|paulina|helena|laura|sabina|lucia|lucía|sofia|sofía|carmen|maria|maría|elena|paloma|valeria|camila|marisol|conchita|angelica|angélica|francisca|ximena|dalia|female|mujer|femenin)\b/i;

    const allVoices =
      typeof window.speechSynthesis.getVoices === 'function'
        ? window.speechSynthesis.getVoices()
        : [];
    const spanishVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('es'));
    if (spanishVoices.length > 0) {
      spanishVoices.sort((a, b) => {
        const score = (v: SpeechSynthesisVoice) => {
          let s = 0;
          const n = v.name.toLowerCase();
          const l = v.lang.toLowerCase();
          if (maleHint.test(n)) s += 100;
          if (femaleHint.test(n)) s -= 80;
          if (l.startsWith('es-bo')) s += 20;
          else if (l.startsWith('es-419') || l.startsWith('es-pe') || l.startsWith('es-mx')) s += 12;
          if (!v.localService) s += 5;
          return s;
        };
        return score(b) - score(a);
      });
      utterance.voice = spanishVoices[0];
    }

    if (onDone) utterance.onend = onDone;
    window.speechSynthesis.speak(utterance);
  } catch {
    // ignore speechSynthesis errors on unsupported mobile browsers
  }
}

export const PlazaHistoryVideo: React.FC<PlazaHistoryVideoProps> = ({
  playerAvatar,
  playerName,
  onWatchedEnough
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [progress, setProgress] = useState(0); // 0..100 over ~36s
  const [sceneErrors, setSceneErrors] = useState<Record<string, boolean>>({});
  const lastSpokenSceneRef = useRef<number>(-1);
  const watchedNotifiedRef = useRef(false);

  const supportsSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const sceneIdx = SLIDES.findIndex((s, i) =>
    i === SLIDES.length - 1 ? progress >= s.startPct : progress >= s.startPct && progress < s.endPct
  );
  const activeIdx = sceneIdx >= 0 ? sceneIdx : 0;
  const current = SLIDES[activeIdx];

  // Progress timer (~36s full short video)
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + 0.42); // 0.42 per 150ms => ~35.7s total
      });
    }, 150);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  // Unlock question after watching ~50% (or jumping to scene 3/4)
  useEffect(() => {
    if (progress >= 50 && !watchedNotifiedRef.current) {
      watchedNotifiedRef.current = true;
      onWatchedEnough();
    }
    if (progress >= 100 && isPlaying) {
      setIsPlaying(false);
    }
  }, [progress, isPlaying, onWatchedEnough]);

  // Synchronized narration whenever active scene changes while playing
  useEffect(() => {
    if (!supportsSpeech) return;
    if (!isPlaying || !voiceEnabled) {
      safeCancelSpeech();
      return;
    }
    if (lastSpokenSceneRef.current !== activeIdx) {
      lastSpokenSceneRef.current = activeIdx;
      speakNarration(SLIDES[activeIdx].narration);
    }
  }, [activeIdx, isPlaying, voiceEnabled, supportsSpeech]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (supportsSpeech) safeCancelSpeech();
    };
  }, [supportsSpeech]);

  const jumpToScene = useCallback(
    (idx: number) => {
      soundEngine.playClick();
      lastSpokenSceneRef.current = -1;
      setProgress(SLIDES[idx].startPct + 0.5);
      setIsPlaying(true);
      if (idx >= 2 && !watchedNotifiedRef.current) {
        watchedNotifiedRef.current = true;
        onWatchedEnough();
      }
      if (voiceEnabled && supportsSpeech) {
        lastSpokenSceneRef.current = idx;
        speakNarration(SLIDES[idx].narration);
      }
    },
    [onWatchedEnough, supportsSpeech, voiceEnabled]
  );

  const togglePlay = () => {
    soundEngine.playClick();
    if (progress >= 100) {
      lastSpokenSceneRef.current = -1;
      setProgress(0);
      setIsPlaying(true);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      if (supportsSpeech) safeCancelSpeech();
    } else {
      lastSpokenSceneRef.current = -1;
      setIsPlaying(true);
    }
  };

  const toggleVoice = () => {
    soundEngine.playClick();
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next && supportsSpeech) {
        safeCancelSpeech();
      } else if (next && isPlaying && supportsSpeech) {
        lastSpokenSceneRef.current = activeIdx;
        speakNarration(current.narration);
      }
      return next;
    });
  };

  const localSceneProgress =
    (progress - current.startPct) / Math.max(1, current.endPct - current.startPct);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#D9A05B]/50 bg-[#081523] shadow-2xl">
      {/* Top Header Strip Outside Video Frame */}
      <div className="px-3.5 py-2.5 bg-[#0B1D2E] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-[#FFD166] truncate">
            {current.title}
          </span>
          {current.highlightTag && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1D4E89]/80 border border-[#7DD3FC]/40 text-[11px] font-semibold text-[#FFF8E7] shrink-0">
              {activeIdx === 3 ? (
                <Radio className="w-3 h-3 text-[#FFD166]" />
              ) : (
                <Sparkles className="w-3 h-3 text-[#FFD166]" />
              )}
              {current.highlightTag}
            </span>
          )}
        </div>

        {supportsSpeech && (
          <button
            type="button"
            onClick={toggleVoice}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border transition-colors shrink-0 ${
              voiceEnabled
                ? 'bg-[#1E4D3B]/95 border-[#52B788] text-[#FFF8E7]'
                : 'bg-[#081523]/90 border-white/20 text-[#9FB3C8]'
            }`}
            title={voiceEnabled ? 'Silenciar narración' : 'Activar narración'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FFD166]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? 'Narración' : 'Sin voz'}</span>
          </button>
        )}
      </div>

      {/* Clean Unobstructed 16:9 Cutscene Viewport */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0A192A] select-none">
        {/* Crossfading Illustrated Cutscene Backdrops */}
        {SLIDES.map((slide, idx) => {
          const isCurrent = idx === activeIdx;
          const broken = sceneErrors[slide.id];
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {!broken ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  onError={() => setSceneErrors((prev) => ({ ...prev, [slide.id]: true }))}
                  className="w-full h-full object-cover object-center will-change-transform"
                  style={{
                    transform: isCurrent
                      ? `scale(${1.02 + localSceneProgress * 0.08}) translate3d(${
                          (localSceneProgress - 0.5) * -2.2
                        }%, ${(localSceneProgress - 0.5) * -1.0}%, 0)`
                      : 'scale(1.02)'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0F2C4C] via-[#1E4D3B] to-[#6B4423]" />
              )}
            </div>
          );
        })}

        {/* Subtle Bottom Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050E17]/55 via-transparent to-transparent" />

        {/* Radio San Gabriel Animated Soundwave Overlay in Scene 4 */}
        {activeIdx === 3 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[38%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <span className="w-24 h-24 rounded-full border-2 border-[#FFD166]/60 animate-pulse-ring" />
            <span
              className="absolute w-36 h-36 rounded-full border border-[#4EA8DE]/50 animate-pulse-ring"
              style={{ animationDelay: '0.7s' }}
            />
          </div>
        )}

        {/* Unboxed Game-Style Avatars in Lower Corners (No Text Boxes Over Scene) */}
        <div className="pointer-events-none absolute bottom-1.5 left-3 right-3 flex items-end justify-between">
          <TataCutoutCharacter
            talking={isPlaying}
            className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-300 ${
              isPlaying ? 'animate-tata-talk' : 'animate-tata-idle'
            }`}
            label="Tata narrando"
          />

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#081523]/85 border-2 border-[#52B788] p-0.5 shadow-xl mb-1">
            <AymaraAvatar
              circular
              config={playerAvatar}
              className="w-full h-full"
              label={`Avatar de ${playerName.trim() || 'Viajero'}`}
            />
          </div>
        </div>
      </div>

      {/* Synchronized Narration Text Cleanly Below the Video Viewport */}
      <div className="bg-[#050E17] border-t border-white/10 px-4 py-3 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#D9A05B]">
          <span>Tata · {current.avatarBadge}</span>
          {current.highlightTag && (
            <span className="sm:hidden text-[#7DD3FC]">{current.highlightTag}</span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#FFF8E7] leading-relaxed">
          “{current.narration}”
        </p>
      </div>

      {/* Chapter Quick Jump Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 px-3 py-2 bg-[#0B1D2E] border-t border-white/10">
        {SLIDES.map((s, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToScene(idx)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold truncate cursor-pointer transition-colors border ${
                isActive
                  ? 'bg-[#1D4E89] border-[#F5B700] text-[#FFF8E7]'
                  : 'bg-[#081523] border-white/10 text-[#9FB3C8] hover:text-white'
              }`}
            >
              {s.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Video Transport Controls */}
      <div className="px-4 py-2.5 bg-[#0E2235] flex items-center gap-3 border-t border-white/10">
        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 rounded-lg bg-[#1D4E89] hover:bg-[#2563EB] text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(progress)}
          onChange={(e) => {
            const val = Number(e.target.value);
            lastSpokenSceneRef.current = -1;
            setProgress(val);
            if (val >= 50 && !watchedNotifiedRef.current) {
              watchedNotifiedRef.current = true;
              onWatchedEnough();
            }
          }}
          aria-label="Línea de tiempo del video educativo"
          className="flex-1 accent-[#F5B700] cursor-pointer h-2"
        />

        <span className="text-xs font-mono-num text-[#D8D3C8] w-11 text-right shrink-0">
          {Math.round(progress)}%
        </span>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            lastSpokenSceneRef.current = -1;
            setProgress(0);
            setIsPlaying(true);
          }}
          className="w-9 h-9 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-[#E2DDD2] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label="Reiniciar video"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
