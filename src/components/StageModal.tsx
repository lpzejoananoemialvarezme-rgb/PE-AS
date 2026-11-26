import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Gamepad2,
  RotateCcw
} from 'lucide-react';
import { AvatarConfig, ChallengeType, GameTexts, StageData, TravelerTrait } from '../types/game';
import { DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import { StageIntroCard } from './StageIntroCard';
import { ChallengeSelectorScreen } from './ChallengeSelectorScreen';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';
import { soundEngine } from '../utils/sound';
import { tataVoice } from '../utils/tataVoice';

const InteractiveVideoPlayer = lazy(() =>
  import('./InteractiveVideoPlayer').then((m) => ({ default: m.InteractiveVideoPlayer }))
);
const PlazaHistoryVideo = lazy(() =>
  import('./PlazaHistoryVideo').then((m) => ({ default: m.PlazaHistoryVideo }))
);
const AguayoPuzzle = lazy(() =>
  import('./AguayoPuzzle').then((m) => ({ default: m.AguayoPuzzle }))
);
const ClimbingMiniGame = lazy(() =>
  import('./ClimbingMiniGame').then((m) => ({ default: m.ClimbingMiniGame }))
);
const MemoryMatchGame = lazy(() =>
  import('./MemoryMatchGame').then((m) => ({ default: m.MemoryMatchGame }))
);
const PizzaCraftMiniGame = lazy(() =>
  import('./PizzaCraftMiniGame').then((m) => ({ default: m.PizzaCraftMiniGame }))
);
const TotoraBasketGame = lazy(() =>
  import('./TotoraBasketGame').then((m) => ({ default: m.TotoraBasketGame }))
);
const Mirador3DView = lazy(() =>
  import('./Mirador3DView').then((m) => ({ default: m.Mirador3DView }))
);
const KatariPhraseGame = lazy(() =>
  import('./KatariPhraseGame').then((m) => ({ default: m.KatariPhraseGame }))
);
const PlatoPacenoGame = lazy(() =>
  import('./PlatoPacenoGame').then((m) => ({ default: m.PlatoPacenoGame }))
);
const MagicBrushGame = lazy(() =>
  import('./MagicBrushGame').then((m) => ({ default: m.MagicBrushGame }))
);
const RupestreSnakeGame = lazy(() =>
  import('./RupestreSnakeGame').then((m) => ({ default: m.RupestreSnakeGame }))
);
const ApachetaStackGame = lazy(() =>
  import('./ApachetaStackGame').then((m) => ({ default: m.ApachetaStackGame }))
);
const CalvarioCrossesGame = lazy(() =>
  import('./CalvarioCrossesGame').then((m) => ({ default: m.CalvarioCrossesGame }))
);
const Relic3DShowcase = lazy(() =>
  import('./Relic3DShowcase').then((m) => ({ default: m.Relic3DShowcase }))
);

function MiniGameFallback() {
  return (
    <div className="w-full min-h-[220px] rounded-2xl border border-[#D9A05B]/30 bg-[#081523]/90 flex flex-col items-center justify-center p-6 text-center gap-3">
      <div className="w-8 h-8 rounded-full border-3 border-[#F5B700]/25 border-t-[#F5B700] animate-spin" />
      <p className="text-xs sm:text-sm text-[#D8D3C8]">Cargando desafío interactivo...</p>
    </div>
  );
}

interface StageModalProps {
  stage: StageData;
  alreadyCompleted: boolean;
  playerAvatar: AvatarConfig;
  playerName: string;
  gameTexts?: GameTexts;
  onClose: () => void;
  onCompleteStage: (stageId: number, firstTry: boolean, selectedTrait: TravelerTrait) => void;
}

type StagePhase =
  | 'CONTEXT'
  | 'TRIVIA'
  | 'CHALLENGE_SELECT'
  | 'CHALLENGE'
  | 'CHALLENGE_CLEARED'
  | 'TRAVELER_TRAIT'
  | 'RELIC_UNLOCKED';

function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

export const StageModal: React.FC<StageModalProps> = ({
  stage,
  alreadyCompleted,
  playerAvatar,
  playerName,
  gameTexts = DEFAULT_GAME_TEXTS,
  onClose,
  onCompleteStage
}) => {
  const modalTexts = gameTexts.stageModal;
  const [selectedMode, setSelectedMode] = useState<'primary' | 'secondary'>('primary');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [riddleInput, setRiddleInput] = useState('');
  const [revealedHints, setRevealedHints] = useState(0);
  const [videoWatched, setVideoWatched] = useState(alreadyCompleted || Boolean(stage.videoUrl));
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [triviaPassed, setTriviaPassed] = useState(alreadyCompleted);
  const [pickedTriviaIdx, setPickedTriviaIdx] = useState<number | null>(null);
  const [triviaError, setTriviaError] = useState('');
  const [justSolvedTrivia, setJustSolvedTrivia] = useState(false);
  const triviaTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<StagePhase>(alreadyCompleted ? 'RELIC_UNLOCKED' : 'CONTEXT');
  const [chosenTrait, setChosenTrait] = useState<TravelerTrait>('cultural');

  useEffect(() => {
    setSelectedMode('primary');
    setSelectedOption(null);
    setRiddleInput('');
    setRevealedHints(0);
    setFeedbackError('');
    setTriviaPassed(alreadyCompleted);
    setPickedTriviaIdx(null);
    setTriviaError('');
    setJustSolvedTrivia(false);
  }, [stage.id, alreadyCompleted]);

  useEffect(() => {
    return () => {
      tataVoice.stop();
      if (triviaTimerRef.current !== null) {
        window.clearTimeout(triviaTimerRef.current);
      }
    };
  }, []);

  const activeType: ChallengeType =
    selectedMode === 'secondary' && stage.secondaryType ? stage.secondaryType : stage.type;
  const activePrompt =
    selectedMode === 'secondary' && stage.secondaryPrompt
      ? stage.secondaryPrompt
      : stage.questionPrompt;

  const handleWatchedEnough = useCallback(() => {
    setVideoWatched(true);
  }, []);

  const handleProceedToTrivia = () => {
    tataVoice.stop();
    if (triviaPassed) {
      setPhase(stage.secondaryType ? 'CHALLENGE_SELECT' : 'CHALLENGE');
    } else {
      setPickedTriviaIdx(null);
      setTriviaError('');
      setJustSolvedTrivia(false);
      setPhase('TRIVIA');
    }
  };

  const handleAnswerTrivia = (idx: number) => {
    if (justSolvedTrivia) return;
    setPickedTriviaIdx(idx);
    if (idx === stage.triviaCorrectIndex) {
      setTriviaError('');
      setJustSolvedTrivia(true);
      setTriviaPassed(true);
      soundEngine.playRelicUnlock();
      if (triviaTimerRef.current !== null) {
        window.clearTimeout(triviaTimerRef.current);
      }
      triviaTimerRef.current = window.setTimeout(() => {
        triviaTimerRef.current = null;
        setPhase(stage.secondaryType ? 'CHALLENGE_SELECT' : 'CHALLENGE');
      }, 650);
    } else {
      setHadWrongAttempt(true);
      soundEngine.playWrong();
      setTriviaError(
        'Esa respuesta no es correcta. Puedes volver a revisar las fichas «¿Sabías que...?» e intentarlo de nuevo.'
      );
    }
  };

  const handlePickChallengeMode = (mode: 'primary' | 'secondary') => {
    soundEngine.playClick();
    setSelectedMode(mode);
    setSelectedOption(null);
    setFeedbackError('');
    setPhase('CHALLENGE');
  };

  const handleChallengeCleared = useCallback(() => {
    setFeedbackError('');
    soundEngine.playRelicUnlock();
    setPhase('CHALLENGE_CLEARED');
  }, []);

  const handleOptionSubmit = (idx: number) => {
    setSelectedOption(idx);
    if (idx === stage.correctIndex) {
      handleChallengeCleared();
    } else {
      setHadWrongAttempt(true);
      soundEngine.playWrong();
      setFeedbackError(
        'Esa respuesta no coincide con la historia de Peñas. Puedes revisar la Ficha de Contexto e intentarlo de nuevo.'
      );
    }
  };

  const handleRiddleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeAnswer(riddleInput);
    if (!cleaned) {
      setFeedbackError('Escribe una respuesta para descifrar el acertijo.');
      return;
    }
    const validSet = [stage.riddleAnswer, ...stage.riddleAcceptedVariants]
      .map(normalizeAnswer)
      .filter(Boolean);
    const matches = validSet.some((ans) => cleaned === ans || cleaned.includes(ans));
    if (matches) {
      handleChallengeCleared();
    } else {
      setHadWrongAttempt(true);
      soundEngine.playWrong();
      setFeedbackError('Casi, viajero. Puedes usar una pista de Tata si lo necesitas.');
    }
  };

  const handleTraitPick = (trait: TravelerTrait) => {
    soundEngine.playRelicUnlock();
    setChosenTrait(trait);
    setPhase('RELIC_UNLOCKED');
  };

  const handleFinishStage = () => {
    tataVoice.stop();
    soundEngine.playClick();
    if (!alreadyCompleted) {
      onCompleteStage(stage.id, !hadWrongAttempt, chosenTrait);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-[#050E17]/88 flex items-center justify-center p-0 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-modal-title"
    >
      <div className="relative w-full max-w-3xl h-screen h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-y-auto rounded-none sm:rounded-2xl border-0 sm:border sm:border-[#D9A05B]/45 bg-[#0D2134] shadow-2xl">
        {/* Top Stage Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#081523]/95 border-b border-[#D9A05B]/25">
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-[#D9A05B] truncate">
              Etapa 0{stage.id} · {stage.eraOrElevation}
              {phase === 'CONTEXT' && ' · Ficha de Contexto'}
              {phase === 'TRIVIA' && ' · Responder Trivia'}
              {phase === 'CHALLENGE_SELECT' && ' · Elige un Desafío'}
              {phase === 'CHALLENGE' && ' · Desafío'}
              {phase === 'CHALLENGE_CLEARED' && ' · ¡Desafío Superado!'}
              {phase === 'TRAVELER_TRAIT' && ' · Pregunta Personal'}
            </div>
            <h2
              id="stage-modal-title"
              className="font-display text-lg sm:text-2xl font-bold text-[#FFF8E7] truncate"
            >
              {stage.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {alreadyCompleted && phase === 'RELIC_UNLOCKED' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedOption(null);
                  setRiddleInput('');
                  setRevealedHints(0);
                  setFeedbackError('');
                  setTriviaPassed(false);
                  setPhase('CONTEXT');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 min-h-[40px] rounded-xl bg-[#17334E] hover:bg-[#1D4E89] text-[#FFF8E7] text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer border border-[#4EA8DE]/40"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F5B700]" />
                <span>Volver a jugar</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                tataVoice.stop();
                soundEngine.playClick();
                onClose();
              }}
              aria-label="Cerrar etapa"
              className="w-11 h-11 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-[#FFF8E7] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 pb-8">
          {/* ============================================================
              PHASE 0: ROCK-CARVED INTRO CARD (StageIntroCard)
              ============================================================ */}
          {phase === 'CONTEXT' && (
            <StageIntroCard
              stage={stage}
              texts={modalTexts}
              triviaPassed={triviaPassed}
              onProceedToTrivia={handleProceedToTrivia}
            />
          )}

          {/* ============================================================
              PHASE 0.25: SEPARATE TRIVIA GATE SCREEN
              ============================================================ */}
          {phase === 'TRIVIA' && (
            <section className="space-y-4 animate-toast-reveal">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setPhase('CONTEXT');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#112A3E] hover:bg-[#17334E] border border-[#D9A05B]/35 text-xs sm:text-sm font-semibold text-[#FFD166] cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <BookOpen className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>Volver a las fichas ¿Sabías que...?</span>
                </button>
              </div>

              <div className="rounded-2xl border-2 border-[#F5B700]/65 bg-[#0A1826]/95 p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#F5B700]">
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <span>Responder Trivia</span>
                  </div>
                  <p className="text-sm font-medium text-[#74C69D]">
                    Acierta la trivia y accede al desafío de este nivel
                  </p>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7] leading-snug">
                  {stage.triviaPrompt}
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {stage.triviaOptions.map((opt, idx) => {
                    const isPicked = pickedTriviaIdx === idx;
                    const isCorrect = idx === stage.triviaCorrectIndex;
                    const isRightPicked = justSolvedTrivia && isCorrect;
                    const isWrongPicked = isPicked && !isCorrect;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={justSolvedTrivia}
                        onClick={() => handleAnswerTrivia(idx)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm sm:text-base transition-colors flex items-start gap-3 cursor-pointer ${
                          isRightPicked
                            ? 'bg-[#1E4D3B] border-[#74C69D] text-[#ECFDF5]'
                            : isWrongPicked
                              ? 'bg-[#5C2323]/65 border-[#EF4444] text-[#FEE2E2]'
                              : 'bg-[#112436] hover:bg-[#19354F] border-[#D9A05B]/40 text-[#F5F1E8]'
                        }`}
                      >
                        <span className="font-mono-num font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded bg-[#081523] text-[#F5B700] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug flex-1">{opt}</span>
                        {isRightPicked && (
                          <CheckCircle2 className="w-5 h-5 text-[#74C69D] shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {justSolvedTrivia && (
                  <p className="text-sm font-semibold text-[#74C69D] bg-[#132922] border border-[#52B788]/50 rounded-lg px-4 py-2.5">
                    ¡Correcto! Accediendo al desafío de este nivel...
                  </p>
                )}

                {triviaError && (
                  <p className="text-sm font-medium text-[#FCA5A5] bg-[#5C2323]/45 border border-[#EF4444]/40 rounded-lg px-4 py-2.5">
                    {triviaError}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ============================================================
              PHASE 0.5: 2-MINI-GAME VISUAL DECISION SCREEN
              ============================================================ */}
          {phase === 'CHALLENGE_SELECT' && (
            <ChallengeSelectorScreen
              stage={stage}
              onSelectMode={handlePickChallengeMode}
              onBackToContext={() => setPhase('CONTEXT')}
            />
          )}

          {/* ============================================================
              PHASE 1: CHALLENGE (Clean Focused Play + Return to Selector)
              ============================================================ */}
          {phase === 'CHALLENGE' && (
            <section className="space-y-4">
              {/* Compact Context & Challenge Selector Return Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setPhase('CONTEXT');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#112A3E] hover:bg-[#17334E] border border-[#D9A05B]/35 text-xs sm:text-sm font-semibold text-[#FFD166] cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <BookOpen className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>Volver a la Ficha de Tata</span>
                </button>

                {stage.secondaryType && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setPhase('CHALLENGE_SELECT');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#112A3E] hover:bg-[#17334E] border border-[#F5B700]/45 text-xs sm:text-sm font-semibold text-[#F5B700] cursor-pointer transition-colors"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Cambiar de Desafío</span>
                  </button>
                )}
              </div>


              <Suspense fallback={<MiniGameFallback />}>
                {activeType === 'video_quiz' && (
                  <div className="space-y-3">
                    {stage.id === 1 && !stage.videoUrl ? (
                      <PlazaHistoryVideo
                        playerAvatar={playerAvatar}
                        playerName={playerName}
                        onWatchedEnough={handleWatchedEnough}
                      />
                    ) : (
                      <InteractiveVideoPlayer
                        videoUrl={stage.videoUrl}
                        scenes={stage.videoScenes}
                        hotspots={stage.videoHotspots}
                        stageTitle={stage.title}
                        onWatchedEnough={handleWatchedEnough}
                      />
                    )}
                    {!videoWatched && (
                      <p className="text-xs text-[#D9A05B]">
                        {stage.id === 1 && !stage.videoUrl
                          ? 'Mira o recorre el video narrado de la Plaza Principal para habilitar la pregunta.'
                          : 'Toca al menos un punto interactivo del video (o avanza la reproducción) para habilitar la pregunta.'}
                      </p>
                    )}
                  </div>
                )}

                {activeType === 'mirador_3d' && (
                  <Mirador3DView playerAvatar={playerAvatar} playerName={playerName} />
                )}

                {activeType === 'katari_phrase' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <KatariPhraseGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'plato_paceno_catch' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <PlatoPacenoGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'magic_brush' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <MagicBrushGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'rupestre_snake' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <RupestreSnakeGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'apacheta_stack' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <ApachetaStackGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'calvario_crosses' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <CalvarioCrossesGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'puzzle' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <AguayoPuzzle
                      imageUrl={stage.puzzleImageUrl}
                      caption={stage.puzzleCaption}
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'climbing_game' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <ClimbingMiniGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'memory_game' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <MemoryMatchGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'pizza_craft' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <PizzaCraftMiniGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}

                {activeType === 'totora_basket' && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                    <TotoraBasketGame
                      playerAvatar={playerAvatar}
                      playerName={playerName}
                      onSolved={handleChallengeCleared}
                    />
                  </div>
                )}
              </Suspense>

              {(activeType === 'multiple_choice' ||
                activeType === 'video_quiz' ||
                activeType === 'mirador_3d') && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{activePrompt}</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {stage.options.map((opt, idx) => {
                      const isPicked = selectedOption === idx;
                      const isWrong = isPicked && idx !== stage.correctIndex;
                      const disabled = activeType === 'video_quiz' && !videoWatched;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleOptionSubmit(idx)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm sm:text-base transition-colors flex items-start gap-3 ${
                            disabled
                              ? 'bg-[#0B1D2E]/50 border-white/10 text-[#64748B] cursor-not-allowed'
                              : isWrong
                                ? 'bg-[#5C2323]/60 border-[#EF4444] text-[#FEE2E2] cursor-pointer'
                                : 'bg-[#0B1D2E] hover:bg-[#17334E] border-[#4EA8DE]/30 text-[#F5F1E8] cursor-pointer'
                          }`}
                        >
                          <span className="font-mono-num font-bold text-xs sm:text-sm px-2 py-0.5 rounded bg-[#17334E] text-[#F5B700] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeType === 'riddle' && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#081523] border border-[#D9A05B]/45 p-4 space-y-2">
                    <div className="text-sm font-semibold text-[#F5B700]">{activePrompt}</div>
                    <p className="text-base sm:text-lg text-[#FFF8E7] leading-relaxed font-medium">
                      {stage.riddlePrompt}
                    </p>
                  </div>

                  {stage.riddleHints.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-[#A3B1BF]">
                          Pistas reveladas: {revealedHints}/{stage.riddleHints.length}
                        </span>
                        {revealedHints < stage.riddleHints.length && (
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setRevealedHints((h) => h + 1);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5B700] hover:text-[#FFD166] cursor-pointer"
                          >
                            <Lightbulb className="w-4 h-4" />
                            Pedir pista a Tata
                          </button>
                        )}
                      </div>

                      {revealedHints > 0 && (
                        <ul className="space-y-1.5">
                          {stage.riddleHints.slice(0, revealedHints).map((hint, i) => (
                            <li
                              key={i}
                              className="text-sm text-[#D8D3C8] bg-[#112A3E] border border-[#D9A05B]/25 rounded-lg px-3 py-2"
                            >
                              {hint}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleRiddleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={riddleInput}
                      onChange={(e) => setRiddleInput(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      className="flex-1 px-4 py-3 rounded-xl bg-[#081523] border border-[#4EA8DE]/45 text-[#FFF8E7] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                    >
                      Descifrar Acertijo
                    </button>
                  </form>
                </div>
              )}

              {feedbackError && (
                <p className="text-sm font-medium text-[#FCA5A5] bg-[#5C2323]/45 border border-[#EF4444]/40 rounded-lg px-4 py-2.5">
                  {feedbackError}
                </p>
              )}
            </section>
          )}

          {/* ============================================================
              PHASE 1.5: CHALLENGE CLEARED INDICATOR
              ============================================================ */}
          {phase === 'CHALLENGE_CLEARED' && (
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#52B788] bg-gradient-to-br from-[#0F2F25] via-[#0D2134] to-[#261A0E] p-6 sm:p-8 text-center shadow-[0_0_32px_rgba(82,183,136,0.24)] animate-toast-reveal">
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E4D3B] border border-[#74C69D]/60 text-sm font-bold text-[#ECFDF5] shadow">
                  <CheckCircle2 className="w-4 h-4 text-[#74C69D]" />
                  <span>¡Desafío Superado!</span>
                </div>

                <AymaraFullBodyAvatar
                  config={playerAvatar}
                  pose="cheer"
                  className="w-24 h-36 sm:w-28 sm:h-42 drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]"
                  label={`${playerName} celebrando haber superado el desafío`}
                />

                <div className="space-y-1.5 max-w-md">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8E7]">
                    ¡Lo lograste, {playerName || 'Viajero'}!
                  </h3>
                  <p className="text-sm sm:text-base text-[#D8D3C8] leading-relaxed">
                    Superaste con éxito el desafío{' '}
                    <strong className="text-[#FFD166]">
                      «
                      {selectedMode === 'secondary' && stage.secondaryLabel
                        ? stage.secondaryLabel
                        : stage.primaryLabel || stage.title}
                      »
                    </strong>
                    . Antes de recibir tu reliquia, responde una pregunta personal sobre tus gustos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setPhase('TRAVELER_TRAIT');
                  }}
                  className="mt-1 inline-flex items-center justify-center gap-2 px-7 min-h-[50px] rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer transition-transform active:scale-[0.98] shadow-lg"
                >
                  <span>Continuar a la pregunta personal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* ============================================================
              PHASE 2: TRAVELER PERSONALITY REFLECTION
              ============================================================ */}
          {phase === 'TRAVELER_TRAIT' && (
            <section className="rounded-xl bg-[#081523] border border-[#4EA8DE]/45 p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#FFD166]">
                  <CheckCircle2 className="w-4 h-4 text-[#52B788] shrink-0" />
                  <span>{modalTexts.traitSectionBadge}</span>
                </div>
                <p className="rounded-lg bg-[#112A3E]/85 border border-[#4EA8DE]/30 px-3.5 py-2.5 text-sm sm:text-base text-[#BAE6FD] leading-snug">
                  Responde según tus gustos e intereses: depende solo de ti, <strong>no hay respuestas correctas ni incorrectas</strong>.
                </p>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#FFF8E7]">{stage.travelerPrompt}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stage.travelerChoices.map((choice, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTraitPick(choice.trait)}
                    className="text-left p-4 rounded-xl bg-[#112A3E] hover:bg-[#1E4D3B] border border-[#52B788]/35 text-sm sm:text-base text-[#F5F1E8] transition-colors cursor-pointer"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================
              PHASE 3: SHINY 3D RELIC REWARD
              ============================================================ */}
          {phase === 'RELIC_UNLOCKED' && (
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700] bg-gradient-to-br from-[#2B1D0E] via-[#1B3B2B] to-[#0F2C4C] px-5 py-6 sm:p-8 text-center shadow-[0_0_32px_rgba(245,183,0,0.22)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-relic-shimmer"
              />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F5B700]/15 border border-[#F5B700]/50 text-sm font-bold text-[#FFD166]">
                  <Sparkles className="w-4 h-4 text-[#F5B700]" />
                  <span>{modalTexts.relicUnlockedBadge}</span>
                </div>

                <div className="w-full max-w-md mx-auto">
                  <Suspense
                    fallback={
                      <div className="w-full h-[240px] sm:h-[280px] flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-3 border-[#F5B700]/25 border-t-[#F5B700] animate-spin" />
                      </div>
                    }
                  >
                    <Relic3DShowcase icon={stage.relicIcon} />
                  </Suspense>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8E7]">
                  {stage.relicName}
                </h3>

                <button
                  type="button"
                  onClick={handleFinishStage}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-base whitespace-nowrap cursor-pointer transition-transform active:scale-[0.98] shadow-lg"
                >
                  <span>{modalTexts.finishStageButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
