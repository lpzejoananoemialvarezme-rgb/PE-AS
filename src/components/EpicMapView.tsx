import React, { useState } from 'react';
import {
  Award,
  Lock,
  Trophy,
  RotateCcw,
  UserCog,
  ChevronRight,
  Play,
  CheckCircle2
} from 'lucide-react';
import { ASSETS, DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import { ACHIEVEMENTS } from '../data/achievements';
import { ChallengeType, GameTexts, PlayerProgress, StageData } from '../types/game';
import { RelicIcon, ChakanaLogoSvg } from './RelicIcon';
import { NarratorDock } from './NarratorDock';
import { AymaraAvatar } from './AymaraAvatar';
import { AudioControl } from './AudioControl';
import { soundEngine } from '../utils/sound';

interface EpicMapViewProps {
  stages: StageData[];
  progress: PlayerProgress;
  gameTexts?: GameTexts;
  onSelectStage: (stageId: number) => void;
  onOpenAvatarCreator: () => void;
  onOpenProfile: () => void;
  onOpenVictory: () => void;
  onBackToTitle: () => void;
}

const CHALLENGE_LABEL: Record<ChallengeType, string> = {
  multiple_choice: 'Pregunta cultural',
  video_quiz: 'Video interactivo',
  riddle: 'Acertijo',
  puzzle: 'Rompecabezas 3×3',
  climbing_game: 'Escalada en roca',
  memory_game: 'Piedras de memoria',
  pizza_craft: 'Horno artesanal',
  totora_basket: 'Canasta y trueque',
  mirador_3d: 'Mirador 360°',
  katari_phrase: 'Frase de Katari',
  plato_paceno_catch: 'Plato Paceño',
  magic_brush: 'Pincel mágico',
  rupestre_snake: 'Arte rupestre',
  apacheta_stack: 'Apilar 5 piedras',
  calvario_crosses: 'Buscar 4 cruces'
};

export const EpicMapView: React.FC<EpicMapViewProps> = ({
  stages,
  progress,
  gameTexts = DEFAULT_GAME_TEXTS,
  onSelectStage,
  onOpenAvatarCreator,
  onOpenProfile,
  onOpenVictory,
  onBackToTitle
}) => {
  const [mapError, setMapError] = useState(false);
  const [hoveredStageId, setHoveredStageId] = useState<number | null>(null);
  const unlockedMedalsCount = (progress.unlockedAchievements || []).length;

  const completedCount = progress.completedStages.length;
  const allCompleted = completedCount >= stages.length;
  const sortedStages = [...stages].sort((a, b) => a.id - b.id);

  const currentStageObj =
    sortedStages.find((s) => s.id === progress.unlockedStage) || sortedStages[sortedStages.length - 1];

  const activeStage =
    sortedStages.find((s) => s.id === hoveredStageId) || currentStageObj;

  const narratorLine = allCompleted
    ? gameTexts.mapScreen.narratorAllCompleted
    : hoveredStageId
      ? `Etapa ${activeStage.id}: ${activeStage.title} — ${
          activeStage.id <= progress.unlockedStage
            ? 'Toca para explorar este hito de Peñas.'
            : 'Completa la etapa anterior para desbloquear este camino.'
        }`
      : `Avanza hacia la Etapa ${progress.unlockedStage}: ${activeStage.title}. ${gameTexts.mapScreen.narratorDefaultHint}`;

  return (
    <>
      {/* ============================================================
          MOBILE EXPERIENCE (< md): Ergonomic Trail + Scenic Mini-Map
          ============================================================ */}
      <div className="flex md:hidden flex-col min-h-screen min-h-[100dvh] w-full bg-[#081523] pb-20">
        {/* Natural-scroll Compact Mobile Top Bar */}
        <header className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#0B1D2E] border-b border-[#D9A05B]/25">
          <button
            type="button"
            onClick={onBackToTitle}
            className="flex items-center gap-2 min-w-0 cursor-pointer"
            title="Volver a la portada"
          >
            <ChakanaLogoSvg className="w-8 h-8 shrink-0" />
            <div className="text-left min-w-0">
              <div className="font-display text-sm font-bold text-[#FFF8E7] leading-tight truncate">
                {gameTexts.mapScreen.brandTitle}
              </div>
              <div className="text-[11px] text-[#D9A05B] font-mono-num">
                {completedCount}/7 Reliquias
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenProfile();
              }}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[#112436] border border-[#F5B700]/45 text-[#FFF8E7] text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Ver perfil y medallas"
            >
              <Award className="w-3.5 h-3.5 text-[#F5B700]" />
              <span className="font-mono-num">
                {unlockedMedalsCount}/{ACHIEVEMENTS.length}
              </span>
            </button>

            <AudioControl compact />
          </div>
        </header>

        {/* Full 16:9 Panoramic Map Overview (No Edge Clipping) */}
        <div className="relative w-full aspect-[16/9] bg-[#0B1D2E] overflow-hidden border-b border-[#D9A05B]/30 shrink-0">
          {!mapError ? (
            <img
              src={ASSETS.EPIC_MAP}
              alt="Mapa panorámico del pueblo de Peñas, La Paz"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setMapError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0F2C4C] via-[#1E4D3B] to-[#6B4423]" />
          )}

          {/* Trail SVG */}
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {sortedStages.slice(0, -1).map((stage, idx) => {
              const next = sortedStages[idx + 1];
              const x1 = stage.mapPosition.x * 10;
              const y1 = stage.mapPosition.y * 10;
              const x2 = next.mapPosition.x * 10;
              const y2 = next.mapPosition.y * 10;
              const cx = (x1 + x2) / 2;
              const cy = (y1 + y2) / 2 - 40;
              const segmentDone = progress.completedStages.includes(stage.id);
              const segmentUnlocked = next.id <= progress.unlockedStage;

              return (
                <path
                  key={`m-${stage.id}-${next.id}`}
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  fill="none"
                  stroke={segmentDone ? '#F5B700' : segmentUnlocked ? '#52B788' : '#CBD5E1'}
                  strokeOpacity={segmentDone ? 0.95 : segmentUnlocked ? 0.8 : 0.45}
                  strokeWidth={segmentDone ? 9 : 6}
                  strokeDasharray={segmentDone ? 'none' : '14 12'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Mini Landmarks on Panoramic Map */}
          {sortedStages.map((stage) => {
            const isCompleted = progress.completedStages.includes(stage.id);
            const isCurrent = stage.id === progress.unlockedStage && !isCompleted;
            const isUnlocked = stage.id <= progress.unlockedStage;
            const isAvatarHere =
              (allCompleted && stage.id === stages.length) ||
              (!allCompleted && stage.id === progress.unlockedStage);

            return (
              <div
                key={`mpin-${stage.id}`}
                style={{ left: `${stage.mapPosition.x}%`, top: `${stage.mapPosition.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                {isAvatarHere && (
                  <div className="mb-1 w-8 h-8 rounded-full bg-[#081523] border-2 border-[#F5B700] shadow-lg flex items-center justify-center overflow-hidden">
                    <AymaraAvatar
                      circular
                      config={progress.avatar}
                      className="w-7 h-7"
                      label={`Ubicación actual de ${progress.playerName || 'tu avatar'}`}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isUnlocked) {
                      soundEngine.playClick();
                      onSelectStage(stage.id);
                    }
                  }}
                  aria-label={`Etapa ${stage.id}: ${stage.title}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform ${
                    isCompleted
                      ? 'bg-[#D99B26] border-2 border-[#FFF8E7] text-[#1A1207]'
                      : isCurrent
                        ? 'bg-[#F5B700] border-2 border-[#FFF8E7] text-[#1A1207] scale-110 ring-4 ring-[#F5B700]/40'
                        : isUnlocked
                          ? 'bg-[#2D6A4F] border border-[#FFF8E7] text-white'
                          : 'bg-[#081523]/85 border border-white/30 text-[#94A3B8]'
                  }`}
                >
                  {isCompleted ? (
                    <RelicIcon icon={stage.relicIcon} unlocked className="w-4 h-4" />
                  ) : isUnlocked ? (
                    stage.id
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Content Area: Narrator + Thumb-Friendly Stage List */}
        <div className="px-3.5 py-3.5 space-y-3.5">
          {/* Shiny Relic Strip */}
          <div className="flex items-center justify-between gap-1.5 bg-[#0D2134] border border-[#D9A05B]/30 rounded-xl px-3 py-2">
            <span className="text-[11px] font-semibold text-[#D9A05B] shrink-0">Reliquias:</span>
            <div className="flex items-center gap-1.5">
              {sortedStages.map((stage) => {
                const isDone = progress.completedStages.includes(stage.id);
                return (
                  <div
                    key={`mrel-${stage.id}`}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isDone
                        ? 'bg-gradient-to-br from-[#8C5A2B] to-[#D99B26] border border-[#FFD166]'
                        : 'bg-[#081523] border border-white/10 opacity-45'
                    }`}
                  >
                    <RelicIcon icon={stage.relicIcon} unlocked={isDone} className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
          </div>

          <NarratorDock
            compact
            playerAvatar={progress.avatar}
            playerName={progress.playerName}
            speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
            message={narratorLine}
          />

          {/* 7-Stage Vertical Adventure Trail */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold tracking-wide text-[#D9A05B] px-1">
              {gameTexts.mapScreen.trailTitle}
            </h2>

            {sortedStages.map((stage) => {
              const isCompleted = progress.completedStages.includes(stage.id);
              const isCurrent = stage.id === progress.unlockedStage && !isCompleted;
              const isUnlocked = stage.id <= progress.unlockedStage;

              return (
                <button
                  key={`mrow-${stage.id}`}
                  type="button"
                  onClick={() => {
                    if (isUnlocked) {
                      soundEngine.playClick();
                      onSelectStage(stage.id);
                    } else {
                      soundEngine.playWrong();
                    }
                  }}
                  className={`w-full min-h-[68px] text-left rounded-2xl border p-3 flex items-center gap-3 transition-transform active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-[#13314E] border-2 border-[#F5B700] shadow-lg'
                      : isCompleted
                        ? 'bg-[#122D25] border-[#52B788]/55'
                        : isUnlocked
                          ? 'bg-[#0D2134] border-[#4EA8DE]/45'
                          : 'bg-[#0B1B2A]/70 border-white/10 opacity-65'
                  }`}
                >
                  {/* Left Relic / Stage Icon */}
                  <div
                    className={`relative overflow-hidden w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#8C5A2B] via-[#D99B26] to-[#2D6A4F] border border-[#FFD166]'
                        : isCurrent
                          ? 'bg-[#F5B700] text-[#1A1207]'
                          : isUnlocked
                            ? 'bg-[#1E4D3B] text-[#FFF8E7]'
                            : 'bg-[#081523] text-[#64748B]'
                    }`}
                  >
                    {isCompleted ? (
                      <RelicIcon icon={stage.relicIcon} unlocked className="w-6 h-6" />
                    ) : isUnlocked ? (
                      <span className="font-display text-lg font-bold">{stage.id}</span>
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Middle Info */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium text-[#D9A05B] truncate">
                      Etapa 0{stage.id} · {CHALLENGE_LABEL[stage.type]}
                    </div>
                    <div className="text-sm font-bold text-[#FFF8E7] truncate">{stage.title}</div>
                    <div className="text-xs text-[#A3B1BF] truncate">
                      {isCompleted
                        ? `Reliquia: ${stage.relicName}`
                        : isCurrent
                          ? 'Toca para jugar ahora'
                          : 'Bloqueada'}
                    </div>
                  </div>

                  {/* Right Status / Avatar Indicator */}
                  <div className="shrink-0 flex items-center">
                    {isCurrent ? (
                      <div className="w-11 h-11 rounded-full bg-[#081523] border-2 border-[#F5B700] p-0.5 flex items-center justify-center shadow">
                        <AymaraAvatar circular config={progress.avatar} className="w-full h-full" />
                      </div>
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#52B788]" />
                    ) : isUnlocked ? (
                      <ChevronRight className="w-5 h-5 text-[#4EA8DE]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Thumb Action Bar (Single Fixed Element < 9% Viewport Height) */}
        <nav
          aria-label="Acciones rápidas del viajero"
          className="fixed bottom-0 inset-x-0 z-30 h-16 px-3 bg-[#081523]/95 backdrop-blur-md border-t border-[#D9A05B]/35 flex items-center gap-2"
        >
          {allCompleted ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenVictory();
              }}
              className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#F5B700] text-[#1A1207] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Trophy className="w-4 h-4" />
              <span className="truncate">Ver Premio Final</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSelectStage(currentStageObj.id);
              }}
              className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#F5B700] text-[#1A1207] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">Jugar Etapa {currentStageObj.id}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenProfile();
            }}
            className="min-h-[44px] px-2.5 rounded-xl bg-[#112436] border border-[#F5B700]/45 text-[#FFF8E7] text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Perfil y medallas"
          >
            <Award className="w-4 h-4 text-[#F5B700]" />
            <span>Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenAvatarCreator();
            }}
            className="min-h-[44px] px-2.5 rounded-xl bg-[#112436] border border-[#D9A05B]/40 text-[#FFF8E7] text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <AymaraAvatar config={progress.avatar} className="w-6 h-6" />
            <span>Avatar</span>
          </button>
        </nav>
      </div>

      {/* ============================================================
          DESKTOP EXPERIENCE (md+): Full-Viewport Epic Interactive Map
          ============================================================ */}
      <div className="hidden md:flex relative h-screen w-screen overflow-hidden bg-[#081523] select-none flex-col">
        {/* Top Unobtrusive HUD Overlay */}
        <header className="pointer-events-none relative z-20 px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Game Brand + Progress */}
          <div className="pointer-events-auto flex items-center gap-3 bg-[#081523]/90 border border-[#D9A05B]/35 rounded-xl px-3.5 py-2 shadow-lg">
            <button
              type="button"
              onClick={onBackToTitle}
              className="flex items-center gap-2 text-left cursor-pointer group"
              title="Volver a la portada"
            >
              <ChakanaLogoSvg className="w-7 h-7 shrink-0 transition-transform group-hover:scale-105" />
              <div>
                <div className="font-display text-base font-bold text-[#FFF8E7] leading-tight whitespace-nowrap">
                  {gameTexts.mapScreen.brandTitle}
                </div>
                <div className="text-[11px] text-[#D9A05B] font-mono-num whitespace-nowrap">
                  {completedCount}/7 Reliquias
                </div>
              </div>
            </button>
          </div>

          {/* Center: Shiny 7-Relic Progression Bar */}
          <div className="pointer-events-auto hidden lg:flex items-center gap-2 bg-[#081523]/90 border border-[#D9A05B]/35 rounded-xl px-4 py-2 shadow-lg">
            {sortedStages.map((stage) => {
              const isDone = progress.completedStages.includes(stage.id);
              const isUnlocked = stage.id <= progress.unlockedStage;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => isUnlocked && onSelectStage(stage.id)}
                  disabled={!isUnlocked}
                  title={`${stage.id}. ${stage.relicName}`}
                  className={`relative overflow-hidden w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-150 ${
                    isDone
                      ? 'bg-gradient-to-br from-[#6B4423] via-[#D99B26] to-[#2D6A4F] border border-[#FFD166] shadow-[0_0_12px_rgba(245,183,0,0.45)] hover:scale-105 cursor-pointer'
                      : isUnlocked
                        ? 'bg-[#17334E] border border-[#4EA8DE]/60 hover:scale-105 cursor-pointer'
                        : 'bg-[#0E2235] border border-white/10 opacity-45 cursor-not-allowed'
                  }`}
                >
                  {isDone && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-relic-shimmer"
                    />
                  )}
                  <RelicIcon icon={stage.relicIcon} unlocked={isDone} className="w-5 h-5 relative z-10" />
                </button>
              );
            })}
          </div>

          {/* Right: Single-line Utility Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {allCompleted && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenVictory();
                }}
                className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-relic-shimmer"
                />
                <Trophy className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Reclamar Premio</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenProfile();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081523]/90 hover:bg-[#17334E] text-[#FFF8E7] border border-[#F5B700]/45 text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              title="Ver perfil y medallas"
            >
              <Award className="w-4 h-4 text-[#F5B700]" />
              <span>Perfil · {unlockedMedalsCount}/{ACHIEVEMENTS.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenAvatarCreator();
              }}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#081523]/90 hover:bg-[#17334E] text-[#E2DDD2] border border-[#D9A05B]/45 text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              title="Personalizar tu avatar aymara"
            >
              <AymaraAvatar config={progress.avatar} className="w-7 h-7 rounded-md shrink-0" />
              <span>Mi Avatar</span>
              <UserCog className="w-3.5 h-3.5 text-[#F5B700] hidden" />
            </button>

            <AudioControl compact />

            <button
              type="button"
              onClick={onBackToTitle}
              aria-label="Volver al inicio"
              title="Volver a portada"
              className="w-10 h-10 rounded-xl bg-[#081523]/90 hover:bg-[#17334E] text-[#E2DDD2] border border-[#D9A05B]/35 flex items-center justify-center shrink-0 cursor-pointer transition-colors lg:hidden"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Interactive Map Playfield */}
        <main className="relative flex-1 w-full overflow-hidden">
          <div className="relative w-full h-full">
            {!mapError ? (
              <img
                src={ASSETS.EPIC_MAP}
                alt="Mapa ilustrado de las 7 etapas del pueblo de Peñas, La Paz"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setMapError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0F2C4C] via-[#1E4D3B] to-[#6B4423]" />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#081523]/45 via-transparent to-[#081523]/70" />

            <svg
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {sortedStages.slice(0, -1).map((stage, idx) => {
                const next = sortedStages[idx + 1];
                const x1 = stage.mapPosition.x * 10;
                const y1 = stage.mapPosition.y * 10;
                const x2 = next.mapPosition.x * 10;
                const y2 = next.mapPosition.y * 10;
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2 - 40;
                const segmentUnlocked = next.id <= progress.unlockedStage;
                const segmentDone = progress.completedStages.includes(stage.id);

                return (
                  <path
                    key={`${stage.id}-${next.id}`}
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    fill="none"
                    stroke={segmentDone ? '#F5B700' : segmentUnlocked ? '#52B788' : '#CBD5E1'}
                    strokeOpacity={segmentDone ? 0.92 : segmentUnlocked ? 0.75 : 0.38}
                    strokeWidth={segmentDone ? 6 : 4}
                    strokeDasharray={segmentDone ? 'none' : '12 10'}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {sortedStages.map((stage) => {
              const isCompleted = progress.completedStages.includes(stage.id);
              const isCurrent = stage.id === progress.unlockedStage && !isCompleted;
              const isUnlocked = stage.id <= progress.unlockedStage;
              const isAvatarHere =
                (allCompleted && stage.id === stages.length) ||
                (!allCompleted && stage.id === progress.unlockedStage);

              return (
                <div
                  key={stage.id}
                  style={{ left: `${stage.mapPosition.x}%`, top: `${stage.mapPosition.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                >
                  {isAvatarHere && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        onOpenAvatarCreator();
                      }}
                      title={`${progress.playerName.trim() || 'Viajero'} — clic para personalizar tu avatar`}
                      className="mb-1.5 group relative w-14 h-14 rounded-full p-0.5 bg-[#081523]/95 border-2 border-[#F5B700] shadow-[0_6px_18px_rgba(0,0,0,0.65)] hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                    >
                      <AymaraAvatar
                        circular
                        config={progress.avatar}
                        className="w-full h-full"
                        label={`Ubicación actual de ${progress.playerName || 'tu avatar'}`}
                      />
                    </button>
                  )}

                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-5 w-16 h-16 rounded-full border-2 border-[#F5B700] animate-pulse-ring"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isUnlocked) {
                        soundEngine.playClick();
                        onSelectStage(stage.id);
                      } else {
                        soundEngine.playWrong();
                      }
                    }}
                    onMouseEnter={() => setHoveredStageId(stage.id)}
                    onMouseLeave={() => setHoveredStageId(null)}
                    onFocus={() => setHoveredStageId(stage.id)}
                    aria-label={`Etapa ${stage.id}: ${stage.title}${isCompleted ? ' (Completada)' : isUnlocked ? ' (Disponible)' : ' (Bloqueada)'}`}
                    className={`relative overflow-hidden w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#FFF8E7] shadow-xl ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#8C5A2B] via-[#D99B26] to-[#2D6A4F] border-2 border-[#FFD166] hover:scale-110 cursor-pointer'
                        : isCurrent
                          ? 'bg-[#1D4E89] border-2 border-[#F5B700] hover:scale-110 cursor-pointer'
                          : isUnlocked
                            ? 'bg-[#1E4D3B] border-2 border-[#52B788] hover:scale-105 cursor-pointer'
                            : 'bg-[#0B1D2E]/85 border border-white/25 opacity-75 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-relic-shimmer"
                      />
                    )}

                    {isCompleted ? (
                      <RelicIcon icon={stage.relicIcon} unlocked className="w-7 h-7 relative z-10" />
                    ) : isUnlocked ? (
                      <span className="font-display text-xl font-bold text-[#FFF8E7]">{stage.id}</span>
                    ) : (
                      <Lock className="w-5 h-5 text-[#94A3B8]" />
                    )}
                  </button>

                  <div
                    className={`mt-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap shadow-md pointer-events-none ${
                      isCompleted
                        ? 'bg-[#081523]/90 text-[#FFD166] border border-[#F5B700]/45'
                        : isCurrent
                          ? 'bg-[#F5B700] text-[#1A1207]'
                          : isUnlocked
                            ? 'bg-[#081523]/90 text-[#FFF8E7] border border-[#52B788]/45'
                            : 'bg-[#081523]/80 text-[#94A3B8] border border-white/10'
                    }`}
                  >
                    {stage.id}. {stage.title}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Bottom Narrator Strip */}
        <div className="pointer-events-none relative z-20 px-6 pb-3 pt-1 flex items-end justify-between gap-3">
          <div className="pointer-events-auto max-w-2xl">
            <NarratorDock
              compact
              playerAvatar={progress.avatar}
              playerName={progress.playerName}
              speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
              message={narratorLine}
            />
          </div>
        </div>
      </div>
    </>
  );
};
