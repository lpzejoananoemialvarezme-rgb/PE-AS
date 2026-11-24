import React from 'react';
import { Award, Clock, Compass, Crown, Flame, Grid3X3, Leaf, Mountain, Star } from 'lucide-react';
import { AchievementDefinition, MedalTier } from '../types/game';

interface MedalIconProps {
  icon: AchievementDefinition['icon'];
  tier: MedalTier;
  unlocked: boolean;
  className?: string;
}

const TIER_STYLES: Record<
  MedalTier,
  { bg: string; border: string; glow: string; iconColor: string; label: string }
> = {
  bronce: {
    bg: 'from-[#6B4423] via-[#A86A38] to-[#4A2D14]',
    border: 'border-[#D9A05B]',
    glow: 'shadow-[0_0_18px_rgba(217,160,91,0.35)]',
    iconColor: 'text-[#FFF1D6]',
    label: 'Bronce'
  },
  plata: {
    bg: 'from-[#334155] via-[#64748B] to-[#1E293B]',
    border: 'border-[#CBD5E1]',
    glow: 'shadow-[0_0_18px_rgba(203,213,225,0.3)]',
    iconColor: 'text-[#F8FAFC]',
    label: 'Plata'
  },
  esmeralda: {
    bg: 'from-[#144332] via-[#2D6A4F] to-[#0D2E22]',
    border: 'border-[#52B788]',
    glow: 'shadow-[0_0_18px_rgba(82,183,136,0.35)]',
    iconColor: 'text-[#D8F3DC]',
    label: 'Esmeralda'
  },
  oro: {
    bg: 'from-[#8C5A08] via-[#F5B700] to-[#6B440B]',
    border: 'border-[#FFE082]',
    glow: 'shadow-[0_0_22px_rgba(245,183,0,0.45)]',
    iconColor: 'text-[#1A1207]',
    label: 'Oro'
  }
};

export const MedalBadge: React.FC<MedalIconProps> = ({
  icon,
  tier,
  unlocked,
  className = 'w-14 h-14'
}) => {
  const style = TIER_STYLES[tier];

  const renderGlyph = () => {
    const cls = `w-6 h-6 relative z-10 ${unlocked ? style.iconColor : 'text-[#64748B]'}`;
    switch (icon) {
      case 'compass':
        return <Compass className={cls} />;
      case 'star':
        return <Star className={cls} />;
      case 'mountain':
        return <Mountain className={cls} />;
      case 'flame':
        return <Flame className={cls} />;
      case 'loom':
        return <Grid3X3 className={cls} />;
      case 'leaf':
        return <Leaf className={cls} />;
      case 'crown':
        return <Crown className={cls} />;
      case 'clock':
        return <Clock className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex items-center justify-center shrink-0 border-2 ${className} ${
        unlocked
          ? `bg-gradient-to-br ${style.bg} ${style.border} ${style.glow}`
          : 'bg-[#081523] border-white/15 opacity-50 grayscale'
      }`}
    >
      {unlocked && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-relic-shimmer"
        />
      )}
      {renderGlyph()}
    </div>
  );
};

export function getTierLabel(tier: MedalTier): string {
  return TIER_STYLES[tier].label;
}
