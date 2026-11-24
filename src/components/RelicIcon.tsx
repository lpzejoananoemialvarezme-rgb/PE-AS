import React from 'react';
import { StageData } from '../types/game';

interface RelicIconProps {
  icon: StageData['relicIcon'];
  unlocked?: boolean;
  className?: string;
}

export const ChakanaLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 6H40V14H50V24H58V40H50V50H40V58H24V50H14V40H6V24H14V14H24V6Z"
      fill="url(#chakanaGold)"
      stroke="#FFF8E7"
      strokeWidth="2"
    />
    <circle cx="32" cy="32" r="7" fill="#0B1D2E" stroke="#F5B700" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="2.5" fill="#F5B700" />
    <defs>
      <linearGradient id="chakanaGold" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD166" />
        <stop offset="0.5" stopColor="#D99B26" />
        <stop offset="1" stopColor="#8C5A2B" />
      </linearGradient>
    </defs>
  </svg>
);

export const RelicIcon: React.FC<RelicIconProps> = ({ icon, unlocked = true, className = 'w-6 h-6' }) => {
  const stroke = unlocked ? '#FFF8E7' : '#64748B';
  const fillPrimary = unlocked ? '#F5B700' : '#334155';
  const fillSecondary = unlocked ? '#2D6A4F' : '#1E293B';

  switch (icon) {
    case 'chakana':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3H20V7H25V12H29V20H25V25H20V29H12V25H7V20H3V12H7V7H12V3Z"
            fill={fillPrimary}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="16" cy="16" r="3" fill={unlocked ? '#1D4E89' : '#0F172A'} />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M16 4C11.5 4 9 7.8 9 13V19L6 23H26L23 19V13C23 7.8 20.5 4 16 4Z"
            fill={fillPrimary}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="16" cy="26" r="2.5" fill={stroke} />
        </svg>
      );
    case 'wiphala':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <rect x="4" y="5" width="24" height="18" rx="2" stroke={stroke} strokeWidth="1.5" fill={fillSecondary} />
          <rect x="6" y="7" width="6" height="6" fill={unlocked ? '#F5B700' : '#475569'} />
          <rect x="13" y="7" width="6" height="6" fill={unlocked ? '#4EA8DE' : '#334155'} />
          <rect x="20" y="7" width="6" height="6" fill={unlocked ? '#52B788' : '#475569'} />
          <rect x="6" y="14" width="6" height="6" fill={unlocked ? '#D97706' : '#334155'} />
          <rect x="13" y="14" width="6" height="6" fill={unlocked ? '#FFF8E7' : '#475569'} />
          <rect x="20" y="14" width="6" height="6" fill={unlocked ? '#F5B700' : '#334155'} />
          <path d="M5 23V28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'loom':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <rect x="5" y="5" width="22" height="22" rx="3" fill={fillSecondary} stroke={stroke} strokeWidth="1.5" />
          <path d="M9 11H23M9 16H23M9 21H23" stroke={fillPrimary} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 7L20 16L16 25L12 16L16 7Z" fill={unlocked ? '#4EA8DE' : '#475569'} fillOpacity="0.7" />
        </svg>
      );
    case 'carabiner':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M5 25L13 11L18 17L22 9L27 25H5Z"
            fill={fillPrimary}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M13 11L16 15L19 12" stroke={unlocked ? '#0B1D2E' : '#1E293B'} strokeWidth="1.5" />
        </svg>
      );
    case 'quinoa':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M16 27V7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="16" cy="8" r="3" fill={fillPrimary} />
          <circle cx="11" cy="13" r="2.6" fill={fillSecondary} stroke={stroke} strokeWidth="1" />
          <circle cx="21" cy="13" r="2.6" fill={fillSecondary} stroke={stroke} strokeWidth="1" />
          <circle cx="11" cy="19" r="2.6" fill={fillPrimary} />
          <circle cx="21" cy="19" r="2.6" fill={fillPrimary} />
        </svg>
      );
    case 'key':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <circle cx="11" cy="13" r="5" fill={fillPrimary} stroke={stroke} strokeWidth="1.5" />
          <circle cx="11" cy="13" r="1.8" fill="#0B1D2E" />
          <path d="M15.5 15.5L26 26M21 21L24 18M23.5 23.5L26.5 20.5" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
};
