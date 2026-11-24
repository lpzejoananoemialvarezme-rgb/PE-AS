import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface AnimatedSceneBannerProps {
  imageUrl: string;
  alt: string;
  title?: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

const MOTES = [
  { left: '16%', top: '62%', delay: '0s', size: 5 },
  { left: '34%', top: '42%', delay: '1.4s', size: 4 },
  { left: '58%', top: '68%', delay: '2.6s', size: 6 },
  { left: '74%', top: '38%', delay: '0.8s', size: 4 },
  { left: '84%', top: '56%', delay: '3.2s', size: 5 }
];

export const AnimatedSceneBanner: React.FC<AnimatedSceneBannerProps> = ({
  imageUrl,
  alt,
  title,
  caption,
  className = '',
  aspectClass = 'aspect-[16/9]'
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-[#D9A05B]/40 bg-[#081523] shadow-lg ${aspectClass} ${className}`}
    >
      {!imgError ? (
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover animate-ken-burns will-change-transform"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#0F2C4C] via-[#1E4D3B] to-[#6B4423] flex flex-col items-center justify-center gap-2 p-4 text-center">
          <Mountain className="w-8 h-8 text-[#F5B700]" />
          {title && <span className="text-sm font-bold text-[#FFF8E7]">{title}</span>}
        </div>
      )}

      {/* Atmospheric Sunbeam Sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 left-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-[#FFD166]/25 to-transparent animate-sun-sweep"
      />

      {/* Ambient Floating Golden Motes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {MOTES.map((m, idx) => (
          <span
            key={idx}
            style={{
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              animationDelay: m.delay
            }}
            className="absolute rounded-full bg-[#FFD166] blur-[0.5px] animate-mote-float"
          />
        ))}
      </div>

      {/* Measured Bottom Legibility Scrim */}
      {(title || caption) && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060F19]/95 via-[#060F19]/65 to-transparent px-4 pt-8 pb-3">
          {title && <div className="text-xs sm:text-sm font-bold text-[#F5B700]">{title}</div>}
          {caption && <p className="text-[11px] sm:text-xs text-[#F5F1E8] leading-snug mt-0.5">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
};
