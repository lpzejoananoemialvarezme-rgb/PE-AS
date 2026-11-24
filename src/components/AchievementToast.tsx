import React from 'react';
import { Award, ChevronRight, X } from 'lucide-react';
import { AchievementDefinition } from '../types/game';
import { MedalBadge, getTierLabel } from './MedalIcon';
import { GoldenParticlesBurst } from './GoldenParticlesBurst';

interface AchievementToastProps {
  achievements: AchievementDefinition[];
  onDismiss: () => void;
  onOpenProfile: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievements,
  onDismiss,
  onOpenProfile
}) => {
  if (achievements.length === 0) return null;

  const first = achievements[0];
  const extraCount = achievements.length - 1;
  const burstKey = achievements.map((a) => a.id).join('-');

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-24px)] max-w-md pointer-events-none"
    >
      <div className="pointer-events-auto relative rounded-2xl border-2 border-[#F5B700] bg-gradient-to-r from-[#1A1308]/95 via-[#0B1D2E]/95 to-[#081523]/95 shadow-[0_14px_40px_rgba(245,183,0,0.28)] p-3.5 flex items-center gap-3.5 animate-toast-reveal">
        {/* Shimmer sweep inside toast */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent animate-relic-shimmer" />
        </span>

        {/* Medal Badge with Golden Particle Reveal */}
        <div className="relative shrink-0">
          <GoldenParticlesBurst burstKey={burstKey} density="rich" />
          <div className="relative z-10 animate-medal-reveal">
            <MedalBadge icon={first.icon} tier={first.tier} unlocked className="w-12 h-12" />
          </div>
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFD166]">
            <Award className="w-3.5 h-3.5 shrink-0 text-[#F5B700]" />
            <span className="truncate">
              ¡Medalla de {getTierLabel(first.tier)} desbloqueada!
              {extraCount > 0 ? ` (+${extraCount} más)` : ''}
            </span>
          </div>
          <div className="text-sm font-bold text-[#FFF8E7] truncate">{first.title}</div>
          <p className="text-xs text-[#CBD5E1] truncate">{first.description}</p>
        </div>

        <div className="relative z-10 flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenProfile}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-md transition-colors"
          >
            <span>Perfil</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar aviso de logro"
            className="w-9 h-9 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-[#CBD5E1] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
