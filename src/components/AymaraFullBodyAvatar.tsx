import React from 'react';
import { AvatarConfig, AvatarPalette, TravelerTrait } from '../types/game';

export type AvatarPose =
  | 'idle'
  | 'walk'
  | 'climb'
  | 'cheer'
  | 'paint'
  | 'dance'
  | 'jump'
  | 'smile'
  | 'flex'
  | 'dab'
  | 'trophy';
export type AvatarHeldItem = 'none' | 'brush' | 'stone' | 'basket' | 'compass';

interface AymaraFullBodyAvatarProps {
  config: AvatarConfig;
  pose?: AvatarPose;
  walking?: boolean;
  facing?: 'right' | 'left';
  heldItem?: AvatarHeldItem;
  travelerBadge?: TravelerTrait;
  className?: string;
  label?: string;
  showGroundShadow?: boolean;
}

const PALETTE_COLORS: Record<
  AvatarPalette,
  {
    primary: string;
    secondary: string;
    accent: string;
    trim: string;
  }
> = {
  tierra: {
    primary: '#7B4824',
    secondary: '#B8743B',
    accent: '#E3B065',
    trim: '#3D2312'
  },
  verde: {
    primary: '#1E4D3B',
    secondary: '#2D6A4F',
    accent: '#74C69D',
    trim: '#102B20'
  },
  azul: {
    primary: '#133A63',
    secondary: '#1D4E89',
    accent: '#5DB7DE',
    trim: '#0A1E34'
  },
  armonia: {
    primary: '#1E4D3B',
    secondary: '#1D4E89',
    accent: '#D9A05B',
    trim: '#5C391D'
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

export const AymaraFullBodyAvatar: React.FC<AymaraFullBodyAvatarProps> = ({
  config,
  pose = 'idle',
  walking = false,
  facing = 'right',
  heldItem = 'none',
  travelerBadge,
  className = 'w-20 h-32',
  label = 'Viajero de Peñas en cuerpo completo',
  showGroundShadow = true
}) => {
  const pal = PALETTE_COLORS[config.palette] || PALETTE_COLORS.armonia;
  const skin = config.skinTone || '#C8926E';
  const hair = config.hairColor || '#1B1817';
  const skinShadow = getSkinShadow(skin);

  const isWalking = walking || pose === 'walk';
  const isCheering = pose === 'cheer';
  const isClimbing = pose === 'climb';
  const isPainting = pose === 'paint';
  const isDancing = pose === 'dance';
  const isJumping = pose === 'jump';
  const isSmiling = pose === 'smile';
  const isFlexing = pose === 'flex';
  const isDabbing = pose === 'dab';
  const isHoldingTrophy = pose === 'trophy';

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

  const bodyAnimClass = isWalking
    ? 'animate-avatar-walk'
    : isDancing
      ? 'animate-avatar-dance'
      : isJumping
        ? 'animate-avatar-jump'
        : isDabbing
          ? 'animate-avatar-dab'
          : isSmiling || isHoldingTrophy
            ? 'animate-avatar-smile'
            : isFlexing
              ? 'animate-avatar-flex'
              : isCheering
                ? 'animate-avatar-cheer'
                : isPainting
                  ? 'animate-avatar-paint'
                  : '';

  const sleeveColor =
    config.outfit === 'pollera_manta'
      ? '#F5F0E4'
      : config.outfit === 'chaleco_aguayo'
        ? '#EDE6D6'
        : pal.primary;

  const trouserColor =
    config.outfit === 'capa_guardian'
      ? '#16253A'
      : config.outfit === 'chaleco_aguayo'
        ? '#3E3227'
        : '#1E293B';

  return (
    <svg
      viewBox="0 0 180 280"
      className={`overflow-visible select-none ${className}`}
      role="img"
      aria-label={label}
      style={facing === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      {showGroundShadow && (
        <ellipse cx="90" cy="266" rx="40" ry="9" fill="#040C14" fillOpacity="0.45" />
      )}

      <g className={bodyAnimClass}>
        {/* Back cape silhouette for Guardián */}
        {config.outfit === 'capa_guardian' && (
          <path
            d="M52 108 Q90 100 128 108 L142 222 Q90 234 38 222 Z"
            fill={pal.trim}
            stroke={pal.accent}
            strokeWidth="2"
          />
        )}

        {/* Back hair behind head/neck (tilted slightly on dab) */}
        <g transform={isDabbing ? 'rotate(-16 90 100) translate(-4 6)' : undefined}>
          {hasLongBackHair ? (
            <path
              d={
                config.hairStyle === 'cabello_suelto'
                  ? 'M55 56 C49 86, 48 112, 52 136 L128 136 C132 112, 131 86, 125 56 C119 28, 107 22, 90 22 C73 22, 61 28, 55 56 Z'
                  : 'M58 56 C57 80, 59 94, 64 106 L116 106 C121 94, 123 80, 122 56 C117 28, 105 22, 90 22 C75 22, 63 28, 58 56 Z'
              }
              fill={hair}
            />
          ) : (
            <path
              d="M58 58 C58 32, 71 22, 90 22 C109 22, 122 32, 122 58 C122 70, 118 77, 114 80 L66 80 C62 77, 58 70, 58 58 Z"
              fill={hair}
            />
          )}
        </g>

        {/* LEGS & FOOTWEAR */}
        {config.outfit === 'pollera_manta' ? (
          <g>
            {/* Left & right calves + traditional boots */}
            <g className={isWalking || isDancing ? 'animate-leg-left' : ''}>
              <rect x="66" y="218" width="14" height="30" rx="5" fill={skin} />
              <path
                d="M62 244 L84 244 L86 258 Q73 262 60 258 Z"
                fill="#2C1B12"
                stroke="#140C08"
                strokeWidth="1.5"
              />
              <path d="M60 258 H86" stroke={pal.accent} strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <g className={isWalking || isDancing ? 'animate-leg-right' : ''}>
              <rect x="100" y="218" width="14" height="30" rx="5" fill={skin} />
              <path
                d="M96 244 L118 244 L120 258 Q107 262 94 258 Z"
                fill="#2C1B12"
                stroke="#140C08"
                strokeWidth="1.5"
              />
              <path d="M94 258 H120" stroke={pal.accent} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Pleated Pollera skirt */}
            <path
              d="M57 166 L123 166 L140 224 Q90 236 40 224 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            <path d="M44 214 Q90 225 136 214" fill="none" stroke={pal.accent} strokeWidth="4" />
            <path d="M48 202 Q90 212 132 202" fill="none" stroke={pal.secondary} strokeWidth="2.5" />
            <line x1="74" y1="168" x2="66" y2="225" stroke={pal.trim} strokeOpacity="0.35" strokeWidth="1.5" />
            <line x1="90" y1="168" x2="90" y2="227" stroke={pal.trim} strokeOpacity="0.35" strokeWidth="1.5" />
            <line x1="106" y1="168" x2="114" y2="225" stroke={pal.trim} strokeOpacity="0.35" strokeWidth="1.5" />
          </g>
        ) : (
          <g>
            {/* Trousers & Hiking Boots / Abarcas */}
            <g className={isWalking || isDancing ? 'animate-leg-left' : ''}>
              <path
                d="M64 176 L86 176 L83 244 L63 244 Z"
                fill={trouserColor}
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              <path
                d="M59 242 L85 242 L87 259 Q72 263 57 259 Z"
                fill="#4B2E1A"
                stroke="#23140A"
                strokeWidth="1.6"
              />
              <path d="M58 259 H87" stroke={pal.accent} strokeWidth="2.6" strokeLinecap="round" />
            </g>
            <g className={isWalking || isDancing ? 'animate-leg-right' : ''}>
              <path
                d="M94 176 L116 176 L117 244 L97 244 Z"
                fill={trouserColor}
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              <path
                d="M95 242 L121 242 L123 259 Q109 263 93 259 Z"
                fill="#4B2E1A"
                stroke="#23140A"
                strokeWidth="1.6"
              />
              <path d="M93 259 H122" stroke={pal.accent} strokeWidth="2.6" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* LEFT ARM (viewer left) */}
        {isFlexing ? (
          <g className="animate-arm-flex-left">
            {/* Upper flexed arm with bicep curve */}
            <path
              d="M60 110 Q42 103 27 116 Q26 125 36 128 L60 122 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Forearm raised upward */}
            <path
              d="M27 121 L32 82 L45 85 L40 123 Z"
              fill={skin}
              stroke={skinShadow}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Luchador clenched fist */}
            <circle cx="38" cy="79" r="8.5" fill={skin} stroke={skinShadow} strokeWidth="1.4" />
            <path d="M33 78 H43" stroke={skinShadow} strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ) : isDabbing || isHoldingTrophy ? null : (
          <g
            className={isWalking || isDancing ? 'animate-arm-left' : ''}
            transform={
              isCheering || isJumping
                ? 'rotate(-140 55 114)'
                : isDancing
                  ? 'rotate(-105 55 114)'
                  : isSmiling
                    ? 'rotate(-20 55 114)'
                    : isClimbing
                      ? 'rotate(-118 55 114)'
                      : undefined
            }
          >
            <path
              d="M54 108 L40 156 L54 160 L66 116 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="46" cy="161" r="7.5" fill={skin} stroke={skinShadow} strokeWidth="1" />
          </g>
        )}

        {/* RIGHT ARM (viewer right - holds tools/props when active) */}
        {isFlexing ? (
          <g className="animate-arm-flex-right">
            <path
              d="M120 110 Q138 103 153 116 Q154 125 144 128 L120 122 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M153 121 L148 82 L135 85 L140 123 Z"
              fill={skin}
              stroke={skinShadow}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <circle cx="142" cy="79" r="8.5" fill={skin} stroke={skinShadow} strokeWidth="1.4" />
            <path d="M137 78 H147" stroke={skinShadow} strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ) : isDabbing ? (
          <g>
            {/* Long straight diagonal dab extension to upper-right */}
            <path
              d="M119 109 L169 52 L179 62 L127 121 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="176" cy="54" r="7.5" fill={skin} stroke={skinShadow} strokeWidth="1.2" />
          </g>
        ) : isHoldingTrophy ? null : (
          <g
            className={isWalking || isDancing ? 'animate-arm-right' : ''}
            transform={
              isCheering || isJumping
                ? 'rotate(140 125 114)'
                : isDancing
                  ? 'rotate(78 125 114)'
                  : isSmiling
                    ? 'rotate(20 125 114)'
                    : isClimbing
                      ? 'rotate(122 125 114)'
                      : isPainting
                        ? 'rotate(-42 125 114)'
                        : undefined
            }
          >
            <path
              d="M126 108 L140 156 L126 160 L114 116 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="134" cy="161" r="7.5" fill={skin} stroke={skinShadow} strokeWidth="1" />

            {/* Optional Held Prop */}
            {heldItem === 'brush' && (
              <g transform="translate(132, 146) rotate(24)">
                <rect x="-2" y="-20" width="5" height="32" rx="2" fill="#8C5828" stroke="#42260F" strokeWidth="1" />
                <path d="M-4 -20 L5 -20 L3 -31 L-2 -31 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              </g>
            )}
            {heldItem === 'stone' && (
              <ellipse cx="141" cy="158" rx="9" ry="7" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            )}
            {heldItem === 'basket' && (
              <path
                d="M124 161 L148 161 L144 180 L128 180 Z"
                fill="#D4A359"
                stroke="#785320"
                strokeWidth="1.5"
              />
            )}
            {heldItem === 'compass' && (
              <circle cx="139" cy="161" r="8" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
            )}
          </g>
        )}

        {/* TORSO / OUTFITS */}
        {config.outfit === 'poncho_tejido' && (
          <g>
            {/* Long poncho silhouette with woven V borders & tassels */}
            <path
              d="M42 174 L56 108 Q90 100 124 108 L138 174 L90 194 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M48 158 L90 178 L132 158"
              fill="none"
              stroke={pal.secondary}
              strokeWidth="9"
              strokeLinejoin="round"
            />
            <path
              d="M52 142 L90 161 L128 142"
              fill="none"
              stroke={pal.accent}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <polygon
              points="90,118 98,128 90,138 82,128"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M76 103 L90 115 L104 103"
              fill="none"
              stroke={pal.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Woven waist belt underneath */}
            <rect x="64" y="172" width="52" height="7" rx="2" fill={pal.trim} />
          </g>
        )}

        {config.outfit === 'pollera_manta' && (
          <g>
            {/* Blouse */}
            <path
              d="M56 108 Q90 102 124 108 L122 170 L58 170 Z"
              fill="#F5F0E4"
              stroke="#C9BFA8"
              strokeWidth="1.5"
            />
            {/* Draped woven manta */}
            <path
              d="M51 110 Q90 122 129 110 L132 154 Q90 165 48 154 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            <path d="M50 144 Q90 155 130 144" fill="none" stroke={pal.accent} strokeWidth="4.5" />
            <path d="M51 134 Q90 144 129 134" fill="none" stroke={pal.primary} strokeWidth="3" />
            {/* Silver Tupu */}
            <circle cx="90" cy="121" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="90" cy="121" r="2" fill={pal.accent} />
            <line x1="81" y1="121" x2="99" y2="121" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {config.outfit === 'chaleco_aguayo' && (
          <g>
            {/* Shirt */}
            <path
              d="M58 108 Q90 101 122 108 L120 176 L60 176 Z"
              fill="#EDE6D6"
              stroke="#C4BAA4"
              strokeWidth="1.5"
            />
            {/* Explorer Vest */}
            <path
              d="M57 108 L81 108 L83 176 L58 176 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.6"
            />
            <path
              d="M123 108 L99 108 L97 176 L122 176 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.6"
            />
            <rect x="61" y="136" width="18" height="28" rx="3" fill={pal.secondary} />
            <rect x="101" y="136" width="18" height="28" rx="3" fill={pal.secondary} />
            <line x1="62" y1="146" x2="78" y2="146" stroke={pal.accent} strokeWidth="3" />
            <line x1="102" y1="146" x2="118" y2="146" stroke={pal.accent} strokeWidth="3" />
            {/* Belt */}
            <rect x="59" y="170" width="62" height="8" rx="2" fill={pal.trim} />
            <rect x="85" y="169" width="10" height="10" rx="2" fill={pal.accent} />
          </g>
        )}

        {config.outfit === 'capa_guardian' && (
          <g>
            <path
              d="M56 108 Q90 101 124 108 L120 178 L60 178 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="2"
            />
            <path
              d="M52 109 Q90 128 128 109 L121 130 Q90 146 59 130 Z"
              fill={pal.primary}
              stroke={pal.accent}
              strokeWidth="2"
            />
            <path
              d="M87 123 H93 V126 H96 V132 H93 V135 H87 V132 H84 V126 H87 Z"
              fill={pal.accent}
            />
            <rect x="60" y="169" width="60" height="8" rx="2" fill={pal.accent} stroke={pal.trim} strokeWidth="1" />
          </g>
        )}

        {/* ACCESSORIES */}
        {config.accessory === 'chuspa' && (
          <g>
            <path d="M58 107 L119 164" stroke={pal.accent} strokeWidth="6" strokeLinecap="round" />
            <path d="M58 107 L119 164" stroke={pal.trim} strokeWidth="2" strokeDasharray="4 4" />
            <rect
              x="105"
              y="150"
              width="25"
              height="26"
              rx="4"
              fill={pal.primary}
              stroke={pal.accent}
              strokeWidth="2"
            />
            <line x1="107" y1="160" x2="128" y2="160" stroke={pal.accent} strokeWidth="2.5" />
          </g>
        )}

        {config.accessory === 'bufanda_alpaca' && (
          <g>
            <path
              d="M64 101 Q90 115 116 101 L120 115 Q90 128 60 115 Z"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <rect
              x="73"
              y="112"
              width="14"
              height="38"
              rx="4"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <line x1="75" y1="125" x2="85" y2="125" stroke={pal.primary} strokeWidth="3" />
            <line x1="75" y1="136" x2="85" y2="136" stroke={pal.secondary} strokeWidth="3" />
          </g>
        )}

        {config.accessory === 'collar_plata' && (
          <g>
            <path d="M68 105 Q90 123 112 105" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
            <circle cx="90" cy="116" r="5.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2" />
            <circle cx="90" cy="116" r="2.2" fill={pal.accent} />
          </g>
        )}

        {/* NECK & HEAD (Head tucks slightly downward into elbow during Dab) */}
        <path d="M79 90 L101 90 L103 108 Q90 114 77 108 Z" fill={skin} />
        <path d="M79 92 Q90 100 101 92 L101 98 Q90 104 79 98 Z" fill={skinShadow} />

        <g transform={isDabbing ? 'rotate(-16 90 100) translate(-4 6)' : undefined}>

        {/* Ears */}
        <ellipse cx="60.5" cy="66" rx="5.5" ry="7.5" fill={skinShadow} />
        <ellipse cx="119.5" cy="66" rx="5.5" ry="7.5" fill={skinShadow} />
        <ellipse cx="61" cy="66" rx="3" ry="4.5" fill={skin} />
        <ellipse cx="119" cy="66" rx="3" ry="4.5" fill={skin} />

        {/* Head contour */}
        <path
          d="M61 56 C61 35, 72 27, 90 27 C108 27, 119 35, 119 56 C119 76, 108 93, 90 95 C72 93, 61 76, 61 56 Z"
          fill={skin}
        />

        {/* Cheeks */}
        <ellipse cx="71" cy="71" rx="5.5" ry="3" fill="#D97757" fillOpacity="0.28" />
        <ellipse cx="109" cy="71" rx="5.5" ry="3" fill="#D97757" fillOpacity="0.28" />

        {/* Eyes & Eyebrows */}
        <path d="M69 55 Q75 51.5 82 54.5" fill="none" stroke={hair} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M98 54.5 Q105 51.5 111 55" fill="none" stroke={hair} strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="76" cy="62" rx="5" ry="3.8" fill="#FFFDF9" />
        <ellipse cx="104" cy="62" rx="5" ry="3.8" fill="#FFFDF9" />
        <circle cx="76" cy="62" r="3" fill="#231914" />
        <circle cx="104" cy="62" r="3" fill="#231914" />
        <circle cx="77.1" cy="60.8" r="1.1" fill="#FFFFFF" />
        <circle cx="105.1" cy="60.8" r="1.1" fill="#FFFFFF" />

        {/* Nose & Smile */}
        <path d="M90 62 L88.5 70.5 Q90 72 92 70.5" fill="none" stroke={skinShadow} strokeWidth="1.8" strokeLinecap="round" />
        {isSmiling ? (
          <g>
            <path
              d="M78 76 Q90 91 102 76 Z"
              fill="#FFFDF9"
              stroke="#6B3A23"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M84 82 Q90 86 96 82" fill="none" stroke="#D97757" strokeWidth="1.8" strokeLinecap="round" />
            {/* Joy sparkles beside smiling cheeks */}
            <path d="M49 56 L51 60 L55 62 L51 64 L49 68 L47 64 L43 62 L47 60 Z" fill="#FFD166" />
            <path d="M131 54 L133 58 L137 60 L133 62 L131 66 L129 62 L125 60 L129 58 Z" fill="#FFD166" />
          </g>
        ) : (
          <path
            d={
              isCheering || isDancing || isJumping || isFlexing || isHoldingTrophy
                ? 'M79 77 Q90 89 101 77'
                : 'M81 79.5 Q90 85.5 99 79.5'
            }
            fill="none"
            stroke="#6B3A23"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        )}

        {/* Braids */}
        {hasBraids && (
          <g>
            {[0, 1, 2, 3, 4].map((step) => {
              const ly = 77 + step * 10;
              const lx = 60 - Math.sin(step * 0.4) * 2.5;
              const rx = 120 + Math.sin(step * 0.4) * 2.5;
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
                <rect x="54" y="122" width="9" height="4" rx="2" fill={pal.accent} />
                <circle cx="58.5" cy="128" r="4.5" fill={pal.accent} stroke={pal.trim} strokeWidth="1.3" />
                <circle cx="55" cy="134" r="3.2" fill={pal.secondary} />
                <circle cx="62" cy="134" r="3.2" fill={pal.primary} />
                <rect x="117" y="122" width="9" height="4" rx="2" fill={pal.accent} />
                <circle cx="121.5" cy="128" r="4.5" fill={pal.accent} stroke={pal.trim} strokeWidth="1.3" />
                <circle cx="118" cy="134" r="3.2" fill={pal.secondary} />
                <circle cx="125" cy="134" r="3.2" fill={pal.primary} />
              </g>
            ) : (
              <g>
                <rect x="54" y="121" width="9" height="4.5" rx="2" fill={pal.accent} />
                <rect x="117" y="121" width="9" height="4.5" rx="2" fill={pal.accent} />
              </g>
            )}
          </g>
        )}

        {/* Front Hair */}
        <path
          d={
            hasFullHat
              ? 'M60 53 C62 38, 73 32, 90 34 C107 32, 118 38, 120 53 C112 44, 101 42, 90 46 C79 42, 68 44, 60 53 Z'
              : 'M59 55 C60 30, 73 24, 90 24 C107 24, 120 30, 121 55 C112 42, 101 40, 90 45 C79 40, 68 42, 59 55 Z'
          }
          fill={hair}
        />

        {/* HEADWEAR */}
        {!travelerBadge && config.headwear === 'chullo' && (
          <g>
            <path
              d="M56 49 L51 77 Q56 84 62 76 L64 53 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M124 49 L129 77 Q124 84 118 76 L116 53 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M56 49 Q58 14 90 12 Q122 14 124 49 Q90 41 56 49 Z"
              fill={pal.primary}
              stroke={pal.trim}
              strokeWidth="1.8"
            />
            <path d="M57 41 Q90 35 123 41" fill="none" stroke={pal.accent} strokeWidth="4.5" />
            <path d="M61 29 Q90 24 119 29" fill="none" stroke={pal.secondary} strokeWidth="3.5" />
            <circle cx="90" cy="10" r="6" fill={pal.accent} stroke={pal.trim} strokeWidth="1.5" />
            <line x1="55" y1="80" x2="53" y2="92" stroke={pal.accent} strokeWidth="2.4" strokeLinecap="round" />
            <line x1="125" y1="80" x2="127" y2="92" stroke={pal.accent} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        )}

        {!travelerBadge && config.headwear === 'sombrero_bombin' && (
          <g>
            <path
              d="M60 39 Q62 12 90 12 Q118 12 120 39 Z"
              fill="#2B211A"
              stroke="#140F0C"
              strokeWidth="1.8"
            />
            <path d="M60 35 Q90 38 120 35" fill="none" stroke={pal.accent} strokeWidth="4" />
            <path
              d="M45 39 Q90 46 135 39 Q132 45 90 47 Q48 45 45 39 Z"
              fill="#3B2D23"
              stroke="#140F0C"
              strokeWidth="1.5"
            />
          </g>
        )}

        {!travelerBadge && config.headwear === 'vincha_chakana' && (
          <g>
            <path
              d="M57 41 Q90 35 123 41 L122 48 Q90 43 58 48 Z"
              fill={pal.secondary}
              stroke={pal.trim}
              strokeWidth="1.5"
            />
            <path
              d="M87 35 H93 V37 H95 V43 H93 V45 H87 V43 H85 V37 H87 Z"
              fill={pal.accent}
              stroke={pal.trim}
              strokeWidth="1.2"
            />
          </g>
        )}

        {/* TRAVELER ARCHETYPE BADGE HATS */}
        {travelerBadge === 'cultural' && (
          <g>
            <path
              d="M59 39 Q62 11 90 10 Q118 11 121 39 Z"
              fill="#5C2618"
              stroke="#2C110A"
              strokeWidth="1.8"
            />
            <path d="M60 34 Q90 37 120 34" fill="none" stroke="#F5B700" strokeWidth="4.5" />
            <path
              d="M43 39 Q90 46 137 39 Q134 45 90 48 Q46 45 43 39 Z"
              fill="#421A10"
              stroke="#2C110A"
              strokeWidth="1.5"
            />
            <path
              d="M87 17 H93 V19 H95 V25 H93 V27 H87 V25 H85 V19 H87 Z"
              fill="#FFD166"
              stroke="#7B4824"
              strokeWidth="1.2"
            />
          </g>
        )}

        {travelerBadge === 'aventurero' && (
          <g>
            <path
              d="M60 38 Q64 12 90 13 Q116 12 120 38 Z"
              fill="#4E3824"
              stroke="#24180D"
              strokeWidth="1.8"
            />
            <path d="M60 33 Q90 36 120 33" fill="none" stroke="#1D4E89" strokeWidth="4.5" />
            <path
              d="M40 38 Q90 47 140 37 Q134 44 90 47 Q46 44 40 38 Z"
              fill="#63482F"
              stroke="#24180D"
              strokeWidth="1.5"
            />
            <polygon points="90,14 98,27 82,27" fill="#FFD166" stroke="#24180D" strokeWidth="1.2" />
          </g>
        )}

        {travelerBadge === 'naturaleza' && (
          <g>
            <path
              d="M60 38 Q63 12 90 12 Q117 12 120 38 Z"
              fill="#1E4D3B"
              stroke="#0E2920"
              strokeWidth="1.8"
            />
            <path d="M60 33 Q90 36 120 33" fill="none" stroke="#D9A05B" strokeWidth="4" />
            <path
              d="M41 38 Q90 46 139 38 Q135 44 90 47 Q45 44 41 38 Z"
              fill="#2D6A4F"
              stroke="#0E2920"
              strokeWidth="1.5"
            />
            <path
              d="M111 33 Q123 16 132 17 Q126 29 113 34 Z"
              fill="#74C69D"
              stroke="#0E2920"
              strokeWidth="1.2"
            />
          </g>
        )}

        {travelerBadge === 'comunitario' && (
          <g>
            <path
              d="M59 38 Q62 11 90 11 Q118 11 121 38 Z"
              fill="#8C4B1F"
              stroke="#3D1F0B"
              strokeWidth="1.8"
            />
            <path d="M60 33 Q90 36 120 33" fill="none" stroke="#F5B700" strokeWidth="4.5" />
            <path
              d="M43 38 Q90 46 137 38 Q133 44 90 47 Q47 44 43 38 Z"
              fill="#A65E2E"
              stroke="#3D1F0B"
              strokeWidth="1.5"
            />
            <circle cx="90" cy="22" r="5" fill="#FFD166" stroke="#3D1F0B" strokeWidth="1.2" />
          </g>
        )}
        </g>

        {/* FRONT DABBING LEFT ARM (Bent upward across face so head tucks into elbow) */}
        {isDabbing && (
          <g>
            {/* Upper arm out to left */}
            <path
              d="M58 109 L24 92 L31 79 L64 100 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Forearm crossing upward diagonally in front of face */}
            <path
              d="M25 89 L94 60 L100 72 L32 95 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Hand at the end of the dabbing arm */}
            <circle cx="101" cy="64" r="7" fill={skin} stroke={skinShadow} strokeWidth="1.2" />
            {/* Dab sparkles */}
            <path d="M168 28 L170 33 L175 35 L170 37 L168 42 L166 37 L161 35 L166 33 Z" fill="#FFD166" />
            <path d="M19 64 L21 68 L25 70 L21 72 L19 76 L17 72 L13 70 L17 68 Z" fill="#FFD166" />
          </g>
        )}

        {/* LARGE SHINY GOLDEN TROPHY HELD BY BOTH HANDS */}
        {isHoldingTrophy && (
          <g>
            <defs>
              <linearGradient id="avatarTrophyGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#F5B700" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <radialGradient id="avatarTrophyAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Warm golden halo behind the trophy */}
            <circle cx="90" cy="134" r="52" fill="url(#avatarTrophyAura)" className="animate-pulse" />

            {/* Left arm reaching inward to hold the left trophy handle */}
            <path
              d="M55 110 L35 135 Q33 141 40 144 L63 140 L63 128 L47 132 L63 115 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Right arm reaching inward to hold the right trophy handle */}
            <path
              d="M125 110 L145 135 Q147 141 140 144 L117 140 L117 128 L133 132 L117 115 Z"
              fill={sleeveColor}
              stroke={pal.trim}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Stepped Condor Handles */}
            <path
              d="M65 114 H53 V127 H57 V137 H67"
              fill="none"
              stroke="url(#avatarTrophyGold)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M115 114 H127 V127 H123 V137 H113"
              fill="none"
              stroke="url(#avatarTrophyGold)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Large Ceremonial Kero Cup */}
            <path
              d="M62 104 H118 L110 144 Q106 156 90 157 Q74 156 70 144 Z"
              fill="url(#avatarTrophyGold)"
              stroke="#78350F"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Specular vertical highlight on trophy cup */}
            <path
              d="M69 109 H77 L74 146 Q71 144 70 139 Z"
              fill="#FFFBEB"
              fillOpacity="0.65"
            />

            {/* Woven Aguayo Band across Cup */}
            <path d="M64 114 H116 L114.5 122 H65.5 Z" fill="#8C3B2B" />
            <path
              d="M66.5 118 L73 115 L80 120.5 L90 115 L100 120.5 L107 115 L113.5 118"
              fill="none"
              stroke="#FFD166"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M66 123 H114 L113 128 H67 Z" fill="#1E4D3B" />

            {/* White-Gold Chakana Emblem on Cup */}
            <path
              d="M87 132 H93 V135 H96 V141 H93 V144 H87 V141 H84 V135 H87 Z"
              fill="#FFFBEB"
              stroke="#78350F"
              strokeWidth="1.3"
            />

            {/* Stem & Stepped Andean Trophy Base */}
            <rect x="84" y="156" width="12" height="11" fill="url(#avatarTrophyGold)" stroke="#78350F" strokeWidth="1.6" />
            <path
              d="M72 167 H108 L113 175 H67 Z"
              fill="#7B4824"
              stroke="#F5B700"
              strokeWidth="1.8"
            />
            <path
              d="M63 175 H117 L121 185 H59 Z"
              fill="#1E4D3B"
              stroke="#F5B700"
              strokeWidth="2"
            />
            <polygon points="90,176.5 94.5,180 90,183.5 85.5,180" fill="#FFD166" />

            {/* Avatar Hands Clasping the Trophy Sides */}
            <circle cx="62" cy="134" r="7.5" fill={skin} stroke={skinShadow} strokeWidth="1.3" />
            <circle cx="118" cy="134" r="7.5" fill={skin} stroke={skinShadow} strokeWidth="1.3" />

            {/* Gleaming Sparkle Stars */}
            <path
              d="M46 102 L48.5 107.5 L54 110 L48.5 112.5 L46 118 L43.5 112.5 L38 110 L43.5 107.5 Z"
              fill="#FEF08A"
              className="animate-pulse"
            />
            <path
              d="M135 98 L137.5 103.5 L143 106 L137.5 108.5 L135 114 L132.5 108.5 L127 106 L132.5 103.5 Z"
              fill="#FEF08A"
              className="animate-pulse"
            />
            <path
              d="M90 88 L92 92 L96 94 L92 96 L90 100 L88 96 L84 94 L88 92 Z"
              fill="#FFFFFF"
            />
          </g>
        )}
      </g>
    </svg>
  );
};
