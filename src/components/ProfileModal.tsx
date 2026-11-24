import React, { useEffect, useState } from 'react';
import { Award, Clock, Compass, Instagram, Lock, ShieldCheck, Sparkles, UserCog, X, CheckCircle2 } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import {
  ACHIEVEMENTS,
  formatElapsedTime,
  getAchievementProgressHint
} from '../data/achievements';
import { getDominantTravelerProfile, getPlayerRank } from '../utils/rewards';
import { AymaraAvatar } from './AymaraAvatar';
import { MedalBadge, getTierLabel } from './MedalIcon';
import { GoldenParticlesBurst } from './GoldenParticlesBurst';
import { soundEngine } from '../utils/sound';

interface ProfileModalProps {
  progress: PlayerProgress;
  totalStages: number;
  recentAchievementIds?: string[];
  onEditAvatar: () => void;
  onOpenStoryPostcard: () => void;
  onClose: () => void;
}

type MedalFilter = 'all' | 'unlocked' | 'locked';

export const ProfileModal: React.FC<ProfileModalProps> = ({
  progress,
  totalStages,
  recentAchievementIds = [],
  onEditAvatar,
  onOpenStoryPostcard,
  onClose
}) => {
  const [filter, setFilter] = useState<MedalFilter>('all');
  const [burstMap, setBurstMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    recentAchievementIds.forEach((id) => {
      initial[id] = 1;
    });
    return initial;
  });
  const [elapsedLabel, setElapsedLabel] = useState(() =>
    formatElapsedTime(progress.startedAt, progress.completedAt)
  );

  useEffect(() => {
    if (progress.completedAt || !progress.startedAt) {
      setElapsedLabel(formatElapsedTime(progress.startedAt, progress.completedAt));
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedLabel(formatElapsedTime(progress.startedAt, progress.completedAt));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [progress.startedAt, progress.completedAt]);

  const unlockedSet = new Set(progress.unlockedAchievements || []);
  const recentSet = new Set(recentAchievementIds);
  const unlockedCount = unlockedSet.size;
  const completedCount = progress.completedStages.length;
  const isFinished = completedCount >= totalStages;

  const triggerMedalBurst = (id: string) => {
    soundEngine.playRelicUnlock();
    setBurstMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const triggerAllUnlockedBursts = () => {
    soundEngine.playRelicUnlock();
    setBurstMap((prev) => {
      const next = { ...prev };
      unlockedSet.forEach((id) => {
        next[id] = (next[id] || 0) + 1;
      });
      return next;
    });
  };

  const { rankTitle } = isFinished
    ? getPlayerRank(progress)
    : { rankTitle: 'Viajero en Camino' };
  const profile = getDominantTravelerProfile(progress.traitScores);
  const travelerName = progress.playerName.trim() || 'Viajero de Peñas';

  const filteredMedals = ACHIEVEMENTS.filter((a) => {
    const isUnlocked = unlockedSet.has(a.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050E17]/92 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-4xl h-screen h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-2xl border-0 sm:border sm:border-[#D9A05B]/45 bg-[#0D2134] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#081523] border-b border-white/10">
          <div className="min-w-0">
            <h2 id="profile-modal-title" className="font-display text-base sm:text-xl font-bold text-[#FFF8E7] truncate">
              Perfil del Viajero
            </h2>
            <p className="text-[11px] sm:text-xs text-[#A3B1BF] truncate">
              Tu identidad andina, progreso en Peñas y medallas conquistadas
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Cerrar perfil"
            className="w-11 h-11 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Profile Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Traveler Identity Card */}
          <section className="rounded-2xl bg-[#081523]/90 border border-[#D9A05B]/35 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <AymaraAvatar
                config={progress.avatar}
                className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl"
                label={`Avatar de ${travelerName}`}
              />
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5B700]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">{rankTitle}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8E7] truncate">
                  {travelerName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#A3B1BF]">
                  <span className="inline-flex items-center gap-1 text-[#52B788] font-medium">
                    <Compass className="w-3.5 h-3.5" />
                    {completedCount > 0 ? profile.title : 'Explora etapas para descubrir tu perfil'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onEditAvatar();
                }}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17334E] hover:bg-[#1D4E89] border border-[#D9A05B]/45 text-xs sm:text-sm font-semibold text-[#FFF8E7] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <UserCog className="w-4 h-4 text-[#F5B700]" />
                <span>Personalizar Avatar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenStoryPostcard();
                }}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E4D3B] hover:bg-[#2D6A4F] border border-[#52B788]/50 text-xs sm:text-sm font-semibold text-[#FFF8E7] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FFD166]" />
                <span>Postal para Redes</span>
              </button>
            </div>
          </section>

          {/* Compact Stats Strip */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-[#112A3E] border border-white/10 p-3.5">
              <div className="text-[11px] text-[#A3B1BF]">Etapas superadas</div>
              <div className="font-mono-num text-xl font-bold text-[#FFF8E7] mt-0.5">
                {completedCount}/{totalStages}
              </div>
            </div>
            <div className="rounded-xl bg-[#112A3E] border border-white/10 p-3.5">
              <div className="text-[11px] text-[#A3B1BF]">Al 1er intento</div>
              <div className="font-mono-num text-xl font-bold text-[#52B788] mt-0.5">
                {progress.firstTryWins.length}/{totalStages}
              </div>
            </div>
            <div className="rounded-xl bg-[#112A3E] border border-white/10 p-3.5">
              <div className="text-[11px] text-[#A3B1BF] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#4EA8DE]" />
                <span>Tiempo de ruta</span>
              </div>
              <div className="font-mono-num text-xl font-bold text-[#4EA8DE] mt-0.5">
                {elapsedLabel}
              </div>
            </div>
            <div className="rounded-xl bg-[#112A3E] border border-[#F5B700]/35 p-3.5">
              <div className="text-[11px] text-[#D9A05B] flex items-center gap-1">
                <Award className="w-3 h-3 text-[#F5B700]" />
                <span>Medallas</span>
              </div>
              <div className="font-mono-num text-xl font-bold text-[#F5B700] mt-0.5">
                {unlockedCount}/{ACHIEVEMENTS.length}
              </div>
            </div>
          </section>

          {/* NEW SECTION: Logros y Medallas */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFF8E7] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5B700]" />
                  <span>Logros y Medallas</span>
                </h3>
                <p className="text-xs text-[#A3B1BF]">
                  Desbloquea medallas superando etapas sin errores, explorando el mirador 3D y completando Peñas en menos de 20 minutos.
                </p>
              </div>

              {/* Interactive Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#081523] border border-white/10 shrink-0">
                {(
                  [
                    { id: 'all', label: `Todas (${ACHIEVEMENTS.length})` },
                    { id: 'unlocked', label: `Obtenidas (${unlockedCount})` },
                    { id: 'locked', label: `Pendientes (${ACHIEVEMENTS.length - unlockedCount})` }
                  ] as { id: MedalFilter; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setFilter(tab.id);
                    }}
                    className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      filter === tab.id
                        ? 'bg-[#1E4D3B] text-[#FFF8E7] border border-[#52B788]/50'
                        : 'text-[#A3B1BF] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {recentAchievementIds.length > 0 && (
              <div className="relative overflow-hidden rounded-xl border border-[#F5B700]/65 bg-gradient-to-r from-[#2D200B] via-[#1C382B] to-[#112A3E] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent animate-relic-shimmer"
                />
                <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                  <Sparkles className="w-5 h-5 text-[#FFD166] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#FFF8E7]">
                      ¡Nuevo hito conquistado!
                    </div>
                    <div className="text-xs text-[#E2DDD2]">
                      Desbloqueaste {recentAchievementIds.length}{' '}
                      {recentAchievementIds.length === 1 ? 'medalla nueva' : 'medallas nuevas'}. Toca cualquier medalla obtenida para celebrar.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerAllUnlockedBursts}
                  className="relative z-10 min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Celebrar logros</span>
                </button>
              </div>
            )}

            {filteredMedals.length === 0 ? (
              <div className="rounded-xl bg-[#081523] border border-white/10 p-6 text-center text-sm text-[#A3B1BF]">
                {filter === 'unlocked'
                  ? 'Aún no has desbloqueado medallas. Completa tu primera etapa para ganar «Chaski del Altiplano».'
                  : '¡Has desbloqueado todas las medallas disponibles de Peñas!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMedals.map((ach, idx) => {
                  const isUnlocked = unlockedSet.has(ach.id);
                  const isRecent = recentSet.has(ach.id);
                  const burstCount = burstMap[ach.id] || 0;
                  const hint = getAchievementProgressHint(ach.id, progress);

                  return (
                    <article
                      key={ach.id}
                      onClick={() => {
                        if (isUnlocked) triggerMedalBurst(ach.id);
                      }}
                      className={`relative rounded-xl border p-3.5 flex items-start gap-3.5 transition-all ${
                        isRecent
                          ? 'bg-gradient-to-br from-[#231B0E] via-[#112A3E] to-[#133228] border-[#FFD166] shadow-[0_0_24px_rgba(245,183,0,0.22)] cursor-pointer'
                          : isUnlocked
                            ? 'bg-[#112A3E] border-[#F5B700]/45 hover:border-[#FFD166]/80 cursor-pointer'
                            : 'bg-[#081523]/80 border-white/10 opacity-85'
                      }`}
                      style={
                        isRecent
                          ? { animationDelay: `${idx * 70}ms` }
                          : undefined
                      }
                    >
                      {/* Subtle ambient shimmer on newly unlocked card */}
                      {isRecent && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
                        >
                          <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD166]/15 to-transparent animate-relic-shimmer" />
                        </span>
                      )}

                      <div className="relative shrink-0">
                        {isUnlocked && burstCount > 0 && (
                          <GoldenParticlesBurst
                            burstKey={`${ach.id}-${burstCount}`}
                            density={isRecent ? 'rich' : 'compact'}
                          />
                        )}
                        <div
                          key={`badge-${ach.id}-${burstCount}`}
                          className={`relative z-10 ${isUnlocked && burstCount > 0 ? 'animate-medal-reveal' : ''}`}
                        >
                          <MedalBadge
                            icon={ach.icon}
                            tier={ach.tier}
                            unlocked={isUnlocked}
                            className="w-14 h-14"
                          />
                        </div>
                      </div>

                      <div className="relative z-10 min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
                          <span className={isUnlocked ? 'text-[#F5B700]' : 'text-[#64748B]'}>
                            Medalla de {getTierLabel(ach.tier)}
                            {isRecent ? ' · Nueva' : ''}
                          </span>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-[#52B788]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Desbloqueada</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#94A3B8] font-mono-num">
                              <Lock className="w-3 h-3" />
                              <span>{hint}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-[#FFF8E7] leading-snug">{ach.title}</h4>
                        <p className="text-xs text-[#CBD5E1] leading-relaxed">
                          {isUnlocked ? ach.description : ach.criterion}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end px-4 sm:px-6 py-3 bg-[#081523] border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="min-h-[44px] w-full sm:w-auto px-6 py-2 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] text-sm font-bold cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
