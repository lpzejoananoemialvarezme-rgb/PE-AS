import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface PizzaCraftMiniGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

interface Ingredient {
  id: string;
  label: string;
  color: string;
}

const RECIPE_ORDER: Ingredient[] = [
  { id: 'masa', label: '1. Masa Madre de Altura', color: '#E6C288' },
  { id: 'salsa', label: '2. Salsa con Huacatay', color: '#C0392B' },
  { id: 'queso', label: '3. Queso Fresco Andino', color: '#FFF8E7' },
  { id: 'tomate', label: '4. Tomates y Aceitunas', color: '#2D6A4F' },
  { id: 'quinua', label: '5. Quinua Crocante', color: '#F5B700' }
];

const SHUFFLED_BUTTONS: Ingredient[] = [
  RECIPE_ORDER[2],
  RECIPE_ORDER[0],
  RECIPE_ORDER[4],
  RECIPE_ORDER[1],
  RECIPE_ORDER[3]
];

export const PizzaCraftMiniGame: React.FC<PizzaCraftMiniGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const [addedIds, setAddedIds] = useState<string[]>(
    alreadySolved ? RECIPE_ORDER.map((r) => r.id) : []
  );
  const [phase, setPhase] = useState<'PREP' | 'OVEN' | 'DONE'>(alreadySolved ? 'DONE' : 'PREP');
  const [heatPos, setHeatPos] = useState(15);
  const heatDirRef = React.useRef(1);
  const [feedback, setFeedback] = useState(
    'Sigue el orden de la receta de la cafetería de Peñas (del 1 al 5) para armar tu pizza artesanal.'
  );

  useEffect(() => {
    if (phase !== 'OVEN') return;
    const timer = window.setInterval(() => {
      setHeatPos((prev) => {
        const next = prev + heatDirRef.current * 4;
        if (next >= 96) {
          heatDirRef.current = -1;
          return 96;
        }
        if (next <= 4) {
          heatDirRef.current = 1;
          return 4;
        }
        return next;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [phase]);

  const handleIngredientClick = (ing: Ingredient) => {
    if (phase !== 'PREP') return;
    const expected = RECIPE_ORDER[addedIds.length];
    if (ing.id === expected.id) {
      soundEngine.playTileSwap();
      const next = [...addedIds, ing.id];
      setAddedIds(next);
      if (next.length === RECIPE_ORDER.length) {
        setPhase('OVEN');
        setFeedback('¡Lista para el horno de barro! Presiona "Sacar del Horno" dentro de la zona dorada (35–65).');
      } else {
        setFeedback(`¡Perfecto! Agregaste ${ing.label}.`);
      }
    } else {
      soundEngine.playWrong();
      setFeedback(`Ese paso va después. Primero toca: ${expected.label}.`);
    }
  };

  const handleBakeStop = () => {
    if (phase !== 'OVEN') return;
    if (heatPos >= 34 && heatPos <= 66) {
      soundEngine.playRelicUnlock();
      setPhase('DONE');
      setFeedback('¡Pizza artesanal dorada a la perfección! Tu vale en la cafetería de Peñas te espera.');
      onSolved();
    } else {
      soundEngine.playWrong();
      setFeedback('Casi: espera a que el indicador pase por el centro dorado (35–65) y vuelve a presionar.');
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setAddedIds([]);
    setPhase('PREP');
    setHeatPos(15);
    setFeedback('Sigue el orden de la receta de la cafetería de Peñas (del 1 al 5) para armar tu pizza artesanal.');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center rounded-2xl border border-[#D9A05B]/40 bg-[#081523] p-4">
        {/* Visual Artisanal Pizza SVG */}
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 160 160" className="w-40 h-40" aria-label="Pizza artesanal de Peñas">
            {/* Wooden Paddle */}
            <rect x="70" y="132" width="20" height="24" rx="4" fill="#6B4423" />
            <circle cx="80" cy="80" r="66" fill="#8C5A2B" stroke="#D9A05B" strokeWidth="2" />

            {/* 1. Dough */}
            {addedIds.includes('masa') && (
              <circle cx="80" cy="80" r="56" fill="#E6C288" stroke="#C49A5B" strokeWidth="5" />
            )}
            {/* 2. Huacatay Tomato Sauce */}
            {addedIds.includes('salsa') && (
              <circle cx="80" cy="80" r="48" fill="#C0392B" />
            )}
            {/* 3. Andean Cheese */}
            {addedIds.includes('queso') && (
              <circle cx="80" cy="80" r="44" fill="#FFF3D1" fillOpacity="0.92" />
            )}
            {/* 4. Tomatoes & Olives */}
            {addedIds.includes('tomate') && (
              <g>
                <circle cx="62" cy="60" r="6" fill="#DC2626" />
                <circle cx="98" cy="62" r="6" fill="#DC2626" />
                <circle cx="65" cy="96" r="6" fill="#DC2626" />
                <circle cx="96" cy="95" r="6" fill="#DC2626" />
                <circle cx="80" cy="78" r="5" fill="#1E4D3B" />
                <circle cx="52" cy="80" r="4.5" fill="#1E4D3B" />
                <circle cx="106" cy="80" r="4.5" fill="#1E4D3B" />
              </g>
            )}
            {/* 5. Crispy Quinoa */}
            {addedIds.includes('quinua') && (
              <g fill="#F5B700">
                <circle cx="72" cy="52" r="2.2" />
                <circle cx="88" cy="54" r="2.2" />
                <circle cx="58" cy="72" r="2.2" />
                <circle cx="100" cy="74" r="2.2" />
                <circle cx="74" cy="104" r="2.2" />
                <circle cx="89" cy="102" r="2.2" />
                <circle cx="80" cy="66" r="2.2" />
              </g>
            )}
            {/* Golden Baked Glow */}
            {phase === 'DONE' && (
              <circle cx="80" cy="80" r="56" fill="#F5B700" fillOpacity="0.18" stroke="#F5B700" strokeWidth="3" />
            )}
          </svg>

          <span className="text-[11px] font-mono-num text-[#D9A05B]">
            Ingredientes: {addedIds.length}/5
          </span>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {phase === 'PREP' && (
            <div className="grid grid-cols-1 gap-2">
              {SHUFFLED_BUTTONS.map((ing) => {
                const isAdded = addedIds.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleIngredientClick(ing)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-colors ${
                      isAdded
                        ? 'bg-[#1E4D3B]/65 border-[#52B788] text-[#A7F3D0]'
                        : 'bg-[#0D2134] hover:bg-[#17334E] border-white/15 text-[#FFF8E7] cursor-pointer'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/30"
                      style={{ backgroundColor: ing.color }}
                    />
                    <span className="flex-1">{ing.label}</span>
                    {isAdded && <CheckCircle2 className="w-4 h-4 text-[#52B788]" />}
                  </button>
                );
              })}
            </div>
          )}

          {phase === 'OVEN' && (
            <div className="space-y-3.5 bg-[#112A3E] border border-[#F5B700]/45 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#F5B700]">
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  Horno de Barro de Peñas
                </span>
                <span className="font-mono-num">{heatPos}°</span>
              </div>

              {/* Thermal Gauge */}
              <div className="relative h-6 w-full rounded-full bg-[#081523] border border-white/15 overflow-hidden">
                {/* Golden Sweet Spot (34% to 66%) */}
                <div
                  className="absolute inset-y-0 bg-[#F5B700]/40 border-x-2 border-[#FFD166]"
                  style={{ left: '34%', width: '32%' }}
                />
                {/* Moving Needle */}
                <div
                  className="absolute inset-y-0 w-2 bg-[#FFF8E7] rounded-full shadow"
                  style={{ left: `calc(${heatPos}% - 4px)` }}
                />
              </div>

              <button
                type="button"
                onClick={handleBakeStop}
                className="w-full py-3 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm cursor-pointer transition-colors"
              >
                ¡Sacar del Horno en Punto Dorado!
              </button>
            </div>
          )}

          {phase === 'DONE' && (
            <div className="space-y-3 bg-[#1E4D3B]/45 border border-[#52B788] rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#ECFDF5]">
                <CheckCircle2 className="w-5 h-5 text-[#52B788]" />
                <span>¡Pizza del Guardián Horneada!</span>
              </div>
              <p className="text-xs text-[#D8D3C8]">
                Has dominado el orden artesanal y el calor justo del horno de Peñas.
              </p>
              {!alreadySolved && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-[#D9A05B] hover:text-[#FFD166] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Volver a hornear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <p className="text-xs sm:text-sm text-[#E2DDD2] bg-[#112A3E] border border-white/10 rounded-xl px-4 py-2.5">
        {feedback}
      </p>
    </div>
  );
};
