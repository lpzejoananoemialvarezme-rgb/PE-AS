import React, { useMemo, useState } from 'react';
import { Eye, Shuffle, CheckCircle2 } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { soundEngine } from '../utils/sound';

interface AguayoPuzzleProps {
  imageUrl: string;
  caption: string;
  alreadySolved?: boolean;
  onSolved: () => void;
}

function createShuffledBoard(): number[] {
  // Ensure it starts noticeably scrambled (at least 6 tiles out of place)
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const correctCount = arr.filter((val, idx) => val === idx).length;
    if (correctCount <= 3) break;
  }
  return arr;
}

export const AguayoPuzzle: React.FC<AguayoPuzzleProps> = ({
  imageUrl,
  caption,
  alreadySolved = false,
  onSolved
}) => {
  const [tiles, setTiles] = useState<number[]>(() =>
    alreadySolved ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : createShuffledBoard()
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [imgError, setImgError] = useState(false);

  const resolvedSrc = imageUrl || ASSETS.AGUAYO_PUZZLE;
  const isSolved = useMemo(() => tiles.every((val, idx) => val === idx), [tiles]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedIndex === null) {
      soundEngine.playClick();
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const next = [...tiles];
    [next[selectedIndex], next[index]] = [next[index], next[selectedIndex]];
    setTiles(next);
    setSelectedIndex(null);
    setMoves((m) => m + 1);
    soundEngine.playTileSwap();

    if (next.every((val, idx) => val === idx)) {
      soundEngine.playRelicUnlock();
      onSolved();
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setTiles(createShuffledBoard());
    setSelectedIndex(null);
    setMoves(0);
  };

  const correctCount = tiles.filter((val, idx) => val === idx).length;

  return (
    <div className="space-y-3">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-[#D8D3C8]">
          <span className="font-mono-num">
            Movimientos: <strong className="text-[#FFF8E7]">{moves}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Piezas en su sitio: <strong className="text-[#52B788]">{correctCount}/9</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowPreview((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#1D4E89] text-[#E2DDD2] text-xs font-medium cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#4EA8DE]" />
            {showPreview ? 'Ocultar guía' : 'Ver guía'}
          </button>

          {!isSolved && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-[#E2DDD2] text-xs font-medium cursor-pointer transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#D9A05B]" />
              Mezclar
            </button>
          )}
        </div>
      </div>

      {/* Puzzle Grid + Optional Reference Preview */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
        <div
          className={`grid grid-cols-3 gap-1.5 p-2 rounded-xl border-2 bg-[#081523] w-full max-w-[320px] aspect-square transition-colors ${
            isSolved ? 'border-[#F5B700] shadow-[0_0_24px_rgba(245,183,0,0.28)]' : 'border-[#D9A05B]/45'
          }`}
        >
          {tiles.map((pieceId, idx) => {
            const row = Math.floor(pieceId / 3);
            const col = pieceId % 3;
            const isSelected = selectedIndex === idx;
            const isCorrectSpot = pieceId === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTileClick(idx)}
                disabled={isSolved}
                aria-label={`Pieza ${idx + 1} de 9`}
                className={`relative rounded-md overflow-hidden transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#F5B700] cursor-pointer ${
                  isSelected
                    ? 'ring-3 ring-[#F5B700] scale-[0.94] z-10'
                    : isSolved
                      ? 'cursor-default'
                      : 'hover:scale-[0.98]'
                }`}
                style={
                  !imgError
                    ? {
                        backgroundImage: `url(${resolvedSrc})`,
                        backgroundSize: '300% 300%',
                        backgroundPosition: `${col * 50}% ${row * 50}%`
                      }
                    : undefined
                }
              >
                {imgError && (
                  <div className="w-full h-full bg-gradient-to-br from-[#6B4423] via-[#2D6A4F] to-[#1D4E89] flex items-center justify-center font-display text-lg text-[#FFF8E7]">
                    {pieceId + 1}
                  </div>
                )}
                {!isSolved && (
                  <span
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded text-[10px] font-mono-num font-bold flex items-center justify-center ${
                      isCorrectSpot
                        ? 'bg-[#2D6A4F]/90 text-[#FFF8E7]'
                        : 'bg-[#081523]/75 text-[#D8D3C8]'
                    }`}
                  >
                    {pieceId + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showPreview && (
          <div className="w-40 sm:w-44 shrink-0 space-y-1.5 text-center">
            {!imgError ? (
              <img
                src={resolvedSrc}
                alt={caption || 'Imagen guía del aguayo sagrado'}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full aspect-square object-cover rounded-xl border border-[#D9A05B]/45"
              />
            ) : (
              <div className="w-full aspect-square rounded-xl border border-[#D9A05B]/45 bg-[#1E4D3B] flex items-center justify-center text-xs p-2">
                Orden del 1 al 9
              </div>
            )}
            <p className="text-[11px] text-[#A3B1BF] leading-snug">{caption}</p>
          </div>
        )}
      </div>

      {/* Status Instruction */}
      {isSolved ? (
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#52B788] pt-1">
          <CheckCircle2 className="w-4 h-4" />
          ¡Aguayo sagrado reconstruido en {moves} movimientos!
        </div>
      ) : (
        <p className="text-xs text-center text-[#A3B1BF]">
          Toca una pieza y luego toca otra para intercambiarlas hasta completar el tejido (1 al 9).
        </p>
      )}
    </div>
  );
};
