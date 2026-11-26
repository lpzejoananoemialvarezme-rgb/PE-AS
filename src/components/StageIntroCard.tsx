import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, HelpCircle, Mountain, RotateCcw, Square, Volume2 } from 'lucide-react';
import { DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import { GameTexts, StageData } from '../types/game';
import { TataCutoutCharacter } from './TataCutoutCharacter';
import { DidYouKnowIcon } from './DidYouKnowIcon';
import { soundEngine } from '../utils/sound';
import { tataVoice } from '../utils/tataVoice';

interface StageIntroCardProps {
  stage: StageData;
  texts?: GameTexts['stageModal'];
  triviaPassed?: boolean;
  onProceedToTrivia: () => void;
}

/**
 * Splits Tata's intro narrative into crisp individual phrases without breaking
 * common altitude/abbreviated expressions like "m s. n. m.".
 */
function splitNarratorPhrases(text: string): string[] {
  const safeToken = '___MSNM___';
  const dotToken = '___NUMDOT___';
  const normalized = text
    .trim()
    .replace(/m\s+s\.\s*n\.\s*m\./gi, (match) => match.replace(/\./g, safeToken))
    .replace(/(\d)\.(\d)/g, `$1${dotToken}$2`);

  const rawParts =
    normalized.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [normalized];

  const phrases = rawParts
    .map((p) =>
      p
        .replace(new RegExp(safeToken, 'g'), '.')
        .replace(new RegExp(dotToken, 'g'), '.')
        .trim()
    )
    .filter(Boolean);

  return phrases.length > 0 ? phrases : [text];
}

export const StageIntroCard: React.FC<StageIntroCardProps> = ({
  stage,
  texts = DEFAULT_GAME_TEXTS.stageModal,
  triviaPassed = false,
  onProceedToTrivia
}) => {
  const [sceneError, setSceneError] = useState(false);
  const [galleryErrors, setGalleryErrors] = useState<Record<number, boolean>>({});
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [bubbleClosed, setBubbleClosed] = useState(false);
  const [isTalkingPulse, setIsTalkingPulse] = useState(true);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [openBulletIndex, setOpenBulletIndex] = useState<number | null>(null);
  const [readBullets, setReadBullets] = useState<number[]>([]);
  const didYouKnowSectionRef = useRef<HTMLDivElement>(null);
  const voiceSupported = tataVoice.isSupported();

  const phrases = useMemo(() => splitNarratorPhrases(stage.narratorIntro), [stage.narratorIntro]);

  useEffect(() => {
    const unsub = tataVoice.subscribe((speaking) => {
      setIsVoicePlaying(speaking);
    });
    return () => {
      unsub();
      tataVoice.stop();
    };
  }, []);

  useEffect(() => {
    setPhraseIndex(0);
    setBubbleClosed(false);
    setIsTalkingPulse(true);
    setSceneError(false);
    setOpenBulletIndex(null);
    setReadBullets([]);
    if (voiceSupported && !soundEngine.isMuted()) {
      tataVoice.speak(stage.narratorIntro);
    }
    return () => {
      tataVoice.stop();
    };
  }, [stage.id, stage.narratorIntro, voiceSupported]);

  useEffect(() => {
    if (bubbleClosed) {
      setIsTalkingPulse(false);
      return;
    }
    setIsTalkingPulse(true);
    const t = window.setTimeout(() => setIsTalkingPulse(false), 2600);
    return () => window.clearTimeout(t);
  }, [phraseIndex, bubbleClosed, stage.id]);

  const bullets =
    stage.didYouKnowBullets && stage.didYouKnowBullets.length > 0
      ? stage.didYouKnowBullets
      : [{ title: 'Dato histórico', detail: stage.educationalCapsule }];

  const allBulletsRead = triviaPassed || bullets.every((_, idx) => readBullets.includes(idx));

  const handleNextPhraseOrClose = () => {
    soundEngine.playClick();
    if (phraseIndex + 1 < phrases.length) {
      setPhraseIndex((idx) => idx + 1);
    } else {
      setBubbleClosed(true);
      window.setTimeout(() => {
        didYouKnowSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 120);
    }
  };

  const handleReplayBubble = () => {
    soundEngine.playClick();
    setPhraseIndex(0);
    setBubbleClosed(false);
    if (voiceSupported) {
      tataVoice.speak(stage.narratorIntro, { forceUnmute: true });
    }
  };

  const handleToggleTataVoice = () => {
    soundEngine.playClick();
    if (isVoicePlaying) {
      tataVoice.stop();
    } else {
      tataVoice.speak(stage.narratorIntro, { forceUnmute: true });
    }
  };

  const handleToggleBullet = (idx: number) => {
    soundEngine.playClick();
    setOpenBulletIndex((prev) => {
      const next = prev === idx ? null : idx;
      if (next !== null) {
        setReadBullets((r) => (r.includes(next) ? r : [...r, next]));
      }
      return next;
    });
  };

  const activeBullet = openBulletIndex !== null ? bullets[openBulletIndex] : null;
  const currentPhrase = phrases[phraseIndex] || stage.narratorIntro;

  return (
    <section
      aria-label={`Ficha de introducción de ${stage.title}`}
      className="relative w-full select-none"
    >
      {/* Top Chiseled Andean Granite Ridge Silhouette */}
      <svg
        viewBox="0 0 800 34"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-6 sm:h-8 -mb-px"
      >
        <polygon
          points="0,34 18,16 62,22 118,8 190,15 268,4 352,14 438,3 526,16 614,7 694,18 756,9 800,26 800,34"
          fill="#3E3B37"
        />
        <polyline
          points="0,34 18,16 62,22 118,8 190,15 268,4 352,14 438,3 526,16 614,7 694,18 756,9 800,26"
          fill="none"
          stroke="#8C8376"
          strokeWidth="2.5"
        />
        <polygon points="118,8 148,12 132,16 105,13" fill="#7C8E4E" opacity="0.55" />
        <polygon points="438,3 466,8 446,12 422,9" fill="#C99646" opacity="0.55" />
        <polygon points="614,7 642,12 624,16 600,12" fill="#7C8E4E" opacity="0.5" />
      </svg>

      {/* Main Sculpted Rock Monolith Body */}
      <div className="relative overflow-hidden border-x-[3px] border-[#6A645B] bg-gradient-to-b from-[#3E3B37] via-[#2B2B2E] to-[#1D1E21] shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
        {/* Subtle Chiseled Stone Fissures */}
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
        >
          <path d="M 16 70 L 42 125 L 24 195" fill="none" stroke="#8C8376" strokeWidth="1.5" />
          <path d="M 786 95 L 758 160 L 774 235" fill="none" stroke="#121316" strokeWidth="2" />
          <path d="M 28 360 L 58 415 L 40 465" fill="none" stroke="#121316" strokeWidth="2" />
          <path d="M 768 340 L 742 395 L 762 455" fill="none" stroke="#8C8376" strokeWidth="1.5" />
          <polygon points="0,190 14,210 0,245" fill="#524E48" />
          <polygon points="800,165 786,188 800,220" fill="#524E48" />
        </svg>

        {/* Inner Carved Rock Content Frame */}
        <div className="relative z-10 p-3.5 sm:p-5 space-y-4">
          {/* 1. Stage Scenic Backdrop with Cutout Tata Standing Directly Inside & Phrase-by-Phrase Speech Bubble */}
          <figure className="relative overflow-hidden rounded-2xl border-2 border-[#6A645B]/85 bg-[#141619] min-h-[270px] sm:min-h-[325px] shadow-2xl flex flex-col justify-between">
            {stage.sceneImageUrl && !sceneError ? (
              <img
                src={stage.sceneImageUrl}
                alt={stage.title}
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setSceneError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns will-change-transform"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A3530] via-[#1E4D3B] to-[#0F2C4C] flex flex-col items-center justify-center gap-2 p-4 text-center">
                <Mountain className="w-9 h-9 text-[#F5B700]" />
                <span className="text-sm font-bold text-[#FFF8E7]">{stage.title}</span>
              </div>
            )}

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1/2 left-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent animate-sun-sweep"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121315]/90 via-[#121315]/15 to-[#121315]/55"
            />

            {/* Top Voice & Replay Controls */}
            <div className="relative z-10 px-4 pt-3 flex flex-wrap items-center justify-end gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={handleToggleTataVoice}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg border text-xs sm:text-sm font-bold cursor-pointer shadow transition-colors ${
                      isVoicePlaying
                        ? 'bg-[#F5B700] border-[#FFE082] text-[#1A1207]'
                        : 'bg-[#081523]/85 hover:bg-[#17334E] border-[#F5B700]/55 text-[#FFD166]'
                    }`}
                  >
                    {isVoicePlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Detener voz</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Escuchar a Tata</span>
                      </>
                    )}
                  </button>
                )}

                {bubbleClosed && (
                  <button
                    type="button"
                    onClick={handleReplayBubble}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg bg-[#081523]/85 hover:bg-[#17334E] border border-[#F5B700]/55 text-xs sm:text-sm font-semibold text-[#FFD166] cursor-pointer shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Leer relato de Tata</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Composite Layer: Tata Cutout + Phrase-by-Phrase Speech Bubble */}
            <div className="relative z-10 px-3 sm:px-5 pt-8 pb-2 flex items-end gap-2 sm:gap-4">
              <div
                className={`shrink-0 transition-transform will-change-transform -mb-2 ${
                  isTalkingPulse || isVoicePlaying ? 'animate-tata-talk' : 'animate-tata-idle'
                }`}
              >
                <TataCutoutCharacter
                  talking={(isTalkingPulse && !bubbleClosed) || isVoicePlaying}
                  className="w-24 h-28 min-[380px]:w-28 min-[380px]:h-32 sm:w-36 sm:h-40"
                  label={texts.tataSpeakerTitle}
                />
              </div>

              {!bubbleClosed && (
                <div
                  key={`phrase-${stage.id}-${phraseIndex}`}
                  className="relative mb-2 sm:mb-4 flex-1 max-w-lg rounded-2xl border-2 border-[#D9A05B] bg-[#FFF8E7] text-[#1C1610] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.55)] animate-speech-bubble"
                >
                  <span
                    aria-hidden="true"
                    className="absolute bottom-6 -left-2.5 w-4 h-4 rotate-45 bg-[#FFF8E7] border-l-2 border-b-2 border-[#D9A05B]"
                  />

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#8C3B2B]">
                      {texts.tataSpeakerTitle}
                    </span>
                    <span className="text-xs font-mono-num font-semibold text-[#7B4824]/85 bg-[#D9A05B]/20 px-2 py-0.5 rounded-md">
                      {phraseIndex + 1} / {phrases.length}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-medium leading-relaxed text-[#231914]">
                    “{currentPhrase}”
                  </p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleNextPhraseOrClose}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8C3B2B] hover:bg-[#702D1F] text-[#FFF8E7] text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      {phraseIndex + 1 < phrases.length ? (
                        <>
                          <span>Siguiente</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Entendido</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </figure>

          {/* 2. "¿Sabías que...?" Interactive Icon-Only Triggers (Open 1 by 1; All 3 required before Siguiente) */}
          <div ref={didYouKnowSectionRef} className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#FFD166]">
                <HelpCircle className="w-5 h-5 text-[#F5B700] shrink-0" />
                <span>{texts.capsuleHeading}</span>
              </div>
              <span className="text-xs font-mono-num font-semibold text-[#74C69D]">
                {Math.min(readBullets.length, bullets.length)}/{bullets.length} leídas
              </span>
            </div>

            {/* Row of Icon + Title Buttons Only (No Preview Text) */}
            <div
              className={`grid gap-2.5 ${
                bullets.length === 1
                  ? 'grid-cols-1'
                  : bullets.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              }`}
            >
              {bullets.map((b, i) => {
                const isOpen = openBulletIndex === i;
                const isRead = readBullets.includes(i);
                return (
                  <button
                    key={`${stage.id}-dyk-btn-${i}`}
                    type="button"
                    onClick={() => handleToggleBullet(i)}
                    aria-expanded={isOpen}
                    className={`group relative rounded-xl border-2 p-3 flex flex-col items-center justify-center text-center gap-2 min-h-[104px] cursor-pointer transition-all active:scale-[0.97] shadow-md ${
                      isOpen
                        ? 'bg-[#2B2010] border-[#F5B700] shadow-[0_0_20px_rgba(245,183,0,0.28)]'
                        : isRead
                          ? 'bg-[#132922] hover:bg-[#19352B] border-[#52B788]/55'
                          : 'bg-[#17191C]/95 hover:bg-[#22252A] border-[#D9A05B]/45'
                    }`}
                  >
                    {isRead && (
                      <span
                        title="Leído"
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1E4D3B] border border-[#74C69D]/60 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-[#74C69D]" />
                      </span>
                    )}

                    <DidYouKnowIcon stageId={stage.id} cardIndex={i} />

                    <div className="text-xs sm:text-sm font-bold text-[#FFF8E7] line-clamp-2 leading-tight w-full">
                      {b.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Single Active "¿Sabías que...?" Card */}
            {activeBullet && openBulletIndex !== null && (
              <div
                key={`${stage.id}-dyk-open-${openBulletIndex}`}
                className="rounded-2xl border-2 border-[#F5B700]/75 bg-[#12161A] p-4 sm:p-5 space-y-3 shadow-xl animate-toast-reveal"
              >
                <div className="flex items-start gap-3.5">
                  <DidYouKnowIcon stageId={stage.id} cardIndex={openBulletIndex} />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="text-xs font-mono-num font-bold text-[#F5B700]">
                      Ficha {openBulletIndex + 1} de {bullets.length}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#FFF8E7] leading-snug">
                      {activeBullet.title}
                    </h4>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#E6E1D6] leading-relaxed">
                  {activeBullet.detail}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setOpenBulletIndex(null);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#24272C] hover:bg-[#32363D] text-xs sm:text-sm font-semibold text-[#D6D1C7] cursor-pointer"
                  >
                    Cerrar ficha
                  </button>

                  {openBulletIndex + 1 < bullets.length ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = openBulletIndex + 1;
                        soundEngine.playClick();
                        setOpenBulletIndex(nextIdx);
                        setReadBullets((r) => (r.includes(nextIdx) ? r : [...r, nextIdx]));
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      <span>Abrir siguiente ficha</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setOpenBulletIndex(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E4D3B] hover:bg-[#2D6A4F] border border-[#74C69D]/50 text-[#ECFDF5] text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Listo</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Loose Peñas Photos at the End (Clean Images Without Explanatory Captions) */}
          {stage.infoGallery && stage.infoGallery.length > 0 && (
            <div
              className={`grid gap-3 pt-1 ${
                stage.infoGallery.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {stage.infoGallery.map((item, idx) => {
                const hasErr = Boolean(galleryErrors[idx]);
                return (
                  <figure
                    key={`${stage.id}-gal-${idx}`}
                    className="rounded-xl overflow-hidden border border-[#6A645B]/60 bg-[#1B1D20]"
                  >
                    <div className="aspect-[16/9.2] w-full bg-[#131517] overflow-hidden">
                      {!hasErr ? (
                        <img
                          src={item.imageUrl}
                          alt={item.label}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setGalleryErrors((prev) => ({ ...prev, [idx]: true }))
                          }
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#3A3530] via-[#1E4D3B] to-[#0F2C4C] flex items-center justify-center">
                          <Mountain className="w-7 h-7 text-[#F5B700]" />
                        </div>
                      )}
                    </div>
                  </figure>
                );
              })}
            </div>
          )}

          {/* 4. Gated 'Siguiente' Button -> Opens Separate Trivia Screen Once All 3 Cards Are Read */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
            {!allBulletsRead ? (
              <p className="text-xs sm:text-sm text-[#D9A05B] font-medium">
                Abre y lee las {bullets.length} fichas de «¿Sabías que...?» para habilitar el botón Siguiente.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#74C69D] font-medium">
                ¡Excelente! Ya puedes continuar a la trivia.
              </p>
            )}

            <button
              type="button"
              disabled={!allBulletsRead}
              onClick={() => {
                tataVoice.stop();
                soundEngine.playClick();
                onProceedToTrivia();
              }}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 min-h-[48px] rounded-xl font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
                allBulletsRead
                  ? 'bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] cursor-pointer active:scale-[0.98] shadow-lg'
                  : 'bg-[#25282E] text-[#7D8590] border border-white/10 cursor-not-allowed opacity-70'
              }`}
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Granite Base Plinth Silhouette */}
      <svg
        viewBox="0 0 800 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-5 sm:h-6 -mt-px"
      >
        <polygon
          points="0,0 800,0 782,16 690,22 575,14 452,23 320,15 194,22 92,13 18,19"
          fill="#1D1E21"
        />
        <polyline
          points="0,0 18,19 92,13 194,22 320,15 452,23 575,14 690,22 782,16 800,0"
          fill="none"
          stroke="#6A645B"
          strokeWidth="2.5"
        />
      </svg>
    </section>
  );
};
