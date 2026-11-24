import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { soundEngine } from '../utils/sound';

interface CalvarioCrossesGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

interface HiddenCross {
  id: string;
  label: string;
  fact: string;
  x: number; // percentage
  y: number; // percentage
  rotate: number;
}

const HIDDEN_CROSSES: HiddenCross[] = [
  {
    id: 'c1',
    label: 'Cruz del Camino Bajo',
    fact: 'Marca la primera estación donde los peregrinos descansan al iniciar el ascenso al Calvario.',
    x: 20,
    y: 74,
    rotate: -4
  },
  {
    id: 'c2',
    label: 'Cruz de la Peñasca',
    fact: 'Erigida sobre un afloramiento rocoso mirando hacia la plaza de Peñas.',
    x: 42,
    y: 48,
    rotate: 3
  },
  {
    id: 'c3',
    label: 'Cruz de las Ruinas del Carmen',
    fact: 'Vigila los muros históricos de la antigua capilla del Carmen entre piedra y adobe.',
    x: 68,
    y: 56,
    rotate: -2
  },
  {
    id: 'c4',
    label: 'Cruz de la Cumbre del Calvario',
    fact: 'Corona la cima del cerro, donde se agradece a la Pachamama por un buen camino.',
    x: 84,
    y: 30,
    rotate: 2
  }
];

export const CalvarioCrossesGame: React.FC<CalvarioCrossesGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const [foundIds, setFoundIds] = useState<string[]>(
    alreadySolved ? HIDDEN_CROSSES.map((c) => c.id) : []
  );
  const [lastFact, setLastFact] = useState(
    alreadySolved
      ? 'Has encontrado las 4 cruces del camino procesional del Calvario y las Ruinas del Carmen.'
      : 'Explora el cerro rocoso y las ruinas para encontrar las 4 cruces procesionales ocultas.'
  );
  const [hintTargetId, setHintTargetId] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number; label: 'near' | 'warm' | 'cold' } | null>(null);
  const [imgError, setImgError] = useState(false);

  const solved = foundIds.length >= HIDDEN_CROSSES.length;

  const handleFind = (cross: HiddenCross, e: React.MouseEvent) => {
    e.stopPropagation();
    if (foundIds.includes(cross.id)) return;
    const next = [...foundIds, cross.id];
    setFoundIds(next);
    setHintTargetId(null);
    setRipple(null);
    setLastFact(`${cross.label}: ${cross.fact}`);
    if (next.length >= HIDDEN_CROSSES.length) {
      soundEngine.playRelicUnlock();
    } else {
      soundEngine.playTileSwap();
    }
  };

  const handleSceneTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (solved) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const clickY = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;

    const remaining = HIDDEN_CROSSES.filter((c) => !foundIds.includes(c.id));
    if (remaining.length === 0) return;

    let minDist = Infinity;
    for (const c of remaining) {
      const d = Math.hypot(clickX - c.x, clickY - c.y);
      if (d < minDist) minDist = d;
    }

    soundEngine.playClick();
    if (minDist <= 16) {
      setRipple({ x: clickX, y: clickY, key: Date.now(), label: 'near' });
      setLastFact('¡Muy cerca! Observa con atención las rocas justo alrededor de donde tocaste.');
    } else if (minDist <= 30) {
      setRipple({ x: clickX, y: clickY, key: Date.now(), label: 'warm' });
      setLastFact('Tibio: una de las cruces del camino procesional está en este sector del cerro.');
    } else {
      setRipple({ x: clickX, y: clickY, key: Date.now(), label: 'cold' });
      setLastFact('Frío: busca en otras peñas o muros del cerro (puedes usar la Brújula de Tata).');
    }
  };

  const handleHint = () => {
    const remaining = HIDDEN_CROSSES.find((c) => !foundIds.includes(c.id));
    if (!remaining) return;
    soundEngine.playClick();
    setHintTargetId(remaining.id);
    setLastFact(`Pista de Tata: observa cerca de «${remaining.label}» en el cerro.`);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setFoundIds([]);
    setHintTargetId(null);
    setRipple(null);
    setLastFact('Explora el cerro rocoso y las ruinas para encontrar las 4 cruces procesionales ocultas.');
  };

  return (
    <div className="space-y-3">
      {/* Header Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
        <div className="font-mono-num text-[#E2DDD2]">
          Cruces encontradas:{' '}
          <strong className="text-[#F5B700]">
            {foundIds.length}/{HIDDEN_CROSSES.length}
          </strong>
        </div>

        <div className="flex items-center gap-2">
          {!solved && (
            <>
              <button
                type="button"
                onClick={handleHint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4E89] hover:bg-[#2563EB] text-xs font-semibold text-[#FFF8E7] cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#FFD166]" />
                Brújula de Tata
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
                Reiniciar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Illustrated Rocky Hill Search Scene */}
      <div
        onClick={handleSceneTap}
        className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-[#D9A05B]/50 bg-[#1B1816] shadow-2xl select-none cursor-crosshair"
      >
        {!imgError ? (
          <img
            src={ASSETS.CALVARIO_CARMEN}
            alt="Cerro Calvario y Ruinas del Carmen en Peñas"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2B3A4A] via-[#5C4938] to-[#261B12]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081523]/55 via-transparent to-[#081523]/25" />

        {/* Tap proximity ripple */}
        {ripple && (
          <span
            key={ripple.key}
            aria-hidden="true"
            style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 animate-ping ${
              ripple.label === 'near'
                ? 'border-[#F5B700]'
                : ripple.label === 'warm'
                  ? 'border-[#4EA8DE]'
                  : 'border-white/50'
            }`}
          />
        )}

        {/* 4 Integrated Hidden Crosses */}
        {HIDDEN_CROSSES.map((cross) => {
          const isFound = foundIds.includes(cross.id);
          const isHinted = hintTargetId === cross.id && !isFound;

          return (
            <button
              key={cross.id}
              type="button"
              onClick={(e) => handleFind(cross, e)}
              aria-label={isFound ? cross.label : 'Posible cruz escondida en el cerro'}
              style={{
                left: `${cross.x}%`,
                top: `${cross.y}%`,
                transform: `translate(-50%, -50%) rotate(${cross.rotate}deg)`
              }}
              className={`group absolute w-12 h-14 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isFound
                  ? 'scale-110'
                  : isHinted
                    ? 'ring-2 ring-[#F5B700] bg-[#F5B700]/20 animate-pulse'
                    : 'hover:scale-110'
              }`}
            >
              {/* Tactile Processional Cross SVG blended with stone/wood patina until found */}
              <svg
                viewBox="0 0 36 48"
                className={`w-8 h-11 transition-all duration-300 ${
                  isFound
                    ? 'drop-shadow-[0_0_12px_rgba(245,183,0,0.95)]'
                    : 'opacity-70 group-hover:opacity-95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)]'
                }`}
                aria-hidden="true"
              >
                {/* Pedestal stones */}
                <ellipse cx="18" cy="43" rx="11" ry="3.5" fill={isFound ? '#D9A05B' : '#4E463E'} />
                {/* Vertical & Horizontal beams */}
                <rect
                  x="15"
                  y="5"
                  width="6"
                  height="38"
                  rx="1.5"
                  fill={isFound ? '#F5B700' : '#5E4E40'}
                  stroke={isFound ? '#FFF8E7' : '#29211A'}
                  strokeWidth="1.4"
                />
                <rect
                  x="6"
                  y="14"
                  width="24"
                  height="5.5"
                  rx="1.5"
                  fill={isFound ? '#F5B700' : '#5E4E40'}
                  stroke={isFound ? '#FFF8E7' : '#29211A'}
                  strokeWidth="1.4"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* 4-Station Progress Strip cleanly below photo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {HIDDEN_CROSSES.map((cross) => {
          const isFound = foundIds.includes(cross.id);
          return (
            <div
              key={`st-${cross.id}`}
              className={`rounded-lg border px-2.5 py-2 text-[11px] flex items-center gap-1.5 ${
                isFound
                  ? 'bg-[#1E4D3B]/60 border-[#52B788]/70 text-[#ECFDF5] font-semibold'
                  : 'bg-[#081523] border-white/10 text-[#9FB3C8]'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${isFound ? 'text-[#F5B700]' : 'text-[#475569]'}`}
              />
              <span className="truncate">{cross.label}</span>
            </div>
          );
        })}
      </div>

      {/* Fact / Progress Bar */}
      <div
        className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm border ${
          solved
            ? 'bg-gradient-to-r from-[#1E4D3B]/80 via-[#17334E]/85 to-[#2B1D0E]/85 border-[#F5B700]/65'
            : 'bg-[#081523] border-white/10 text-[#D8D3C8]'
        }`}
      >
        {solved ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>¡4 Cruces del Calvario encontradas!</span>
              </div>
              <p className="text-xs text-[#E2DDD2]">
                <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
                {lastFact}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playRelicUnlock();
                onSolved();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm whitespace-nowrap cursor-pointer shadow-lg shrink-0"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span>{lastFact}</span>
        )}
      </div>
    </div>
  );
};
