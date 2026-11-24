import React, { useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface MemoryMatchGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

interface CardItem {
  pairId: string;
  title: string;
  fact: string;
}

const PAIRS: CardItem[] = [
  {
    pairId: 'condor',
    title: 'Cóndor Andino',
    fact: 'El cóndor planea sobre las corrientes térmicas de Peñas superando los 3 metros de envergadura.'
  },
  {
    pairId: 'koa',
    title: "K'oa Andina",
    fact: "Planta aromática ceremonial usada en las ofrendas a la Pachamama dentro de las cuevas y apachetas."
  },
  {
    pairId: 'vizcacha',
    title: 'Vizcacha',
    fact: 'Roedor andino de orejas largas que habita entre las grietas de las rocas graníticas al amanecer.'
  },
  {
    pairId: 'yareta',
    title: 'Yareta',
    fact: 'Planta compacta de crecimiento milenario que resiste las heladas extremas sobre los 4.000 metros.'
  },
  {
    pairId: 'llama',
    title: 'Llama',
    fact: 'Camélido andino fundamental en la vida pastoral, textil y ceremonial de las comunidades.'
  },
  {
    pairId: 'zampona',
    title: 'Zampoña',
    fact: 'Instrumento de cañas que suena en diálogo comunitario durante las festividades de Peñas.'
  }
];

interface DeckCard extends CardItem {
  uid: number;
}

function buildShuffledDeck(): DeckCard[] {
  const doubled = [...PAIRS, ...PAIRS].map((item, idx) => ({ ...item, uid: idx }));
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

const CardSymbolSvg: React.FC<{ pairId: string }> = ({ pairId }) => {
  switch (pairId) {
    case 'condor':
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <path d="M4 22 Q16 10 24 20 Q32 10 44 22 L30 27 L24 38 L18 27 Z" fill="#1B1817" stroke="#FFF8E7" strokeWidth="1.5" />
          <path d="M19 25 Q24 29 29 25" stroke="#FFF8E7" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'koa':
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <path d="M24 41 V16" stroke="#8C6D46" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M24 34 L14 22 M24 28 L34 18 M24 22 L17 12" stroke="#8C6D46" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="14" cy="21" rx="4.5" ry="2.2" transform="rotate(-35 14 21)" fill="#A7C957" />
          <ellipse cx="34" cy="18" rx="4.5" ry="2.2" transform="rotate(30 34 18)" fill="#7B9E62" />
          <ellipse cx="18" cy="12" rx="4.5" ry="2.2" transform="rotate(-25 18 12)" fill="#A7C957" />
          <circle cx="24" cy="11" r="4" fill="#FFF3B0" />
          <circle cx="32" cy="14" r="2.8" fill="#E8DEC8" />
        </svg>
      );
    case 'vizcacha':
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="29" rx="11" ry="9" fill="#A67449" stroke="#FFF8E7" strokeWidth="1.3" />
          <ellipse cx="19" cy="14" rx="3" ry="8" fill="#8C5A2B" stroke="#FFF8E7" strokeWidth="1.2" />
          <ellipse cx="29" cy="14" rx="3" ry="8" fill="#8C5A2B" stroke="#FFF8E7" strokeWidth="1.2" />
          <circle cx="20" cy="26" r="1.8" fill="#1B1817" />
          <circle cx="28" cy="26" r="1.8" fill="#1B1817" />
        </svg>
      );
    case 'yareta':
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <path d="M8 34 Q10 16 24 16 Q38 16 40 34 Z" fill="#2D6A4F" stroke="#74C69D" strokeWidth="1.8" />
          <circle cx="18" cy="25" r="2.2" fill="#74C69D" />
          <circle cx="25" cy="22" r="2.5" fill="#74C69D" />
          <circle cx="31" cy="27" r="2" fill="#74C69D" />
        </svg>
      );
    case 'llama':
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <path d="M16 38 V26 L20 12 L24 8 L26 12 L25 22 H34 V38" stroke="#FFF8E7" strokeWidth="2" fill="#C8926E" strokeLinejoin="round" />
          <circle cx="22" cy="14" r="1.5" fill="#1B1817" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" aria-hidden="true">
          <rect x="11" y="10" width="4" height="28" rx="1.5" fill="#D9A05B" />
          <rect x="17" y="12" width="4" height="24" rx="1.5" fill="#F5B700" />
          <rect x="23" y="14" width="4" height="20" rx="1.5" fill="#52B788" />
          <rect x="29" y="16" width="4" height="16" rx="1.5" fill="#4EA8DE" />
          <rect x="10" y="18" width="24" height="3.5" rx="1" fill="#8C5A2B" />
        </svg>
      );
  }
};

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const [deck, setDeck] = useState<DeckCard[]>(() => buildShuffledDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>(
    alreadySolved ? PAIRS.map((p) => p.pairId) : []
  );
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lastFact, setLastFact] = useState<string>(
    "Voltea las piedras talladas de la Cueva Kunkuntiji para emparejar las 6 parejas sagradas."
  );

  const handleFlip = (idx: number) => {
    if (isLocked) return;
    const card = deck[idx];
    if (matchedIds.includes(card.pairId) || flippedIndices.includes(idx)) return;

    soundEngine.playClick();
    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = deck[firstIdx];
      const secondCard = deck[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        const updatedMatches = [...matchedIds, firstCard.pairId];
        setMatchedIds(updatedMatches);
        setFlippedIndices([]);
        setLastFact(`${firstCard.title}: ${firstCard.fact}`);
        soundEngine.playRelicUnlock();

        if (updatedMatches.length === PAIRS.length) {
          onSolved();
        }
      } else {
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 650);
      }
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setDeck(buildShuffledDeck());
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsLocked(false);
    setLastFact(
      "Voltea las piedras talladas de la Cueva Kunkuntiji para emparejar las 6 parejas sagradas."
    );
  };

  const isComplete = matchedIds.length === PAIRS.length;

  return (
    <div className="space-y-3">
      {/* Header Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-[#D8D3C8]">
          <span className="font-mono-num">
            Piedras emparejadas: <strong className="text-[#52B788]">{matchedIds.length}/6</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Intentos: <strong className="text-[#FFF8E7]">{moves}</strong>
          </span>
        </div>

        {!isComplete && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
            Mezclar piedras
          </button>
        )}
      </div>

      {/* 4x3 Cave Stones Grid */}
      <div className="rounded-2xl bg-gradient-to-b from-[#201D1A] to-[#121110] border border-[#6A645B]/60 p-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5 shadow-inner">
        {deck.map((card, idx) => {
          const isMatched = matchedIds.includes(card.pairId);
          const isFlipped = isMatched || flippedIndices.includes(idx);

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleFlip(idx)}
              disabled={isMatched}
              aria-label={isFlipped ? card.title : 'Piedra de la cueva boca abajo'}
              className={`min-h-[90px] rounded-2xl border-2 p-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${
                isMatched
                  ? 'bg-gradient-to-b from-[#214E3E] to-[#143026] border-[#52B788] text-[#FFF8E7] shadow-[0_0_14px_rgba(82,183,136,0.35)]'
                  : isFlipped
                    ? 'bg-gradient-to-b from-[#3A3128] to-[#231D18] border-[#F5B700] text-[#FFF8E7] scale-[0.98]'
                    : 'bg-gradient-to-b from-[#49443F] via-[#383430] to-[#272421] hover:from-[#57514B] hover:to-[#322E2A] border-[#78716C] text-[#D9A05B] cursor-pointer hover:scale-[1.02] shadow-md'
              }`}
            >
              {isFlipped ? (
                <>
                  <CardSymbolSvg pairId={card.pairId} />
                  <span className="text-[11px] font-semibold leading-tight text-center">{card.title}</span>
                </>
              ) : (
                <svg viewBox="0 0 36 36" className="w-8 h-8 opacity-75" fill="none" aria-hidden="true">
                  <path
                    d="M8 12 L15 6 L27 8 L31 20 L25 30 L11 29 L6 20 Z"
                    fill="#2A2724"
                    stroke="#9C9284"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M14 14 H22 V17 H25 V21 H22 V24 H14 V21 H11 V17 H14 Z"
                    stroke="#D9A05B"
                    strokeWidth="1.3"
                  />
                  <circle cx="18" cy="19" r="2" fill="#F5B700" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Discovery Fact Bar */}
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm border ${
          isComplete
            ? 'bg-[#1E4D3B]/65 border-[#52B788] text-[#ECFDF5]'
            : 'bg-[#081523] border-white/10 text-[#D8D3C8]'
        }`}
      >
        {isComplete && <CheckCircle2 className="w-4 h-4 text-[#52B788] shrink-0" />}
        <span>{lastFact}</span>
      </div>
    </div>
  );
};
