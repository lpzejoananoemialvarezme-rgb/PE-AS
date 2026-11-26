import React, { useEffect, useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { ASSETS, DEFAULT_STAGES } from '../data/defaultStages';
import { AvatarConfig } from '../types/game';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface PenasDetailedTrailPreviewProps {
  playerAvatar: AvatarConfig;
  playerName?: string;
}

const PREVIEW_STOPS = DEFAULT_STAGES.map((stage) => ({
  id: stage.id,
  shortTitle:
    stage.id === 1
      ? 'Plaza Principal'
      : stage.id === 2
        ? 'Templo Colonial'
        : stage.id === 3
          ? 'Camino de Piedra'
          : stage.id === 4
            ? 'Cueva Kunkuntiji'
            : stage.id === 5
              ? 'Cueva Qillqantiji'
              : stage.id === 6
                ? 'Cerro Calvario'
                : 'Escalada y Mirador',
  x: stage.mapPosition.x,
  y: stage.mapPosition.y
}));

export const PenasDetailedTrailPreview: React.FC<PenasDetailedTrailPreviewProps> = ({
  playerAvatar,
  playerName
}) => {
  const [mapError, setMapError] = useState(false);
  const [activeStopIdx, setActiveStopIdx] = useState(0);
  const [facing, setFacing] = useState<'right' | 'left'>('right');

  // Smoothly walk the customized avatar along the 7 Peñas locations on the detailed map
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStopIdx((prev) => {
        const next = (prev + 1) % PREVIEW_STOPS.length;
        const currStop = PREVIEW_STOPS[prev];
        const nextStop = PREVIEW_STOPS[next];
        if (nextStop && currStop && Math.abs(nextStop.x - currStop.x) > 0.5) {
          setFacing(nextStop.x >= currStop.x ? 'right' : 'left');
        }
        return next;
      });
    }, 1500);
    return () => window.clearInterval(timer);
  }, []);

  const currentStop = PREVIEW_STOPS[activeStopIdx] || PREVIEW_STOPS[0];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-amber-400/35 bg-[#091827]/95 shadow-2xl">
      {/* Top Detailed Peñas Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/15 bg-slate-950/75 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 font-semibold text-amber-300">
          <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mapa Detallado de Peñas · Ruta de las 7 Etapas</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E4D3B]/65 border border-[#52B788]/45 px-2.5 py-1 text-[11px] font-semibold text-[#ECFDF5]">
          <MapPin className="w-3.5 h-3.5 text-[#F5B700]" />
          <span>
            Etapa {currentStop.id}/7: {currentStop.shortTitle}
          </span>
        </div>
      </div>

      {/* Illustrated Detailed Peñas Map with Walking Full-Body Avatar */}
      <div className="relative w-full aspect-[16/9.2] min-h-[235px] sm:min-h-[290px] bg-[#0B1D2E] overflow-hidden">
        {!mapError ? (
          <img
            src={ASSETS.EPIC_MAP}
            alt="Mapa detallado de las 7 locaciones de Peñas desde la Plaza Principal hasta el Parque de Escalada"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setMapError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F2C4C] via-[#1E4D3B] to-[#6B4423]" />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06111D]/65 via-transparent to-[#06111D]/25"
        />

        {/* SVG Trail Path Linking the 7 Locations */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full"
        >
          <polyline
            fill="none"
            stroke="#081523"
            strokeWidth="1.6"
            strokeOpacity="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={PREVIEW_STOPS.map((s) => `${s.x},${s.y}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#F5B700"
            strokeWidth="0.75"
            strokeDasharray="1.8 1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={PREVIEW_STOPS.map((s) => `${s.x},${s.y}`).join(' ')}
            className="animate-route-dash"
          />
        </svg>

        {/* 7 Stage Numbered Location Markers */}
        {PREVIEW_STOPS.map((stop, idx) => {
          const isReached = idx <= activeStopIdx;
          const isCurrent = idx === activeStopIdx;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => {
                setFacing(stop.x >= currentStop.x ? 'right' : 'left');
                setActiveStopIdx(idx);
              }}
              style={{
                left: `${stop.x}%`,
                top: `${stop.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              aria-label={`Etapa ${stop.id}: ${stop.shortTitle}`}
              className="group absolute z-10 flex flex-col items-center cursor-pointer"
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center font-mono-num text-[11px] font-bold shadow-lg transition-all ${
                  isCurrent
                    ? 'bg-[#F5B700] border-[#FFF8E7] text-[#1A1207] scale-115 ring-4 ring-[#F5B700]/35'
                    : isReached
                      ? 'bg-[#2D6A4F] border-[#A7F3D0] text-[#FFF8E7]'
                      : 'bg-[#081523]/90 border-[#D9A05B]/70 text-[#FFD166]'
                }`}
              >
                {stop.id}
              </span>
              <span
                className={`mt-1 hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow ${
                  isCurrent
                    ? 'bg-[#F5B700] text-[#1A1207]'
                    : 'bg-[#081523]/88 text-[#FFF8E7] border border-white/15'
                }`}
              >
                {stop.shortTitle}
              </span>
            </button>
          );
        })}

        {/* Customized Full-Body Avatar Actively Walking Across the 7 Stages of Peñas */}
        <div
          className="pointer-events-none absolute z-20 flex flex-col items-center"
          style={{
            left: `${currentStop.x}%`,
            top: `${currentStop.y}%`,
            transform: 'translate(-50%, -94%)',
            transition: 'left 1.15s cubic-bezier(0.22, 1, 0.36, 1), top 1.15s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
          aria-hidden="true"
        >
          <AymaraFullBodyAvatar
            config={playerAvatar}
            pose="walk"
            walking
            facing={facing}
            className="w-12 h-[74px] sm:w-14 sm:h-[88px] drop-shadow-[0_6px_14px_rgba(0,0,0,0.8)]"
            showGroundShadow
          />
          {playerName && (
            <span className="-mt-1 rounded-md bg-slate-950/92 border border-amber-400/55 px-2 py-0.5 text-[10px] font-bold text-amber-200 shadow whitespace-nowrap">
              {playerName}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Legend Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#07131F] px-4 py-2 text-[11px] sm:text-xs text-[#D8D3C8]">
        <span>
          <strong className="text-[#FFD166]">Inicio:</strong> 1. Plaza Principal (3.970 m)
        </span>
        <span className="text-[#52B788] font-semibold">
          Tu avatar irá caminando por las 7 etapas al desbloquear cada locación →
        </span>
        <span>
          <strong className="text-[#FFD166]">Meta:</strong> 7. Parque de Escalada y Mirador
        </span>
      </div>
    </div>
  );
};
