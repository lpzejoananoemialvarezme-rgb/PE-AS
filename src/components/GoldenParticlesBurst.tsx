import React from 'react';

interface GoldenParticlesBurstProps {
  /** Change this value to replay the burst animation */
  burstKey?: number | string;
  /** Number of golden particles to radiate outward */
  density?: 'compact' | 'rich';
}

interface ParticleSpec {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  star: boolean;
}

const COMPACT_PARTICLES: ParticleSpec[] = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + (i % 2 === 0 ? 0.12 : -0.1);
  const dist = 30 + (i % 3) * 14;
  return {
    id: i,
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    rot: (i % 2 === 0 ? 1 : -1) * (65 + i * 11),
    size: i % 3 === 0 ? 9 : i % 2 === 0 ? 6 : 4,
    delay: (i % 4) * 0.045,
    duration: 0.95 + (i % 3) * 0.18,
    color: i % 3 === 0 ? '#FFD166' : i % 3 === 1 ? '#F5B700' : '#FFF3B0',
    star: i % 3 === 0
  };
});

const RICH_PARTICLES: ParticleSpec[] = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2 + (i % 2 === 0 ? 0.08 : -0.08);
  const dist = 38 + (i % 4) * 14;
  return {
    id: i,
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    rot: (i % 2 === 0 ? 1 : -1) * (80 + i * 14),
    size: i % 3 === 0 ? 10 : i % 2 === 0 ? 7 : 5,
    delay: (i % 5) * 0.04,
    duration: 1.0 + (i % 4) * 0.18,
    color: i % 4 === 0 ? '#FFF3B0' : i % 2 === 0 ? '#FFD166' : '#F5B700',
    star: i % 2 === 0
  };
});

export const GoldenParticlesBurst: React.FC<GoldenParticlesBurstProps> = ({
  burstKey = 0,
  density = 'compact'
}) => {
  const particles = density === 'rich' ? RICH_PARTICLES : COMPACT_PARTICLES;

  return (
    <span
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-20"
    >
      {/* Expanding Golden Shockwave Halo */}
      <span className="absolute w-12 h-12 rounded-full border-2 border-[#FFD166]/85 shadow-[0_0_20px_rgba(245,183,0,0.65)] animate-golden-ring" />
      <span
        className="absolute w-10 h-10 rounded-full border border-[#FFF3B0]/70 animate-golden-ring"
        style={{ animationDelay: '0.12s' }}
      />

      {/* Radial Golden Sparks & Stars */}
      {particles.map((p) => {
        const style = {
          '--px': `${p.dx}px`,
          '--py': `${p.dy}px`,
          '--pr': `${p.rot}deg`,
          '--pd': `${p.duration}s`,
          '--pdelay': `${p.delay}s`,
          width: `${p.size}px`,
          height: `${p.size}px`
        } as React.CSSProperties;

        if (p.star) {
          return (
            <svg
              key={p.id}
              viewBox="0 0 16 16"
              style={style}
              className="absolute animate-golden-particle drop-shadow-[0_0_6px_rgba(255,209,102,0.85)]"
            >
              <path
                d="M8 0 L9.9 6.1 L16 8 L9.9 9.9 L8 16 L6.1 9.9 L0 8 L6.1 6.1 Z"
                fill={p.color}
              />
            </svg>
          );
        }

        return (
          <span
            key={p.id}
            style={{ ...style, backgroundColor: p.color }}
            className="absolute rounded-full animate-golden-particle shadow-[0_0_8px_rgba(245,183,0,0.9)]"
          />
        );
      })}
    </span>
  );
};
