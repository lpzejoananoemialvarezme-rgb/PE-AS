import React, { useId } from 'react';
import { AvatarConfig, AvatarPalette, TravelerTrait } from '../types/game';

interface AymaraAvatarProps {
  config: AvatarConfig;
  className?: string;
  showBackdrop?: boolean;
  circular?: boolean;
  travelerBadge?: TravelerTrait;
  label?: string;
  svgRef?: React.Ref<SVGSVGElement>;
}

const PALETTE_COLORS: Record<
  AvatarPalette,
  {
    primary: string;
    secondary: string;
    accent: string;
    trim: string;
    bgTop: string;
    bgBottom: string;
  }
> = {
  tierra: {
    primary: '#7B4824',
    secondary: '#B8743B',
    accent: '#E3B065',
    trim: '#3D2312',
    bgTop: '#2E1E12',
    bgBottom: '#5A3A20'
  },
  verde: {
    primary: '#1E4D3B',
    secondary: '#2D6A4F',
    accent: '#74C69D',
    trim: '#102B20',
    bgTop: '#0E2920',
    bgBottom: '#235943'
  },
  azul: {
    primary: '#133A63',
    secondary: '#1D4E89',
    accent: '#5DB7DE',
    trim: '#0A1E34',
    bgTop: '#0B1D2E',
    bgBottom: '#1B4978'
  },
  armonia: {
    primary: '#1E4D3B',
    secondary: '#1D4E89',
    accent: '#D9A05B',
    trim: '#5C391D',
    bgTop: '#0F2C4C',
    bgBottom: '#2B4C3B'
  }
};

function getSkinShadow(skin: string): string {
  switch (skin) {
    case '#E6B89C':
      return '#C79272';
    case '#C8926E':
      return '#A56D49';
    case '#A56B46':
      return '#804B2B';
    default:
      return '#58311B';
  }
}

export const AymaraAvatar: React.FC<AymaraAvatarProps> = ({
  config,
  className = 'w-20 h-20',
  showBackdrop = true,
  circular = false,
  travelerBadge,
  label = 'Avatar Aymara del viajero',
  svgRef
}) => {
  const uid = useId().replace(/:/g, '');
  const pal = PALETTE_COLORS[config.palette] || PALETTE_COLORS.armonia;
  const skin = config.skinTone || '#C8926E';
  const hair = config.hairColor || '#1B1817';
  const skinShadow = getSkinShadow(skin);
  const clipId = `avatar-clip-${uid}`;
  const bgId = `avatar-bg-${uid}`;

  const hasLongBackHair =
    config.hairStyle === 'cabello_suelto' ||
    config.hairStyle === 'trenzas_tullmas' ||
    config.hairStyle === 'trenzas_dobles';

  const hasBraids =
    config.hairStyle === 'trenzas_tullmas' || config.hairStyle === 'trenzas_dobles';

  const hasFullHat =
    Boolean(travelerBadge) ||
    config.headwear === 'chullo' ||
    config.headwear === 'sombrero_bombin';

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.bgTop} />
          <stop offset="100%" stopColor={pal.bgBottom} />
        </linearGradient>
        <clipPath id={clipId}>
          {circular ? (
            <circle cx="80" cy="80" r="76" />
          ) : (
            <rect x="4" y="4" width="152" height="152" rx="28" />
          )}
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {showBackdrop && (
          <>
            <rect x="4" y="4" width="152" height="152" fill={`url(#${bgId})`} />
            <circle cx="80" cy="64" r="50" fill={pal.accent} fillOpacity="0.16" />
            <path
              d="M4 134 L36 100 L66 119 L108 86 L156 126 L156 156 L4 156 Z"
              fill="#081523"
              fillOpacity="0.34"
            />
            <path
              d="M92 98 L108 86 L122 98 L114 96 L108 93 L100 96 Z"
              fill="#FFF8E7"
              fillOpacity="0.18"
            />
          </>
        )}

        {/* Back hair silhouette behind head and neck */}
        {hasLongBackHair ? (
          <path
            d={
              config.hairStyle === 'cabello_suelto'
                ? 'M45 64 C40 94, 38 124, 42 154 L118 154 C122 124, 120 94, 115 64 C109 36, 97 30, 80 30 C63 30, 51 36, 45 64 Z'
                : 'M48 64 C47 88, 49 102, 54 114 L106 114 C111 102, 113 88, 112 64 C107 36, 95 30, 80 30 C65 30, 53 36, 48 64 Z'
            }
            fill={hair}
          />
        ) : (
          <path
            d="M48 66 C48 40, 61 30, 80 30 C99 30, 112 40, 112 66 C112 78, 108 85, 104 88 L56 88 C52 85, 48 78, 48 66 Z"
            fill={hair}
          />
        )}

        {/* Neck & subtle chin shadow */}
        <path
          d="M69 96 L91 96 L93 118 Q80 124 67 118 Z"
          fill={skin}
        />
        <path
          d="M69 98 Q80 107 91 98 L91 105 Q80 112 69 105 Z"
          fill={skinShadow}
        />

        {/* OUTFITS */}
        {config.outfit === 'poncho_tejido' && (
          <g>
            <path
              d="M18 158 L38 115 Q58 107 80 109 Q102 107 122 115 L142 158 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            <path
              d="M28 142 L80 155 L132 142"
              fill="none"
              stroke={pal.secondary}
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <path
              d="M34 131 L80 144 L126 131"
              fill="none"
              stroke={pal.accent}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon
              points="80,118 87,127 80,136 73,127"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            {/* Neat V-neck opening */}
            <path
              d="M66 109 L80 120 L94 109"
              fill="none"
              stroke={pal.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 152 L22 158 M32 153 L30 158 M40 154 L39 158 M120 154 L121 158 M128 153 L130 158 M136 152 L138 158"
              stroke={pal.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {config.outfit === 'pollera_manta' && (
          <g>
            {/* Traditional cream blouse */}
            <path
              d="M28 158 L40 115 Q60 108 80 110 Q100 108 120 115 L132 158 Z"
              fill="#F5F0E4"
              stroke="#C9BFA8"
              strokeWidth="1.5"
            />
            {/* Draped woven manta shawl */}
            <path
              d="M26 158 L38 114 Q60 123 80 125 Q100 123 122 114 L134 158 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            {/* Woven aguayo stripes along shawl */}
            <path d="M31 144 Q80 152 129 144" fill="none" stroke={pal.accent} strokeWidth="4.5" />
            <path d="M35 135 Q80 142 125 135" fill="none" stroke={pal.primary} strokeWidth="3" />
            {/* Silver Tupu Pin */}
            <circle cx="80" cy="124" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="80" cy="124" r="2" fill={pal.accent} />
            <line x1="71" y1="124" x2="89" y2="124" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {config.outfit === 'chaleco_aguayo' && (
          <g>
            {/* Inner earthy shirt */}
            <path
              d="M28 158 L41 114 Q80 106 119 114 L132 158 Z"
              fill="#EDE6D6"
              stroke="#C4BAA4"
              strokeWidth="1.4"
            />
            <path d="M67 110 L80 122 L93 110" fill="none" stroke="#C4BAA4" strokeWidth="2" />
            {/* Explorer vest panels */}
            <path
              d="M40 114 L67 113 L69 158 L28 158 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M120 114 L93 113 L91 158 L132 158 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            {/* Woven Aguayo pocket stripes */}
            <rect x="42" y="126" width="20" height="28" rx="3" fill={pal.secondary} />
            <rect x="98" y="126" width="20" height="28" rx="3" fill={pal.secondary} />
            <line x1="43" y1="135" x2="61" y2="135" stroke={pal.accent} strokeWidth="3" />
            <line x1="99" y1="135" x2="117" y2="135" stroke={pal.accent} strokeWidth="3" />
            <line x1="43" y1="144" x2="61" y2="144" stroke="#FFF8E7" strokeWidth="2" />
            <line x1="99" y1="144" x2="117" y2="144" stroke="#FFF8E7" strokeWidth="2" />
          </g>
        )}

        {config.outfit === 'capa_guardian' && (
          <g>
            <path
              d="M22 158 L38 114 Q80 106 122 114 L138 158 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            <path
              d="M36 115 Q80 133 124 115 L117 132 Q80 148 43 132 Z"
              fill={pal.primary}
              stroke={pal.accent}
              strokeWidth="2"
            />
            <path
              d="M77 127 H83 V130 H86 V136 H83 V139 H77 V136 H74 V130 H77 Z"
              fill={pal.accent}
            />
          </g>
        )}

        {/* ACCESSORIES */}
        {config.accessory === 'chuspa' && (
          <g>
            <path d="M46 114 L111 158" stroke={pal.accent} strokeWidth="6.5" strokeLinecap="round" />
            <path d="M46 114 L111 158" stroke={pal.trim} strokeWidth="2" strokeDasharray="4 4" />
            <rect x="96" y="133" width="23" height="22" rx="4" fill={pal.primary} stroke={pal.accent} strokeWidth="2" />
            <line x1="98" y1="142" x2="117" y2="142" stroke={pal.accent} strokeWidth="2.5" />
          </g>
        )}

        {config.accessory === 'bufanda_alpaca' && (
          <g>
            <path
              d="M54 107 Q80 121 106 107 L111 121 Q80 134 49 121 Z"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <rect x="63" y="119" width="14" height="35" rx="4" fill={pal.accent} stroke={pal.trim} strokeWidth="1.5" />
            <line x1="65" y1="131" x2="75" y2="131" stroke={pal.primary} strokeWidth="3" />
            <line x1="65" y1="141" x2="75" y2="141" stroke={pal.secondary} strokeWidth="3" />
          </g>
        )}

        {config.accessory === 'collar_plata' && (
          <g>
            <path d="M58 111 Q80 128 102 111" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
            <circle cx="80" cy="122" r="5.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2" />
            <circle cx="80" cy="122" r="2.2" fill={pal.accent} />
            <circle cx="67" cy="117" r="2.4" fill="#E2E8F0" />
            <circle cx="93" cy="117" r="2.4" fill="#E2E8F0" />
          </g>
        )}

        {/* Ears (tucked cleanly under braids/hair) */}
        <ellipse cx="50.5" cy="74" rx="5.5" ry="7.5" fill={skinShadow} />
        <ellipse cx="109.5" cy="74" rx="5.5" ry="7.5" fill={skinShadow} />
        <ellipse cx="51" cy="74" rx="3" ry="4.5" fill={skin} />
        <ellipse cx="109" cy="74" rx="3" ry="4.5" fill={skin} />

        {/* Organic Head Contour */}
        <path
          d="M51 64 C51 43, 62 35, 80 35 C98 35, 109 43, 109 64 C109 84, 98 101, 80 103 C62 101, 51 84, 51 64 Z"
          fill={skin}
        />

        {/* Warm Altiplano Cheeks */}
        <ellipse cx="61" cy="79" rx="5.5" ry="3" fill="#D97757" fillOpacity="0.28" />
        <ellipse cx="99" cy="79" rx="5.5" ry="3" fill="#D97757" fillOpacity="0.28" />

        {/* Expressive Eyes & Eyebrows */}
        <path d="M59 63 Q65 59.5 72 62.5" fill="none" stroke={hair} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M88 62.5 Q95 59.5 101 63" fill="none" stroke={hair} strokeWidth="2.2" strokeLinecap="round" />

        <ellipse cx="66" cy="70" rx="5" ry="3.8" fill="#FFFDF9" />
        <ellipse cx="94" cy="70" rx="5" ry="3.8" fill="#FFFDF9" />
        <circle cx="66" cy="70" r="3" fill="#231914" />
        <circle cx="94" cy="70" r="3" fill="#231914" />
        <circle cx="67.1" cy="68.8" r="1.1" fill="#FFFFFF" />
        <circle cx="95.1" cy="68.8" r="1.1" fill="#FFFFFF" />

        {/* Gentle Nose & Friendly Smile */}
        <path d="M80 70 L78.5 78.5 Q80 80 82 78.5" fill="none" stroke={skinShadow} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M71 87.5 Q80 93.5 89 87.5" fill="none" stroke="#6B3A23" strokeWidth="2.2" strokeLinecap="round" />

        {/* Braids with woven link segments (behind headwear ear flaps, framing shoulders) */}
        {hasBraids && (
          <g>
            {[0, 1, 2, 3, 4].map((step) => {
              const ly = 85 + step * 10;
              const lx = 50 - Math.sin(step * 0.4) * 2.5;
              const rx = 110 + Math.sin(step * 0.4) * 2.5;
              return (
                <g key={step}>
                  <ellipse
                    cx={lx}
                    cy={ly}
                    rx="5.5"
                    ry="6.5"
                    fill={hair}
                    stroke={skinShadow}
                    strokeOpacity="0.22"
                    strokeWidth="0.9"
                  />
                  <ellipse
                    cx={rx}
                    cy={ly}
                    rx="5.5"
                    ry="6.5"
                    fill={hair}
                    stroke={skinShadow}
                    strokeOpacity="0.22"
                    strokeWidth="0.9"
                  />
                </g>
              );
            })}

            {config.hairStyle === 'trenzas_tullmas' ? (
              <g>
                <rect x="44" y="130" width="9" height="4" rx="2" fill={pal.accent} />
                <circle cx="48.5" cy="136" r="4.5" fill={pal.accent} stroke={pal.trim} strokeWidth="1.3" />
                <circle cx="45" cy="142" r="3.2" fill={pal.secondary} />
                <circle cx="52" cy="142" r="3.2" fill={pal.primary} />

                <rect x="107" y="130" width="9" height="4" rx="2" fill={pal.accent} />
                <circle cx="111.5" cy="136" r="4.5" fill={pal.accent} stroke={pal.trim} strokeWidth="1.3" />
                <circle cx="108" cy="142" r="3.2" fill={pal.secondary} />
                <circle cx="115" cy="142" r="3.2" fill={pal.primary} />
              </g>
            ) : (
              <g>
                <rect x="44" y="129" width="9" height="4.5" rx="2" fill={pal.accent} />
                <rect x="107" y="129" width="9" height="4.5" rx="2" fill={pal.accent} />
              </g>
            )}
          </g>
        )}

        {/* Front Hair Parting (neatly tucked under hats or framing forehead) */}
        <path
          d={
            hasFullHat
              ? 'M50 61 C52 46, 63 40, 80 42 C97 40, 108 46, 110 61 C102 52, 91 50, 80 54 C69 50, 58 52, 50 61 Z'
              : 'M49 63 C50 38, 63 32, 80 32 C97 32, 110 38, 111 63 C102 50, 91 48, 80 53 C69 48, 58 50, 49 63 Z'
          }
          fill={hair}
        />

        {/* HEADWEAR (Traveler-Type Signature Hat overrides base headwear when present) */}
        {!travelerBadge && config.headwear === 'chullo' && (
          <g>
            <path
              d="M46 57 L41 85 Q46 92 52 84 L54 61 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M114 57 L119 85 Q114 92 108 84 L106 61 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M46 57 Q48 22 80 20 Q112 22 114 57 Q80 49 46 57 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.8"
            />
            <path d="M47 49 Q80 43 113 49" fill="none" stroke={pal.accent} strokeWidth="4.5" />
            <path d="M51 37 Q80 32 109 37" fill="none" stroke={pal.secondary} strokeWidth="3.5" />
            <circle cx="80" cy="18" r="6" fill={pal.accent} stroke={pal.trim} strokeWidth="1.5" />
            <line x1="45" y1="88" x2="43" y2="100" stroke={pal.accent} strokeWidth="2.4" strokeLinecap="round" />
            <line x1="115" y1="88" x2="117" y2="100" stroke={pal.accent} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        )}

        {!travelerBadge && config.headwear === 'sombrero_bombin' && (
          <g>
            <path
              d="M50 47 Q52 20 80 20 Q108 20 110 47 Z"
              fill="#2B211A"
              stroke="#140F0C"
              strokeWidth="1.8"
            />
            <path d="M50 43 Q80 46 110 43" fill="none" stroke={pal.accent} strokeWidth="4" />
            <path
              d="M35 47 Q80 54 125 47 Q122 53 80 55 Q38 53 35 47 Z"
              fill="#3B2D23"
              stroke="#140F0C"
              strokeWidth="1.5"
            />
          </g>
        )}

        {!travelerBadge && config.headwear === 'vincha_chakana' && (
          <g>
            <path
              d="M47 49 Q80 43 113 49 L112 56 Q80 51 48 56 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M77 43 H83 V45 H85 V51 H83 V53 H77 V51 H75 V45 H77 Z"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.2"
            />
          </g>
        )}

        {/* TRAVELER ARCHETYPE SIGNATURE HATS & BADGES */}
        {travelerBadge === 'cultural' && (
          <g>
            {/* Ceremonial Andean Hat with Gold Chakana Crest */}
            <path
              d="M49 47 Q52 19 80 18 Q108 19 111 47 Z"
              fill="#5C2618"
              stroke="#2C110A"
              strokeWidth="1.8"
            />
            <path d="M50 42 Q80 45 110 42" fill="none" stroke="#F5B700" strokeWidth="4.5" />
            <path d="M51 37 Q80 40 109 37" fill="none" stroke="#1D4E89" strokeWidth="2.5" />
            <path
              d="M33 47 Q80 54 127 47 Q124 53 80 56 Q36 53 33 47 Z"
              fill="#421A10"
              stroke="#2C110A"
              strokeWidth="1.5"
            />
            {/* Gold Chakana Crown Pin */}
            <path
              d="M77 25 H83 V27 H85 V33 H83 V35 H77 V33 H75 V27 H77 Z"
              fill="#FFD166"
              stroke="#7B4824"
              strokeWidth="1.2"
            />
            {/* Corner Cultural Medallion */}
            <circle cx="130" cy="130" r="17" fill="#5C2618" stroke="#F5B700" strokeWidth="2.5" />
            <path
              d="M127 122 H133 V125 H136 V131 H133 V134 H127 V131 H124 V125 H127 Z"
              fill="#FFD166"
            />
          </g>
        )}

        {travelerBadge === 'aventurero' && (
          <g>
            {/* High-Altitude Explorer Hat with Winged Mountain Badge */}
            <path
              d="M50 46 Q54 20 80 21 Q106 20 110 46 Z"
              fill="#4E3824"
              stroke="#24180D"
              strokeWidth="1.8"
            />
            <path d="M50 41 Q80 44 110 41" fill="none" stroke="#1D4E89" strokeWidth="4.5" />
            <path
              d="M30 46 Q80 55 130 45 Q124 52 80 55 Q36 52 30 46 Z"
              fill="#63482F"
              stroke="#24180D"
              strokeWidth="1.5"
            />
            {/* Condor Wing & Summit Crest */}
            <polygon points="80,22 88,35 72,35" fill="#FFD166" stroke="#24180D" strokeWidth="1.2" />
            <polygon points="80,22 83,28 77,28" fill="#FFF8E7" />
            {/* Corner Adventurer Medallion */}
            <circle cx="130" cy="130" r="17" fill="#133A63" stroke="#FFD166" strokeWidth="2.5" />
            <polygon points="130,119 139,137 121,137" fill="#FFD166" />
            <polygon points="130,119 134,127 126,127" fill="#FFF8E7" />
          </g>
        )}

        {travelerBadge === 'naturaleza' && (
          <g>
            {/* Pachamama Naturalist Hat with Andean Leaf Sprig */}
            <path
              d="M50 46 Q53 20 80 20 Q107 20 110 46 Z"
              fill="#1E4D3B"
              stroke="#0E2920"
              strokeWidth="1.8"
            />
            <path d="M50 41 Q80 44 110 41" fill="none" stroke="#D9A05B" strokeWidth="4" />
            <path
              d="M31 46 Q80 54 129 46 Q125 52 80 55 Q35 52 31 46 Z"
              fill="#2D6A4F"
              stroke="#0E2920"
              strokeWidth="1.5"
            />
            {/* Botanical Feather / Leaf tucked in band */}
            <path
              d="M101 41 Q113 24 122 25 Q116 37 103 42 Z"
              fill="#74C69D"
              stroke="#0E2920"
              strokeWidth="1.2"
            />
            <circle cx="99" cy="41" r="3" fill="#FFD166" />
            {/* Corner Nature Medallion */}
            <circle cx="130" cy="130" r="17" fill="#1E4D3B" stroke="#74C69D" strokeWidth="2.5" />
            <path
              d="M122 138 Q123 122 139 121 Q137 137 122 138 Z"
              fill="#74C69D"
            />
            <line x1="122" y1="138" x2="134" y2="126" stroke="#0E2920" strokeWidth="1.5" />
          </g>
        )}

        {travelerBadge === 'comunitario' && (
          <g>
            {/* Warm Festive Host Hat of Peñas with Aguayo Band & Sun Pin */}
            <path
              d="M49 46 Q52 19 80 19 Q108 19 111 46 Z"
              fill="#8C4B1F"
              stroke="#3D1F0B"
              strokeWidth="1.8"
            />
            <path d="M50 41 Q80 44 110 41" fill="none" stroke="#F5B700" strokeWidth="4.5" />
            <path d="M50 37 Q80 40 110 37" fill="none" stroke="#52B788" strokeWidth="2.5" />
            <path
              d="M33 46 Q80 54 127 46 Q123 52 80 55 Q37 52 33 46 Z"
              fill="#A65E2E"
              stroke="#3D1F0B"
              strokeWidth="1.5"
            />
            {/* Inti Sun Emblem */}
            <circle cx="80" cy="30" r="5" fill="#FFD166" stroke="#3D1F0B" strokeWidth="1.2" />
            {/* Corner Community Sun Medallion */}
            <circle cx="130" cy="130" r="17" fill="#8C4B1F" stroke="#F5B700" strokeWidth="2.5" />
            <circle cx="130" cy="130" r="6.5" fill="#FFD166" />
            <path
              d="M130 118 V121 M130 139 V142 M118 130 H121 M139 130 H142"
              stroke="#FFD166"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>

      {showBackdrop &&
        (circular ? (
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke={pal.accent}
            strokeOpacity="0.85"
            strokeWidth="4"
          />
        ) : (
          <rect
            x="4"
            y="4"
            width="152"
            height="152"
            rx="28"
            fill="none"
            stroke={pal.accent}
            strokeOpacity="0.65"
            strokeWidth="3"
          />
        ))}
    </svg>
  );
};
