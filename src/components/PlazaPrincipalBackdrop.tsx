import React, { useId } from 'react';

/**
 * Vibrant, animated & colorful illustration of the Plaza Principal de Peñas
 * used as Tata's scenic backdrop on the home screen.
 */
export const PlazaPrincipalBackdrop: React.FC = () => {
  const uid = useId().replace(/:/g, '');
  const skyId = `plaza-sky-${uid}`;
  const sunGlowId = `plaza-sun-${uid}`;
  const cobbleId = `plaza-cobble-${uid}`;
  const mountainId = `plaza-mtn-${uid}`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 800 320"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full block"
      >
        <defs>
          {/* Radiant golden-hour Andean sky */}
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#164E87" />
            <stop offset="45%" stopColor="#2A7FB8" />
            <stop offset="78%" stopColor="#F59E0B" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          <radialGradient id={sunGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.98" />
            <stop offset="38%" stopColor="#FBBF24" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={mountainId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B5B84" />
            <stop offset="100%" stopColor="#1F344E" />
          </linearGradient>

          <linearGradient id={cobbleId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8875E" />
            <stop offset="45%" stopColor="#8C5F3E" />
            <stop offset="100%" stopColor="#5B3B25" />
          </linearGradient>
        </defs>

        {/* Sunlit Sky */}
        <rect x="0" y="0" width="800" height="320" fill={`url(#${skyId})`} />

        {/* Radiant Andean Sun */}
        <g transform="translate(565, 86)">
          <circle cx="0" cy="0" r="88" fill={`url(#${sunGlowId})`} className="animate-pulse" />
          <circle cx="0" cy="0" r="24" fill="#FEF3C7" />
        </g>

        {/* Drifting Fluffy Clouds */}
        <g className="animate-cloud-drift" opacity="0.88">
          <ellipse cx="145" cy="54" rx="44" ry="13" fill="#FFF7ED" fillOpacity="0.55" />
          <ellipse cx="176" cy="49" rx="28" ry="11" fill="#FFFFFF" fillOpacity="0.72" />
        </g>
        <g className="animate-cloud-drift-reverse" opacity="0.84">
          <ellipse cx="425" cy="44" rx="46" ry="12" fill="#FFF7ED" fillOpacity="0.5" />
          <ellipse cx="456" cy="40" rx="28" ry="10" fill="#FFFFFF" fillOpacity="0.68" />
        </g>

        {/* Snow-Capped Cordillera Real Mountains */}
        <path
          d="M0 175 L82 114 L152 146 L236 92 L320 138 L412 88 L496 134 L590 96 L685 138 L800 105 L800 245 L0 245 Z"
          fill={`url(#${mountainId})`}
        />
        {/* Crisp Mountain Snow Caps */}
        <path d="M56 134 L82 114 L108 134 L92 128 L82 136 L70 128 Z" fill="#F8FAFC" />
        <path d="M204 114 L236 92 L268 115 L250 108 L236 117 L220 108 Z" fill="#FFFFFF" />
        <path d="M376 112 L412 88 L448 113 L428 106 L412 115 L395 106 Z" fill="#FFFFFF" />
        <path d="M560 116 L590 96 L622 118 L604 111 L590 119 L576 111 Z" fill="#F8FAFC" />

        {/* Soaring Andean Condor */}
        <g transform="translate(345, 76)" className="animate-condor-soar" opacity="0.9">
          <path
            d="M-14 2 Q-7 -5 0 0 Q7 -5 14 2 Q7 0 0 3.5 Q-7 0 -14 2 Z"
            fill="#1E293B"
            stroke="#FEF08A"
            strokeWidth="0.7"
          />
        </g>

        {/* Distant Altiplano Hillside */}
        <path
          d="M0 198 Q210 172 430 192 Q635 208 800 185 L800 250 L0 250 Z"
          fill="#4A7C59"
        />

        {/* LEFT: Historic Colonial Church of Peñas with Bell Tower */}
        <g transform="translate(26, 108)">
          {/* Main adobe church nave */}
          <rect x="34" y="42" width="108" height="72" rx="3" fill="#FDF6E7" stroke="#8C5A3C" strokeWidth="1.8" />
          {/* Terracotta pitched roof */}
          <path d="M24 44 L88 18 L152 44 Z" fill="#D9532F" stroke="#7C2D12" strokeWidth="1.8" />
          {/* Tall Bell Tower */}
          <rect x="6" y="18" width="38" height="96" rx="2" fill="#FFF8EB" stroke="#8C5A3C" strokeWidth="1.8" />
          <path d="M2 20 L25 0 L48 20 Z" fill="#C84B31" stroke="#7C2D12" strokeWidth="1.8" />
          {/* Tower Cross */}
          <line x1="25" y1="-10" x2="25" y2="2" stroke="#FBBF24" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="20" y1="-5" x2="30" y2="-5" stroke="#FBBF24" strokeWidth="2.4" strokeLinecap="round" />
          {/* Bell Arch */}
          <path d="M17 48 L17 34 A8 8 0 0 1 33 34 L33 48 Z" fill="#1E293B" />
          <circle cx="25" cy="37" r="4.2" fill="#F59E0B" />
          {/* Church Arched Door & Rose Window */}
          <circle cx="88" cy="54" r="8" fill="#1D4E89" stroke="#F59E0B" strokeWidth="2" />
          <path d="M74 114 L74 84 A14 14 0 0 1 102 84 L102 114 Z" fill="#6D3B1A" stroke="#F59E0B" strokeWidth="1.6" />
          {/* Warm Church Trim */}
          <rect x="34" y="106" width="108" height="8" fill="#E67E22" />
        </g>

        {/* RIGHT: Colorful La Casona Histórica of Peñas */}
        <g transform="translate(612, 126)">
          <rect x="0" y="26" width="166" height="72" rx="3" fill="#FCE7C8" stroke="#78350F" strokeWidth="1.8" />
          {/* Terracotta Tile Roof */}
          <path d="M-8 28 L16 6 L154 6 L174 28 Z" fill="#C84B31" stroke="#7C2D12" strokeWidth="1.8" />
          {/* Wooden Colonial Balcony */}
          <rect x="14" y="42" width="138" height="16" fill="#7C3F1D" stroke="#451A03" strokeWidth="1.4" />
          <g stroke="#FBBF24" strokeWidth="1.6">
            <line x1="24" y1="42" x2="24" y2="58" />
            <line x1="42" y1="42" x2="42" y2="58" />
            <line x1="60" y1="42" x2="60" y2="58" />
            <line x1="78" y1="42" x2="78" y2="58" />
            <line x1="96" y1="42" x2="96" y2="58" />
            <line x1="114" y1="42" x2="114" y2="58" />
            <line x1="132" y1="42" x2="132" y2="58" />
          </g>
          {/* Turquoise Colonial Doors & Windows */}
          <rect x="26" y="64" width="22" height="34" rx="2" fill="#0E7490" stroke="#451A03" strokeWidth="1.5" />
          <rect x="72" y="64" width="24" height="34" rx="2" fill="#0E7490" stroke="#451A03" strokeWidth="1.5" />
          <rect x="118" y="64" width="22" height="34" rx="2" fill="#0E7490" stroke="#451A03" strokeWidth="1.5" />
          {/* Terracotta Base Trim */}
          <rect x="0" y="90" width="166" height="8" fill="#D97706" />
        </g>

        {/* MIDGROUND: Colorful Village Houses Across the Square */}
        <g transform="translate(200, 160)">
          <rect x="0" y="14" width="66" height="44" fill="#FDE68A" stroke="#92400E" strokeWidth="1.4" />
          <path d="M-4 15 L33 0 L70 15 Z" fill="#E11D48" stroke="#881337" strokeWidth="1.4" />
          <rect x="24" y="34" width="16" height="24" fill="#1D4E89" />

          <rect x="70" y="18" width="58" height="40" fill="#A7F3D0" stroke="#065F46" strokeWidth="1.4" />
          <path d="M66 19 L99 4 L132 19 Z" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.4" />
          <rect x="90" y="36" width="15" height="22" fill="#78350F" />
        </g>

        {/* Plaza Cobblestone Ground */}
        <path d="M0 218 L800 218 L800 320 L0 320 Z" fill={`url(#${cobbleId})`} />
        {/* Warm Decorative Diagonal Plaza Tile Lines */}
        <g stroke="#FDE68A" strokeOpacity="0.22" strokeWidth="1.5">
          <line x1="0" y1="242" x2="800" y2="242" />
          <line x1="0" y1="272" x2="800" y2="272" />
          <line x1="120" y1="218" x2="60" y2="320" />
          <line x1="270" y1="218" x2="240" y2="320" />
          <line x1="420" y1="218" x2="420" y2="320" />
          <line x1="570" y1="218" x2="600" y2="320" />
          <line x1="710" y1="218" x2="770" y2="320" />
        </g>

        {/* Central Plaza Fountain / Túpac Katari Stone Pedestal & Sparkling Water */}
        <g transform="translate(385, 178)">
          <ellipse cx="32" cy="52" rx="46" ry="11" fill="#0EA5E9" fillOpacity="0.65" stroke="#E2E8F0" strokeWidth="2.4" />
          <rect x="22" y="20" width="20" height="30" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="32" cy="20" rx="18" ry="6" fill="#E2E8F0" stroke="#475569" strokeWidth="1.4" />
          {/* Animated Sparkling Water Arcs */}
          <g className="animate-water-shimmer" stroke="#BAE6FD" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M32 16 Q20 2 14 26" />
            <path d="M32 16 Q44 2 50 26" />
            <circle cx="32" cy="8" r="2.5" fill="#F8FAFC" />
          </g>
        </g>

        {/* Swaying Vibrant Plaza Kiswara Trees & Flower Planters */}
        <g transform="translate(182, 178)" className="animate-plaza-tree">
          <rect x="-4" y="26" width="8" height="22" fill="#78350F" rx="2" />
          <circle cx="0" cy="14" r="18" fill="#16A34A" />
          <circle cx="-10" cy="19" r="12" fill="#22C55E" />
          <circle cx="10" cy="19" r="12" fill="#15803D" />
          <circle cx="-4" cy="10" r="2.8" fill="#F43F5E" />
          <circle cx="7" cy="14" r="2.8" fill="#FBBF24" />
        </g>

        <g transform="translate(572, 180)" className="animate-plaza-tree">
          <rect x="-4" y="26" width="8" height="22" fill="#78350F" rx="2" />
          <circle cx="0" cy="14" r="17" fill="#15803D" />
          <circle cx="-9" cy="20" r="12" fill="#22C55E" />
          <circle cx="9" cy="19" r="11" fill="#16A34A" />
          <circle cx="-5" cy="11" r="2.6" fill="#FBBF24" />
          <circle cx="6" cy="15" r="2.6" fill="#EC4899" />
        </g>

        {/* Warm Glowing Colonial Plaza Street Lamps */}
        <g transform="translate(262, 170)">
          <rect x="-2" y="10" width="4" height="44" fill="#1E293B" />
          <circle cx="0" cy="6" r="13" fill="#FBBF24" fillOpacity="0.48" className="animate-plaza-lantern" />
          <circle cx="0" cy="6" r="5" fill="#FEF08A" />
        </g>
        <g transform="translate(524, 170)">
          <rect x="-2" y="10" width="4" height="44" fill="#1E293B" />
          <circle cx="0" cy="6" r="13" fill="#FBBF24" fillOpacity="0.48" className="animate-plaza-lantern" />
          <circle cx="0" cy="6" r="5" fill="#FEF08A" />
        </g>

        {/* Festive Multicolored Aguayo Bunting / Flags Swaying Over the Plaza */}
        <g className="animate-plaza-banner">
          <path d="M54 128 Q260 172 480 124" fill="none" stroke="#FFFBEB" strokeWidth="1.6" strokeOpacity="0.85" />
          <polygon points="88,136 102,139 94,154" fill="#EC4899" />
          <polygon points="122,143 136,145 128,160" fill="#F59E0B" />
          <polygon points="158,148 172,149 164,164" fill="#10B981" />
          <polygon points="196,151 210,152 203,167" fill="#06B6D4" />
          <polygon points="234,152 248,152 241,167" fill="#EF4444" />
          <polygon points="274,151 288,150 282,165" fill="#8B5CF6" />
          <polygon points="314,148 328,146 322,161" fill="#FBBF24" />
          <polygon points="354,144 368,141 362,156" fill="#EC4899" />
          <polygon points="394,138 408,135 402,150" fill="#10B981" />
          <polygon points="434,132 448,129 442,144" fill="#0EA5E9" />
        </g>

        <g className="animate-plaza-banner">
          <path d="M440 122 Q605 164 765 128" fill="none" stroke="#FFFBEB" strokeWidth="1.6" strokeOpacity="0.85" />
          <polygon points="480,132 494,135 486,150" fill="#F59E0B" />
          <polygon points="520,140 534,142 526,157" fill="#EC4899" />
          <polygon points="560,144 574,145 566,160" fill="#06B6D4" />
          <polygon points="602,145 616,145 609,160" fill="#10B981" />
          <polygon points="644,143 658,142 651,157" fill="#EF4444" />
          <polygon points="686,139 700,137 693,152" fill="#8B5CF6" />
          <polygon points="726,134 740,131 734,146" fill="#FBBF24" />
        </g>

        {/* Floating Golden Sunlit Motes */}
        <g className="animate-mote-float">
          <circle cx="115" cy="186" r="2.6" fill="#FEF08A" />
          <circle cx="292" cy="148" r="2.2" fill="#FDE047" />
          <circle cx="496" cy="162" r="2.8" fill="#FBBF24" />
          <circle cx="670" cy="176" r="2.2" fill="#FEF08A" />
        </g>
      </svg>

      {/* Subtle Bottom Grounding Gradient so foreground Tata & speech box pop cleanly */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071320]/70 via-transparent to-[#071320]/20" />
    </div>
  );
};
