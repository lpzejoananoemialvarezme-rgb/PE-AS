import React from 'react';
import { ArrowLeft, ArrowRight, Gamepad2, Play, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { ChallengeType, StageData } from '../types/game';
import { soundEngine } from '../utils/sound';

interface ChallengeSelectorScreenProps {
  stage: StageData;
  onSelectMode: (mode: 'primary' | 'secondary') => void;
  onBackToContext: () => void;
}

interface ChallengePreviewMeta {
  imageUrl: string;
  badge: string;
  explanation: string;
  visualOverlay:
    | 'stone_words'
    | 'falling_food'
    | 'golden_brush'
    | 'basket_weave'
    | 'puzzle_grid'
    | 'memory_stones'
    | 'echo_riddle'
    | 'snake_dots'
    | 'quiz_cards'
    | 'stone_stack'
    | 'hidden_crosses'
    | 'mirador_3d'
    | 'cliff_holds';
}

function getChallengePreview(type: ChallengeType): ChallengePreviewMeta {
  switch (type) {
    case 'katari_phrase':
      return {
        imageUrl: ASSETS.PLAZA_KATARI,
        badge: 'Desafío de Orden',
        explanation:
          'Ordena los bloques de piedra tallada para reconstruir la histórica proclama pronunciada por Túpac Katari en 1781.',
        visualOverlay: 'stone_words'
      };
    case 'plato_paceno_catch':
      return {
        imageUrl: ASSETS.MURALES_CAFETERIA,
        badge: 'Minijuego Arcade',
        explanation:
          'Desliza el plato cerámico de un lado a otro junto a tu avatar para atrapar lo que necesitas y esquivar obstáculos.',
        visualOverlay: 'falling_food'
      };
    case 'magic_brush':
      return {
        imageUrl: ASSETS.CHURCH_INTERIOR,
        badge: 'Pincel Restaurador',
        explanation:
          'Desliza el dedo o cursor sobre la escena cubierta de polvo para revelar lo que se oculta debajo.',
        visualOverlay: 'golden_brush'
      };
    case 'totora_basket':
      return {
        imageUrl: ASSETS.MUSEUM_ARTIFACTS,
        badge: 'Taller Artesanal',
        explanation:
          'Elabora una canasta de totora (junco lacustre) paso a paso y prepárala con productos tradicionales del trueque andino.',
        visualOverlay: 'basket_weave'
      };
    case 'puzzle':
      return {
        imageUrl: ASSETS.AGUAYO_PUZZLE,
        badge: 'Rompecabezas 3×3',
        explanation:
          'Intercambia las piezas desordenadas del telar hasta recomponer por completo el aguayo (tejido tradicional andino).',
        visualOverlay: 'puzzle_grid'
      };
    case 'memory_game':
      return {
        imageUrl: ASSETS.KUNKUNTIJI_CAVE,
        badge: 'Memoria en Piedra',
        explanation:
          'Voltea las piedras talladas dentro de la cueva sagrada para descubrir todos los pares ocultos de fauna y cultura andina.',
        visualOverlay: 'memory_stones'
      };
    case 'riddle':
      return {
        imageUrl: ASSETS.KUNKUNTIJI_CAVE,
        badge: 'Acertijo del Sabio',
        explanation:
          'Lee el enigma que resuena en la cueva y escribe la palabra secreta para superar el desafío.',
        visualOverlay: 'echo_riddle'
      };
    case 'rupestre_snake':
      return {
        imageUrl: ASSETS.QILLQANTIJI_SNAKE,
        badge: 'Trazo Rupestre',
        explanation:
          'Restaura sobre la pared de roca la pintura rupestre milenaria conectando los puntos de la figura ancestral.',
        visualOverlay: 'snake_dots'
      };
    case 'multiple_choice':
      return {
        imageUrl: ASSETS.QILLQANTIJI_CAVE,
        badge: 'Pregunta Histórica',
        explanation:
          'Pon a prueba lo que aprendiste sobre el arte rupestre del abrigo rocoso eligiendo la respuesta correcta.',
        visualOverlay: 'quiz_cards'
      };
    case 'apacheta_stack':
      return {
        imageUrl: ASSETS.CALVARIO_CARMEN,
        badge: 'Equilibrio en Altura',
        explanation:
          'Suelta piedras en el momento justo para apilarlas en equilibrio y levantar una apacheta (montículo sagrado) en la cumbre.',
        visualOverlay: 'stone_stack'
      };
    case 'calvario_crosses':
      return {
        imageUrl: ASSETS.CALVARIO_CARMEN,
        badge: 'Búsqueda Exploradora',
        explanation:
          'Observa y explora las rocas y ruinas del Cerro Calvario tocando el paisaje para encontrar las cruces escondidas.',
        visualOverlay: 'hidden_crosses'
      };
    case 'mirador_3d':
      return {
        imageUrl: ASSETS.MIRADOR_CORDILLERA_REAL,
        badge: 'Panorámica 3D 360°',
        explanation:
          'Recorre en 3D el mirador al atardecer, observa las montañas del horizonte y responde la pregunta de observación.',
        visualOverlay: 'mirador_3d'
      };
    case 'climbing_game':
      return {
        imageUrl: ASSETS.CASTILLO_CORDILLERA,
        badge: 'Escalada en Roca',
        explanation:
          'Guía a tu avatar por el muro granítico de Peñas eligiendo tu ruta hasta alcanzar la cima.',
        visualOverlay: 'cliff_holds'
      };
    default:
      return {
        imageUrl: ASSETS.PLAZA_KATARI,
        badge: 'Desafío Interactivo',
        explanation: 'Completa este desafío de la etapa para desbloquear la reliquia.',
        visualOverlay: 'quiz_cards'
      };
  }
}

const ExampleVisualOverlay: React.FC<{ kind: ChallengePreviewMeta['visualOverlay'] }> = ({ kind }) => {
  switch (kind) {
    case 'stone_words':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5 justify-center">
          {['Bloque 1', 'Bloque 2', 'Bloque 3', 'Bloque 4'].map((label) => (
            <span
              key={label}
              className="px-2.5 py-0.5 rounded-md bg-[#2E2C29]/92 border border-[#D9A05B]/75 text-xs font-bold text-[#FFD166] shadow"
            >
              {label} · ?
            </span>
          ))}
        </div>
      );
    case 'falling_food':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-full bg-[#081523]/90 border border-[#F5B700]/65 text-[#FFD166] text-xs font-bold shadow">
            Atrapa y esquiva en movimiento
          </span>
        </div>
      );
    case 'puzzle_grid':
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3"
        >
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-[#F5B700]/40 bg-[#081523]/25 flex items-center justify-center"
            >
              <span className="w-5 h-5 rounded bg-[#081523]/75 text-xs font-bold text-[#FFD166] flex items-center justify-center">
                ?
              </span>
            </div>
          ))}
        </div>
      );
    case 'basket_weave':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#081523]/90 border border-[#D9A05B]/65 text-xs font-bold text-[#FFD166]">
            Tejido artesanal y trueque
          </span>
        </div>
      );
    case 'memory_stones':
      return (
        <div className="pointer-events-none absolute inset-x-4 bottom-2.5 grid grid-cols-4 gap-1.5">
          {['?', '?', '?', '?'].map((lbl, idx) => (
            <div
              key={idx}
              className="rounded-md bg-[#081523]/88 border border-[#D9A05B]/70 py-1 text-center text-xs font-bold text-[#FFD166]"
            >
              {lbl}
            </div>
          ))}
        </div>
      );
    case 'snake_dots':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#081523]/90 border border-[#D9A05B]/65 text-xs font-bold text-[#FFD166]">
            Restauración sobre roca
          </span>
        </div>
      );
    case 'stone_stack':
      return (
        <div className="pointer-events-none absolute right-3 bottom-2.5 flex flex-col items-center gap-0.5 drop-shadow-lg">
          <div className="w-7 h-2 rounded bg-[#8F867C] border border-[#292524]" />
          <div className="w-9 h-2.5 rounded bg-[#78716C] border border-[#292524]" />
          <div className="w-11 h-2.5 rounded bg-[#6B655E] border border-[#292524]" />
          <div className="w-14 h-3 rounded bg-[#4A4540] border border-[#292524]" />
        </div>
      );
    case 'hidden_crosses':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#081523]/90 border border-[#F5B700]/70 text-xs font-bold text-[#FFD166]">
            Exploración visual en el cerro
          </span>
        </div>
      );
    case 'mirador_3d':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#081523]/90 border border-[#FFD166]/65 text-xs font-bold text-[#FFF8E7]">
            Recorrido 3D interactivo
          </span>
        </div>
      );
    case 'cliff_holds':
      return (
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-center">
          <span className="px-2.5 py-0.5 rounded-md bg-[#1E4D3B]/92 border border-[#52B788]/70 text-xs font-bold text-[#ECFDF5]">
            Ascenso en roca natural
          </span>
        </div>
      );
    default:
      return null;
  }
};

export const ChallengeSelectorScreen: React.FC<ChallengeSelectorScreenProps> = ({
  stage,
  onSelectMode,
  onBackToContext
}) => {
  const secondaryType = stage.secondaryType;
  if (!secondaryType) return null;

  const choices: Array<{
    mode: 'primary' | 'secondary';
    title: string;
    prompt: string;
    meta: ChallengePreviewMeta;
  }> = [
    {
      mode: 'primary',
      title: stage.primaryLabel || 'Desafío 1',
      prompt: stage.questionPrompt,
      meta: getChallengePreview(stage.type)
    },
    {
      mode: 'secondary',
      title: stage.secondaryLabel || 'Desafío 2',
      prompt: stage.secondaryPrompt || stage.questionPrompt,
      meta: getChallengePreview(secondaryType)
    }
  ];

  return (
    <section className="space-y-4 animate-toast-reveal">
      {/* Header & Back to Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onBackToContext();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#112A3E] hover:bg-[#17334E] border border-[#D9A05B]/35 text-xs sm:text-sm font-semibold text-[#FFD166] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la Ficha de Tata</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#52B788]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Etapa 0{stage.id} · 2 Desafíos Disponibles</span>
        </div>
      </div>

      {/* Clear Decision Instruction */}
      <div className="rounded-xl bg-[#081523] border border-[#D9A05B]/40 px-4 py-3.5 space-y-1.5">
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#FFD166]">
          <Gamepad2 className="w-5 h-5 text-[#F5B700] shrink-0" />
          <span>Elige 1 de los 2 minijuegos</span>
        </div>
        <p className="text-sm sm:text-base text-[#D8D3C8] leading-relaxed">
          Completa el desafío que prefieras para ganar la reliquia de {stage.title}.
        </p>
      </div>

      {/* Two Side-by-Side Visual Example Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {choices.map((item, idx) => (
          <div
            key={item.mode}
            className="group rounded-2xl border-2 border-[#D9A05B]/40 hover:border-[#F5B700] bg-[#081523]/95 overflow-hidden flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              {/* Example Image Preview */}
              <div className="relative aspect-[16/9.5] w-full bg-[#112A3E] overflow-hidden border-b border-white/10">
                <img
                  src={item.meta.imageUrl}
                  alt={`Ejemplo visual del desafío ${item.title}`}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081523]/90 via-transparent to-[#081523]/55"
                />

                {/* Top Option + Example Tag */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F5B700] text-[#1A1207] text-xs font-bold shadow">
                    Opción {idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#081523]/88 border border-white/20 text-xs font-semibold text-[#FFD166] truncate">
                    {item.meta.badge}
                  </span>
                </div>

                <ExampleVisualOverlay kind={item.meta.visualOverlay} />
              </div>

              {/* Challenge Title & Explanation */}
              <div className="p-4 space-y-2">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFF8E7] leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#D8D3C8] leading-relaxed">
                  {item.meta.explanation}
                </p>
              </div>
            </div>

            {/* Play Action Button */}
            <div className="px-4 pb-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onSelectMode(item.mode);
                }}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm sm:text-base cursor-pointer transition-transform active:scale-[0.98] shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Elegir y Jugar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
