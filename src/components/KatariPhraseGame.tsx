import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { soundEngine } from '../utils/sound';

interface KatariPhraseGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

interface WordStone {
  id: string;
  text: string;
}

const TARGET_PHRASE = ['Volveré', 'y', 'seré', 'millones'];

const ALL_STONES: WordStone[] = [
  { id: 's-1', text: 'Volveré' },
  { id: 's-2', text: 'y' },
  { id: 's-3', text: 'seré' },
  { id: 's-4', text: 'millones' },
  { id: 'd-1', text: 'olvidado' },
  { id: 'd-2', text: 'silencio' }
];

function shuffleStones(list: WordStone[]): WordStone[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure it doesn't accidentally start in exact solution order at front
  if (
    arr[0].text === TARGET_PHRASE[0] &&
    arr[1].text === TARGET_PHRASE[1] &&
    arr[2].text === TARGET_PHRASE[2] &&
    arr[3].text === TARGET_PHRASE[3]
  ) {
    [arr[0], arr[3]] = [arr[3], arr[0]];
  }
  return arr;
}

export const KatariPhraseGame: React.FC<KatariPhraseGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const initialPool = useMemo(() => shuffleStones(ALL_STONES), []);
  const [pool, setPool] = useState<WordStone[]>(initialPool);
  const [slots, setSlots] = useState<(WordStone | null)[]>(
    alreadySolved
      ? TARGET_PHRASE.map((text, idx) => ({ id: `solved-${idx}`, text }))
      : [null, null, null, null]
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [solved, setSolved] = useState(alreadySolved);
  const [imgError, setImgError] = useState(false);

  const placedIds = new Set(slots.filter(Boolean).map((s) => s!.id));

  const handlePlaceStone = (stone: WordStone) => {
    if (solved || placedIds.has(stone.id)) return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    soundEngine.playTileSwap();
    setErrorMsg('');
    const nextSlots = [...slots];
    nextSlots[emptyIdx] = stone;
    setSlots(nextSlots);

    if (nextSlots.every((s) => s !== null)) {
      const formed = nextSlots.map((s) => s!.text);
      const isCorrect = formed.every((word, idx) => word === TARGET_PHRASE[idx]);
      if (isCorrect) {
        soundEngine.playRelicUnlock();
        setSolved(true);
      } else {
        soundEngine.playWrong();
        setErrorMsg(
          'Ese orden no forma la proclama inmortal de Túpac Katari. Toca un bloque colocado para retirarlo.'
        );
      }
    }
  };

  const handleRemoveSlot = (idx: number) => {
    if (solved || !slots[idx]) return;
    soundEngine.playClick();
    setErrorMsg('');
    const nextSlots = [...slots];
    nextSlots[idx] = null;
    setSlots(nextSlots);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setPool(shuffleStones(ALL_STONES));
    setSlots([null, null, null, null]);
    setErrorMsg('');
    setSolved(false);
  };

  return (
    <div className="space-y-4">
      {/* Carved Granite Plaque Target */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#78716C] bg-gradient-to-b from-[#2E2C29] via-[#222120] to-[#17181A] p-4 sm:p-5 shadow-xl space-y-3">
        {/* Subtle Plaza Katari Monument Artwork Strip */}
        {!imgError && (
          <div className="relative h-28 sm:h-32 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-1 overflow-hidden border-b border-[#78716C]/50">
            <img
              src={ASSETS.PLAZA_KATARI}
              alt="Monumento a Túpac Katari, Bartolina Sisa y Gregoria Apaza en Peñas"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-[#FFD166] tracking-wide">
              14 de noviembre de 1781 · Plaza Principal de Peñas
            </div>
            <p className="text-xs sm:text-sm text-[#D6D1C7]">
              Toca los bloques de piedra tallada en el orden exacto de la última proclama de Túpac Katari:
            </p>
          </div>
          {!solved && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#383531] hover:bg-[#4B4640] border border-[#D9A05B]/40 text-xs font-medium text-[#E7E2D8] cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5B700]" />
              Mezclar
            </button>
          )}
        </div>

        {/* 4 Stone Sockets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {slots.map((stone, idx) => (
            <button
              key={idx}
              type="button"
              disabled={!stone || solved}
              onClick={() => handleRemoveSlot(idx)}
              className={`min-h-[64px] rounded-xl border-2 px-3 py-2 flex flex-col items-center justify-center transition-all ${
                solved
                  ? 'bg-gradient-to-b from-[#6B4423] to-[#3E2712] border-[#F5B700] text-[#FFF8E7] shadow-[0_0_18px_rgba(245,183,0,0.3)]'
                  : stone
                    ? 'bg-[#3F3A34] hover:bg-[#524B43] border-[#D9A05B] text-[#FFF8E7] cursor-pointer shadow-md'
                    : 'bg-[#141517]/80 border-dashed border-[#78716C]/70 text-[#78716C]'
              }`}
            >
              <span className="text-[10px] font-mono-num opacity-70 mb-0.5">Bloque {idx + 1}</span>
              <span className="font-display text-base sm:text-lg font-bold">
                {stone ? stone.text : '___'}
              </span>
            </button>
          ))}
        </div>

        {/* Stone Pool */}
        {!solved && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-semibold text-[#A3B1BF] mb-2">
              Piedras disponibles (sobran 2 distractores):
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.map((stone) => {
                const isUsed = placedIds.has(stone.id);
                return (
                  <button
                    key={stone.id}
                    type="button"
                    disabled={isUsed}
                    onClick={() => handlePlaceStone(stone)}
                    className={`min-h-[46px] px-4 py-2 rounded-xl border-2 font-display text-sm sm:text-base font-bold transition-transform ${
                      isUsed
                        ? 'bg-[#1C1C1E] border-white/10 text-[#52525B] opacity-40 cursor-not-allowed'
                        : 'bg-gradient-to-b from-[#4B4640] to-[#322F2B] hover:from-[#5E574F] hover:to-[#3E3934] border-[#9C9284] text-[#FFF8E7] cursor-pointer active:scale-95 shadow-md'
                    }`}
                  >
                    {stone.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-[#5C2323]/55 border border-[#EF4444]/45 px-4 py-2.5 text-xs sm:text-sm text-[#FEE2E2]">
          {errorMsg}
        </div>
      )}

      {solved && (
        <div className="rounded-xl bg-gradient-to-r from-[#1E4D3B]/80 via-[#17334E]/85 to-[#2B1D0E]/85 border border-[#F5B700]/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
              <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
              <span>«¡Volveré y seré millones!»</span>
            </div>
            <p className="text-xs text-[#E2DDD2]">
              <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
              Has grabado en piedra la proclama inmortal pronunciada en Peñas en 1781.
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
      )}
    </div>
  );
};
