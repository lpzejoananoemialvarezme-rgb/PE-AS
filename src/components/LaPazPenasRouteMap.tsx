import React from 'react';

interface LaPazPenasRouteMapProps {
  compact?: boolean;
}

const ROAD_PATH =
  'M 120 262 C 215 245, 290 214, 385 210 C 485 206, 580 198, 680 188';

export const LaPazPenasRouteMap: React.FC<LaPazPenasRouteMapProps> = ({
  compact = false
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-amber-400/45 bg-[#091827]/95 shadow-xl">
      <div
        className={`relative w-full overflow-hidden select-none bg-[#0A1B30] ${
          compact ? 'h-[126px] sm:h-[140px]' : 'aspect-[16/9] min-h-[190px]'
        }`}
        aria-label="Mapa de ubicación mostrando La Paz, El Alto y Peñas"
      >
        <svg
          viewBox="0 10 800 320"
          className="h-full w-full block"
          role="img"
          aria-label="Ubicación de La Paz, El Alto y Peñas"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lpSkyMini" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#081729" />
              <stop offset="56%" stopColor="#143559" />
              <stop offset="100%" stopColor="#2A545E" />
            </linearGradient>
            <linearGradient id="lpAltiplanoMini" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2A4B37" />
              <stop offset="52%" stopColor="#5D4728" />
              <stop offset="100%" stopColor="#3B2917" />
            </linearGradient>
            <linearGradient id="lpLakeMini" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#114B7A" />
              <stop offset="100%" stopColor="#2279A8" />
            </linearGradient>
            <radialGradient id="lpSunGlowMini" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="800" height="340" fill="url(#lpSkyMini)" />

          {/* Sun */}
          <g transform="translate(690, 56)">
            <circle cx="0" cy="0" r="46" fill="url(#lpSunGlowMini)" className="animate-pulse" />
            <circle cx="0" cy="0" r="15" fill="#FBBF24" fillOpacity="0.88" />
          </g>

          {/* Drifting Clouds */}
          <g className="animate-cloud-drift" opacity="0.7">
            <ellipse cx="215" cy="56" rx="34" ry="10" fill="#E2E8F0" fillOpacity="0.22" />
            <ellipse cx="238" cy="52" rx="22" ry="8" fill="#F8FAFC" fillOpacity="0.28" />
          </g>
          <g className="animate-cloud-drift-reverse" opacity="0.68">
            <ellipse cx="475" cy="48" rx="36" ry="10" fill="#E2E8F0" fillOpacity="0.2" />
            <ellipse cx="498" cy="44" rx="22" ry="8" fill="#F8FAFC" fillOpacity="0.25" />
          </g>

          {/* Cordillera Real Silhouette (No text label) */}
          <path
            d="M0 154 L90 108 L165 132 L255 86 L335 122 L425 76 L515 114 L605 68 L690 108 L800 84 L800 340 L0 340 Z"
            fill="#1D354A"
          />
          <path d="M228 103 L255 86 L282 105 L265 101 L255 106 L243 101 Z" fill="#F8FAFC" fillOpacity="0.9" />
          <path d="M392 98 L425 76 L458 100 L439 95 L425 101 L410 94 Z" fill="#F8FAFC" fillOpacity="0.94" />
          <path d="M568 90 L605 68 L644 92 L623 86 L605 94 L587 87 Z" fill="#FFFFFF" fillOpacity="0.97" />

          {/* Lake Accent */}
          <path
            d="M610 152 Q685 138 800 146 L800 192 Q695 192 620 172 Z"
            fill="url(#lpLakeMini)"
            fillOpacity="0.86"
          />

          {/* Altiplano Ground */}
          <path
            d="M0 170 Q210 148 425 166 Q615 180 800 188 L800 340 L0 340 Z"
            fill="url(#lpAltiplanoMini)"
          />

          {/* Route Path La Paz -> El Alto -> Peñas */}
          <path
            d={ROAD_PATH}
            fill="none"
            stroke="#1C1917"
            strokeWidth="16"
            strokeLinecap="round"
            strokeOpacity="0.72"
          />
          <path
            d={ROAD_PATH}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeDasharray="10 8"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Point 1: La Paz */}
          <g transform="translate(120, 262)">
            <circle cx="0" cy="0" r="11" fill="#1D4E89" stroke="#FDE68A" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#FFFBEB" />
            <rect
              x="-44"
              y="-42"
              width="88"
              height="26"
              rx="9"
              fill="#081523"
              fillOpacity="0.94"
              stroke="#60A5FA"
              strokeWidth="1.4"
            />
            <text x="0" y="-24" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="700">
              La Paz
            </text>
          </g>

          {/* Point 2: El Alto */}
          <g transform="translate(385, 210)">
            <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#FBBF24" strokeWidth="3" />
            <circle cx="0" cy="0" r="3.5" fill="#FEF3C7" />
            <rect
              x="-46"
              y="16"
              width="92"
              height="26"
              rx="9"
              fill="#081523"
              fillOpacity="0.94"
              stroke="#FBBF24"
              strokeWidth="1.4"
            />
            <text x="0" y="34" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="700">
              El Alto
            </text>
          </g>

          {/* Point 3: Peñas with Prominent Location Pin Icon */}
          <g transform="translate(680, 188)">
            <circle cx="0" cy="0" r="24" fill="#10B981" fillOpacity="0.28" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#10B981" stroke="#FEF3C7" strokeWidth="3" />

            {/* Classic Location Pin Icon above Peñas */}
            <g transform="translate(0, -14)">
              <path
                d="M0 0 C-14 -16 -20 -26 -20 -37 C-20 -48 -11 -57 0 -57 C11 -57 20 -48 20 -37 C20 -26 14 -16 0 0 Z"
                fill="#F5B700"
                stroke="#FFF8E7"
                strokeWidth="2.6"
              />
              <circle cx="0" cy="-37" r="7.5" fill="#064E3B" stroke="#FFF8E7" strokeWidth="1.6" />
            </g>

            <rect
              x="-48"
              y="16"
              width="96"
              height="28"
              rx="10"
              fill="#064E3B"
              fillOpacity="0.97"
              stroke="#F5B700"
              strokeWidth="2"
            />
            <text x="0" y="35" textAnchor="middle" fill="#FEF3C7" fontSize="15" fontWeight="800">
              Peñas
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
