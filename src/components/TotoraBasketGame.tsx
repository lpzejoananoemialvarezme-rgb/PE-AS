import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Camera, CheckCircle2, Leaf, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { drawRoundRect, observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';

interface TotoraBasketGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

type WeaveStep = 'encima' | 'debajo';
type GamePhase = 'BASE' | 'WEAVE' | 'HANDLE' | 'PLANTS' | 'DONE';
type PlantId = 'chuno' | 'quinua' | 'koa' | 'papa';

interface AccentTheme {
  id: string;
  label: string;
  primary: string;
  secondary: string;
}

interface PlantInfo {
  id: PlantId;
  name: string;
  role: string;
  accent: string;
}

const ACCENT_THEMES: AccentTheme[] = [
  { id: 'dorado', label: 'Dorado Totora', primary: '#F5B700', secondary: '#FFE082' },
  { id: 'aguayo', label: 'Rojo Aguayo', primary: '#D64550', secondary: '#F4A261' },
  { id: 'lago', label: 'Azul Lago', primary: '#38BDF8', secondary: '#7DD3FC' },
  { id: 'bofedal', label: 'Verde Bofedal', primary: '#52B788', secondary: '#95D5B2' }
];

const TRADITIONAL_PLANTS: PlantInfo[] = [
  {
    id: 'chuno',
    name: 'Chuño',
    role: 'Papa deshidratada por helada para el trueque',
    accent: '#D6D3D1'
  },
  {
    id: 'quinua',
    name: 'Quinua',
    role: 'Grano de oro del Altiplano andino',
    accent: '#F5B700'
  },
  {
    id: 'koa',
    name: "K'oa",
    role: 'Planta aromática ceremonial andina',
    accent: '#A7C957'
  },
  {
    id: 'papa',
    name: 'Papa',
    role: 'Tubérculo nativo de las terrazas de Peñas',
    accent: '#E07A5F'
  }
];

const CRAFT_SHOWCASE_SCENES = [
  {
    src: ASSETS.MUSEUM_ARTIFACTS,
    label: 'Cestería y Museo de Peñas',
    caption: 'Canastas de totora, aguayos y productos nativos para el trueque andino.'
  },
  {
    src: ASSETS.MURALES_CAFETERIA,
    label: 'Artesanías y Murales del Pueblo',
    caption: 'Sombreros de fieltro, bolsas tejidas y murales vibrantes en el centro de Peñas.'
  },
  {
    src: ASSETS.MURAL_PACHAMAMA,
    label: 'Mural de la Pachamama y Flores',
    caption: 'Tradición oral, diente de león y ofrendas sagradas de las laderas.'
  }
];
const BASE_STALKS_TOTAL = 3;
const SPOKE_COUNT = 6;
const TOTAL_STITCHES = 12;
const HANDLE_NODES_TOTAL = 3;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingCallout {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface HitTarget {
  kind: 'base_slot' | 'weave_over' | 'weave_under' | 'handle_node' | 'plant_bundle';
  index: number;
  x: number;
  y: number;
  r: number;
}

export const TotoraBasketGame: React.FC<TotoraBasketGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<GamePhase>(alreadySolved ? 'DONE' : 'BASE');
  const [placedSlots, setPlacedSlots] = useState<boolean[]>(
    alreadySolved ? [true, true, true] : [false, false, false]
  );
  const [stitchesDone, setStitchesDone] = useState<number>(alreadySolved ? TOTAL_STITCHES : 0);
  const [handleNodesDone, setHandleNodesDone] = useState<number>(
    alreadySolved ? HANDLE_NODES_TOTAL : 0
  );
  const [placedPlants, setPlacedPlants] = useState<Record<PlantId, boolean>>(
    alreadySolved
      ? { chuno: true, quinua: true, koa: true, papa: true }
      : { chuno: false, quinua: false, koa: false, papa: false }
  );
  const [combo, setCombo] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [accentTheme, setAccentTheme] = useState<AccentTheme>(ACCENT_THEMES[1]);
  const [showMuseumPhoto, setShowMuseumPhoto] = useState<boolean>(false);
  const [showcaseErr, setShowcaseErr] = useState<Record<number, boolean>>({});
  const [statusMsg, setStatusMsg] = useState<string>(
    alreadySolved
      ? 'Así quedó tu cesta de totora lista para el trueque con chuño, quinua, k’oa y papa.'
      : 'Paso 1: Toca las 3 líneas punteadas sobre el tapete para cruzar los haces de totora.'
  );

  const expectedWeave: WeaveStep = stitchesDone % 2 === 0 ? 'encima' : 'debajo';
  const baseCount = placedSlots.filter(Boolean).length;
  const plantsCount = Object.values(placedPlants).filter(Boolean).length;

  const animRef = useRef({
    phase: (alreadySolved ? 'DONE' : 'BASE') as GamePhase,
    placedSlots: alreadySolved ? [true, true, true] : [false, false, false],
    slotPop: alreadySolved ? [1, 1, 1] : [0, 0, 0],
    stitchesDone: alreadySolved ? TOTAL_STITCHES : 0,
    weaveFlash: 0,
    handleNodesDone: alreadySolved ? HANDLE_NODES_TOTAL : 0,
    handleSmooth: alreadySolved ? 1 : 0,
    placedPlants: alreadySolved
      ? { chuno: true, quinua: true, koa: true, papa: true }
      : { chuno: false, quinua: false, koa: false, papa: false },
    plantPop: alreadySolved
      ? { chuno: 1, quinua: 1, koa: 1, papa: 1 }
      : { chuno: 0, quinua: 0, koa: 0, papa: 0 },
    accent: ACCENT_THEMES[1],
    errorShake: 0,
    pointerX: -999,
    pointerY: -999,
    isDraggingHandle: false,
    particles: [] as Particle[],
    callouts: [] as FloatingCallout[],
    hitTargets: [] as HitTarget[]
  });

  animRef.current.phase = phase;
  animRef.current.placedSlots = placedSlots;
  animRef.current.stitchesDone = stitchesDone;
  animRef.current.handleNodesDone = handleNodesDone;
  animRef.current.placedPlants = placedPlants;
  animRef.current.accent = accentTheme;

  const spawnBurst = useCallback((x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = 45 + Math.random() * 95;
      animRef.current.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 25,
        life: 0.7,
        maxLife: 0.7,
        color,
        size: 2.5 + Math.random() * 3
      });
    }
  }, []);

  const spawnCallout = useCallback((x: number, y: number, text: string, color: string) => {
    animRef.current.callouts.push({ x, y, text, color, life: 0.95 });
  }, []);

  const handlePlaceBaseSlot = useCallback(
    (slotIndex: number, fxX?: number, fxY?: number) => {
      if (phase !== 'BASE') return;
      if (placedSlots[slotIndex]) return;

      soundEngine.playTileSwap();
      const nextSlots = [...placedSlots];
      nextSlots[slotIndex] = true;
      setPlacedSlots(nextSlots);

      const count = nextSlots.filter(Boolean).length;
      const canvas = canvasRef.current;
      const cx = fxX ?? (canvas ? canvas.clientWidth * 0.5 : 220);
      const cy = fxY ?? (canvas ? canvas.clientHeight * 0.6 : 185);
      spawnBurst(cx, cy, '#F5B700', 14);
      spawnCallout(cx, cy - 26, `¡Haz ${count}/3!`, '#FFD166');

      if (count >= BASE_STALKS_TOTAL) {
        setPhase('WEAVE');
        setStatusMsg(
          'Paso 2: ¡Estrella lista! Toca ▲ Por Encima o ▼ Por Debajo directo en la varilla iluminada.'
        );
      } else {
        setStatusMsg(`¡Bien! Llevas ${count}/3 haces cruzados. Toca otra línea punteada.`);
      }
    },
    [phase, placedSlots, spawnBurst, spawnCallout]
  );

  const handlePlaceNextBaseSlot = useCallback(() => {
    const idx = placedSlots.findIndex((v) => !v);
    if (idx !== -1) handlePlaceBaseSlot(idx);
  }, [placedSlots, handlePlaceBaseSlot]);

  const handleWeaveChoice = useCallback(
    (choice: WeaveStep, fxX?: number, fxY?: number) => {
      if (phase !== 'WEAVE') return;

      const canvas = canvasRef.current;
      const cx = fxX ?? (canvas ? canvas.clientWidth * 0.5 : 220);
      const cy = fxY ?? (canvas ? canvas.clientHeight * 0.52 : 160);

      if (choice !== expectedWeave) {
        soundEngine.playWrong();
        setMistakes((m) => m + 1);
        setCombo(0);
        animRef.current.errorShake = 1;
        spawnCallout(
          cx,
          cy - 22,
          `¡Toca ${expectedWeave === 'encima' ? '▲ Encima' : '▼ Debajo'}!`,
          '#FCA5A5'
        );
        setStatusMsg(
          `¡Casi! La puntada anterior fue ${
            expectedWeave === 'encima' ? '▼ Por Debajo' : '▲ Por Encima'
          }; ahora toca pasar ${expectedWeave === 'encima' ? '▲ Por Encima' : '▼ Por Debajo'}.`
        );
        return;
      }

      soundEngine.playTileSwap();
      const next = stitchesDone + 1;
      const nextCombo = combo + 1;
      setStitchesDone(next);
      setCombo(nextCombo);
      animRef.current.weaveFlash = 1;

      const ringColor = next > SPOKE_COUNT ? accentTheme.primary : '#F5B700';
      spawnBurst(cx, cy, ringColor, nextCombo >= 4 ? 16 : 10);
      spawnCallout(
        cx,
        cy - 24,
        nextCombo >= 3 ? `¡Ritmo x${nextCombo}!` : choice === 'encima' ? '▲ ¡Encima!' : '▼ ¡Debajo!',
        nextCombo >= 3 ? '#FFD166' : '#A7F3D0'
      );

      if (next >= TOTAL_STITCHES) {
        setPhase('HANDLE');
        setStatusMsg(
          'Paso 3: ¡Paredes listas! Toca o desliza sobre los 3 nudos brillantes (1 → 2 → 3) para trenzar el asa.'
        );
      } else if (next === SPOKE_COUNT) {
        setStatusMsg(
          `¡Anillo 1 completo! Ahora teje la franja «${accentTheme.label}» alternando el trenzado.`
        );
      } else {
        setStatusMsg(
          `Puntada ${next}/${TOTAL_STITCHES} · Racha x${nextCombo}. Siguiente: ${
            next % 2 === 0 ? '▲ Por Encima' : '▼ Por Debajo'
          }.`
        );
      }
    },
    [phase, expectedWeave, stitchesDone, combo, accentTheme, spawnBurst, spawnCallout]
  );

  const handleAdvanceHandleNode = useCallback(
    (nodeIdx: number, fxX?: number, fxY?: number) => {
      if (phase !== 'HANDLE') return;
      if (nodeIdx !== handleNodesDone) return;

      const next = handleNodesDone + 1;
      setHandleNodesDone(next);
      const canvas = canvasRef.current;
      const cx = fxX ?? (canvas ? canvas.clientWidth * 0.5 : 220);
      const cy = fxY ?? (canvas ? canvas.clientHeight * 0.28 : 95);

      if (next >= HANDLE_NODES_TOTAL) {
        soundEngine.playRelicUnlock();
        setPhase('PLANTS');
        spawnBurst(cx, cy, '#FFD166', 20);
        spawnCallout(cx, cy - 20, '¡Asa trenzada!', '#FFD166');
        setStatusMsg(
          'Paso 4: ¡Cesta tejida! Ahora guarda chuño, quinua, k’oa y papa para salir al trueque por el Camino Prehispánico.'
        );
      } else {
        soundEngine.playTileSwap();
        spawnBurst(cx, cy, '#FFD166', 12);
        spawnCallout(cx, cy - 20, `¡Nudo ${next}/3!`, '#FFE082');
        setStatusMsg(`¡Nudo ${next}/3 trenzado! Continúa al punto ${next + 1}.`);
      }
    },
    [phase, handleNodesDone, spawnBurst, spawnCallout]
  );

  const handleAddPlant = useCallback(
    (plantId: PlantId, fxX?: number, fxY?: number) => {
      if (phase !== 'PLANTS') return;
      if (placedPlants[plantId]) return;

      const info = TRADITIONAL_PLANTS.find((p) => p.id === plantId)!;
      const nextMap = { ...placedPlants, [plantId]: true };
      setPlacedPlants(nextMap);

      const canvas = canvasRef.current;
      const cx = fxX ?? (canvas ? canvas.clientWidth * 0.5 : 240);
      const cy = fxY ?? (canvas ? canvas.clientHeight * 0.45 : 140);
      const nextCount = Object.values(nextMap).filter(Boolean).length;

      if (nextCount >= TRADITIONAL_PLANTS.length) {
        soundEngine.playRelicUnlock();
        setPhase('DONE');
        const basketCx = canvas ? canvas.clientWidth * 0.5 : 240;
        const basketCy = canvas ? canvas.clientHeight * 0.45 : 140;
        spawnBurst(basketCx, basketCy, '#FFD166', 26);
        spawnBurst(basketCx - 35, basketCy + 10, '#A7C957', 16);
        spawnBurst(basketCx + 35, basketCy + 10, '#E07A5F', 16);
        spawnCallout(basketCx, basketCy - 35, '¡Lista para Trueque!', '#FFD166');
        setStatusMsg(
          '¡Así quedó tu cesta de totora lista para el trueque con chuño, quinua, k’oa y papa!'
        );
      } else {
        soundEngine.playTileSwap();
        spawnBurst(cx, cy, info.accent, 14);
        spawnCallout(cx, cy - 22, `+ ${info.name}`, info.accent);
        setStatusMsg(
          `Guardaste ${info.name} en tu cesta (${nextCount}/${TRADITIONAL_PLANTS.length}). ¡Agrega los que faltan!`
        );
      }
    },
    [phase, placedPlants, spawnBurst, spawnCallout]
  );

  const handleReset = () => {
    soundEngine.playClick();
    setPhase('BASE');
    setPlacedSlots([false, false, false]);
    animRef.current.slotPop = [0, 0, 0];
    setStitchesDone(0);
    setHandleNodesDone(0);
    animRef.current.handleSmooth = 0;
    setPlacedPlants({ chuno: false, quinua: false, koa: false, papa: false });
    animRef.current.plantPop = { chuno: 0, quinua: 0, koa: 0, papa: 0 };
    setCombo(0);
    setMistakes(0);
    setStatusMsg(
      'Paso 1: Toca las 3 líneas punteadas sobre el tapete para cruzar los haces de totora.'
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showMuseumPhoto) return;
      if (phase === 'WEAVE') {
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
          e.preventDefault();
          handleWeaveChoice('encima');
        } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleWeaveChoice('debajo');
        }
      } else if (phase === 'BASE' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handlePlaceNextBaseSlot();
      } else if (phase === 'HANDLE' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handleAdvanceHandleNode(handleNodesDone);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    showMuseumPhoto,
    phase,
    handleWeaveChoice,
    handlePlaceNextBaseSlot,
    handleAdvanceHandleNode,
    handleNodesDone
  ]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const triggerHitAt = (x: number, y: number, isDragMove: boolean) => {
    const targets = animRef.current.hitTargets;
    let best: HitTarget | null = null;
    let bestDist = Infinity;

    for (const t of targets) {
      if (isDragMove && t.kind !== 'handle_node') continue;
      const dist = Math.hypot(x - t.x, y - t.y);
      if (dist <= t.r && dist < bestDist) {
        best = t;
        bestDist = dist;
      }
    }

    if (!best) return;
    if (best.kind === 'base_slot') {
      handlePlaceBaseSlot(best.index, best.x, best.y);
    } else if (best.kind === 'weave_over') {
      handleWeaveChoice('encima', best.x, best.y);
    } else if (best.kind === 'weave_under') {
      handleWeaveChoice('debajo', best.x, best.y);
    } else if (best.kind === 'handle_node') {
      handleAdvanceHandleNode(best.index, best.x, best.y);
    } else if (best.kind === 'plant_bundle') {
      const p = TRADITIONAL_PLANTS[best.index];
      if (p) handleAddPlant(p.id, best.x, best.y);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPoint(e);
    animRef.current.pointerX = x;
    animRef.current.pointerY = y;
    if (phase === 'HANDLE') {
      animRef.current.isDraggingHandle = true;
    }
    triggerHitAt(x, y, false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPoint(e);
    animRef.current.pointerX = x;
    animRef.current.pointerY = y;
    if (animRef.current.isDraggingHandle && phase === 'HANDLE') {
      triggerHitAt(x, y, true);
    }
  };

  const handlePointerUp = () => {
    animRef.current.isDraggingHandle = false;
  };

  // Helper to draw barter items cleanly (Chuño, Quinua, K'oa, Papa)
  const drawPlantGraphics = (
    ctx: CanvasRenderingContext2D,
    id: PlantId,
    x: number,
    y: number,
    scale: number,
    t: number
  ) => {
    const sway = Math.sin(t * 2.2 + (id === 'koa' ? 1.4 : id === 'quinua' ? 2.6 : 0)) * 0.04;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(sway);

    if (id === 'chuno') {
      // Cluster of freeze-dried dark Andean chuño tubers
      const pieces = [
        { px: -12, py: -8, rx: 12, ry: 9, col: '#57534E' },
        { px: 10, py: -12, rx: 11, ry: 8.5, col: '#78716C' },
        { px: 0, py: -24, rx: 13, ry: 9.5, col: '#D6D3D1' }
      ];
      pieces.forEach((p) => {
        ctx.fillStyle = p.col;
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(p.px, p.py, p.rx, p.ry, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Wrinkle / freeze-dry lines
        ctx.strokeStyle = 'rgba(28, 25, 23, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.px - 3, p.py - 1, 4, 0.2, 2.2);
        ctx.stroke();
      });
    } else if (id === 'quinua') {
      // Golden & crimson Andean Quinoa panicles
      const stalks = [
        { dx: -13, topY: -44, col: '#F5B700' },
        { dx: 0, topY: -54, col: '#E07A5F' },
        { dx: 13, topY: -42, col: '#FFD166' }
      ];
      stalks.forEach((s) => {
        ctx.strokeStyle = '#A3823E';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.quadraticCurveTo(s.dx * 0.4, s.topY * 0.4, s.dx, s.topY);
        ctx.stroke();

        // Dense grain clusters along top panicle
        for (let k = 0; k < 7; k++) {
          const gy = s.topY + k * 4.2;
          const gx = s.dx + (k % 2 === 0 ? -3 : 3);
          ctx.fillStyle = s.col;
          ctx.beginPath();
          ctx.arc(gx, gy, 4.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    } else if (id === 'koa') {
      // Woody Andean twigs & feathery sage-olive K'oa foliage + aromatic cream buds
      const twigs = [
        { dx: -15, dy: -42 },
        { dx: 0, dy: -50 },
        { dx: 15, dy: -40 }
      ];
      twigs.forEach((tw, idx) => {
        ctx.strokeStyle = '#6B5B3E';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.quadraticCurveTo(tw.dx * 0.5, tw.dy * 0.5, tw.dx, tw.dy);
        ctx.stroke();

        for (let k = 1; k <= 5; k++) {
          const f = k / 5.5;
          const px = tw.dx * f;
          const py = 8 + (tw.dy - 8) * f;
          ctx.fillStyle = k % 2 === 0 ? '#A7C957' : '#7B9E62';
          ctx.beginPath();
          ctx.ellipse(px - 6, py, 6, 2.5, -0.5, 0, Math.PI * 2);
          ctx.ellipse(px + 6, py, 6, 2.5, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = idx === 1 ? '#FFF3B0' : '#E8DEC8';
        ctx.beginPath();
        ctx.arc(tw.dx, tw.dy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Native Andean Potatoes (Papa Waycha / Imilla)
      const potatoes = [
        { px: -11, py: -10, rx: 14, ry: 10, col: '#B86B4B' },
        { px: 11, py: -12, rx: 13, ry: 9.5, col: '#9B4D59' },
        { px: 0, py: -24, rx: 15, ry: 11, col: '#D49A5B' }
      ];
      potatoes.forEach((p) => {
        ctx.fillStyle = p.col;
        ctx.strokeStyle = '#4A2511';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(p.px, p.py, p.rx, p.ry, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#5C3820';
        ctx.beginPath();
        ctx.arc(p.px - 4, p.py - 2, 1.5, 0, Math.PI * 2);
        ctx.arc(p.px + 5, p.py + 2, 1.3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  };

  // 60fps Canvas Render Loop
  useEffect(() => {
    if (showMuseumPhoto) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let last = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = Math.max(290, parent.clientWidth);
      const h = 320;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const stopResizeObserver = observeElementResize(canvas.parentElement, resize);

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      const w = canvas.clientWidth || 520;
      const h = canvas.clientHeight || 320;
      const st = animRef.current;
      const hits: HitTarget[] = [];

      // Smooth animations
      for (let i = 0; i < 3; i++) {
        const targetPop = st.placedSlots[i] ? 1 : 0;
        st.slotPop[i] += (targetPop - st.slotPop[i]) * Math.min(1, dt * 12);
      }
      for (const p of TRADITIONAL_PLANTS) {
        const target = st.placedPlants[p.id] ? 1 : 0;
        st.plantPop[p.id] += (target - st.plantPop[p.id]) * Math.min(1, dt * 10);
      }
      const targetHandle = st.handleNodesDone / HANDLE_NODES_TOTAL;
      st.handleSmooth += (targetHandle - st.handleSmooth) * Math.min(1, dt * 10);
      st.weaveFlash = Math.max(0, st.weaveFlash - dt * 2.5);
      st.errorShake = Math.max(0, st.errorShake - dt * 4.5);

      const shakeX = st.errorShake > 0 ? Math.sin(t * 55) * 6 * st.errorShake : 0;

      // 1. Artisan Workshop Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#141c24');
      bg.addColorStop(0.42, '#241a12');
      bg.addColorStop(1, '#362315');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Wooden table surface
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, h * 0.4, w, 3);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1.2;
      for (let py = Math.round(h * 0.45); py < h; py += 42) {
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }

      const cx = w * 0.5 + shakeX;
      const cy =
        st.phase === 'BASE' ? h * 0.58 : st.phase === 'DONE' ? h * 0.72 : h * 0.67;

      // Overhead warm spotlight (extra radiant on DONE showcase!)
      const lamp = ctx.createRadialGradient(
        cx,
        cy - 40,
        18,
        cx,
        cy - 10,
        st.phase === 'DONE' ? 245 : 210
      );
      lamp.addColorStop(0, st.phase === 'DONE' ? 'rgba(255, 209, 102, 0.28)' : 'rgba(245, 183, 0, 0.18)');
      lamp.addColorStop(1, 'rgba(245, 183, 0, 0)');
      ctx.fillStyle = lamp;
      ctx.fillRect(0, 0, w, h);

      // Woven circular aguayo mat underneath the basket
      ctx.save();
      ctx.translate(cx, cy + 8);
      ctx.fillStyle = '#4A2511';
      ctx.strokeStyle = st.accent.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 128, 56, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 248, 231, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 114, 48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ============================================================
      // PHASE 1: BASE RADIAL STAR
      // ============================================================
      if (st.phase === 'BASE') {
        const slotAngles = [0, Math.PI / 3, -Math.PI / 3];
        const firstEmpty = st.placedSlots.findIndex((v) => !v);

        slotAngles.forEach((ang, idx) => {
          const isPlaced = st.placedSlots[idx];
          const pop = st.slotPop[idx];

          ctx.save();
          ctx.translate(cx, cy + 6);
          ctx.rotate(ang);

          if (!isPlaced) {
            const pulse = 0.65 + 0.35 * Math.sin(t * 4.5 + idx);
            ctx.strokeStyle =
              idx === firstEmpty ? `rgba(255, 209, 102, ${pulse})` : 'rgba(255, 248, 231, 0.38)';
            ctx.lineWidth = idx === firstEmpty ? 3 : 2;
            ctx.setLineDash([8, 6]);
            drawRoundRect(ctx, -105, -9, 210, 18, 9);
            ctx.stroke();
            ctx.setLineDash([]);

            const markerX = idx === 0 ? 78 : idx === 1 ? -70 : 70;
            ctx.fillStyle = idx === firstEmpty ? '#F5B700' : '#1D4E89';
            ctx.beginPath();
            ctx.arc(markerX, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFF8E7';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = idx === firstEmpty ? '#1A1207' : '#FFF8E7';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(idx + 1), markerX, 1);

            const cos = Math.cos(ang);
            const sin = Math.sin(ang);
            for (const offset of [-64, 0, 64]) {
              hits.push({
                kind: 'base_slot',
                index: idx,
                x: cx + cos * offset,
                y: cy + 6 + sin * offset,
                r: 36
              });
            }
          }

          if (pop > 0.02) {
            const scale = 0.5 + 0.5 * pop;
            ctx.scale(scale, scale);
            const grad = ctx.createLinearGradient(-105, -7, 105, 7);
            grad.addColorStop(0, '#B98D3B');
            grad.addColorStop(0.5, '#EAD086');
            grad.addColorStop(1, '#B98D3B');
            ctx.fillStyle = grad;
            ctx.strokeStyle = '#6E4C1B';
            ctx.lineWidth = 1.6;
            drawRoundRect(ctx, -105, -7, 210, 14, 6);
            ctx.fill();
            ctx.stroke();
          }

          ctx.restore();
        });
      }

      // ============================================================
      // PHASE 2..5: 3/4 PERSPECTIVE BASKET + INTERIOR PLANTS + HANDLE
      // ============================================================
      if (st.phase !== 'BASE') {
        const scaleBasket = st.phase === 'DONE' ? 1.1 : 1;
        const baseRx = 52 * scaleBasket;
        const baseRy = 22 * scaleBasket;
        const topRx = 96 * scaleBasket;
        const topRy = 40 * scaleBasket;
        const basketHeight = 84 * scaleBasket;
        const rimY = cy - basketHeight;

        const spokes = Array.from({ length: SPOKE_COUNT }, (_, i) => {
          const ang = (i / SPOKE_COUNT) * Math.PI * 2 - Math.PI * 0.68;
          const bx = cx + Math.cos(ang) * baseRx;
          const by = cy + Math.sin(ang) * baseRy;
          const tx = cx + Math.cos(ang) * topRx;
          const ty = rimY + Math.sin(ang) * topRy;
          return { i, ang, bx, by, tx, ty };
        });

        // 1. Woven base disc
        ctx.fillStyle = '#C9A34E';
        ctx.strokeStyle = '#7C5722';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, baseRx + 6, baseRy + 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Center tie knot
        ctx.fillStyle = st.accent.primary;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 13, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dark cozy basket interior shadow when walls are built
        if (st.stitchesDone >= SPOKE_COUNT) {
          ctx.fillStyle = 'rgba(32, 20, 9, 0.72)';
          ctx.beginPath();
          ctx.ellipse(cx, rimY + 6, topRx - 4, topRy - 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Back spokes
        spokes
          .filter((s) => Math.sin(s.ang) < 0)
          .forEach((s) => {
            ctx.strokeStyle = '#A88234';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(s.bx, s.by);
            ctx.quadraticCurveTo((s.bx + s.tx) * 0.5, (s.by + s.ty) * 0.5 + 12, s.tx, s.ty);
            ctx.stroke();
          });

        // Helper to draw woven segments either back-half (sin <= 0) or front-half (sin > 0)
        const drawWovenSegments = (frontHalf: boolean) => {
          const ringsToDraw = Math.ceil(st.stitchesDone / SPOKE_COUNT);
          for (let r = 0; r < Math.max(ringsToDraw, 0); r++) {
            const segsInRing = Math.min(SPOKE_COUNT, Math.max(0, st.stitchesDone - r * SPOKE_COUNT));
            const ringColors =
              r === 0
                ? ['#E2C26D', '#C9A249', '#DFBC64']
                : [st.accent.primary, st.accent.secondary, st.accent.primary];

            for (let layer = 0; layer < 3; layer++) {
              const tFrac = (r * 3 + layer + 1) / 6.8;
              const ringRx = baseRx + (topRx - baseRx) * tFrac;
              const ringRy = baseRy + (topRy - baseRy) * tFrac;
              const ringY = cy - basketHeight * tFrac;

              for (let s = 0; s < segsInRing; s++) {
                const a0 = (s / SPOKE_COUNT) * Math.PI * 2 - Math.PI * 0.68;
                const a1 = ((s + 1) / SPOKE_COUNT) * Math.PI * 2 - Math.PI * 0.68;
                const midSin = Math.sin((a0 + a1) * 0.5);
                if (frontHalf ? midSin < 0 : midSin >= 0) continue;

                const isOver = s % 2 === 0;
                ctx.strokeStyle = ringColors[layer % ringColors.length];
                ctx.lineWidth = 8.5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                const steps = 8;
                for (let k = 0; k <= steps; k++) {
                  const f = k / steps;
                  const a = a0 + (a1 - a0) * f;
                  const wave = Math.sin(f * Math.PI) * (isOver ? -2.5 : 2.5);
                  const px = cx + Math.cos(a) * ringRx;
                  const py = ringY + Math.sin(a) * ringRy + wave;
                  if (k === 0) ctx.moveTo(px, py);
                  else ctx.lineTo(px, py);
                }
                ctx.stroke();

                ctx.strokeStyle = 'rgba(40, 22, 8, 0.35)';
                ctx.lineWidth = 1.4;
                ctx.stroke();
              }
            }
          }
        };

        // 3. Draw BACK half of woven walls & BACK half of rim
        drawWovenSegments(false);
        if (st.phase === 'HANDLE' || st.phase === 'PLANTS' || st.phase === 'DONE') {
          ctx.strokeStyle = '#DFBF6E';
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.ellipse(cx, rimY, topRx + 2, topRy + 2, 0, Math.PI, Math.PI * 2);
          ctx.stroke();
        }

        // 4. BARTER GOODS NESTLED INSIDE THE BASKET (Chuño, Quinua, K'oa, Papa)
        const plantOffsets: Record<PlantId, { dx: number; dy: number; scale: number }> = {
          chuno: { dx: -42 * scaleBasket, dy: rimY + 14, scale: 0.95 * scaleBasket },
          quinua: { dx: -14 * scaleBasket, dy: rimY + 8, scale: 1.05 * scaleBasket },
          koa: { dx: 18 * scaleBasket, dy: rimY + 8, scale: 1.05 * scaleBasket },
          papa: { dx: 44 * scaleBasket, dy: rimY + 14, scale: 0.95 * scaleBasket }
        };
        (['quinua', 'koa', 'chuno', 'papa'] as PlantId[]).forEach((pid) => {
          const pop = st.plantPop[pid];
          if (pop > 0.02) {
            const cfg = plantOffsets[pid];
            const lift = (1 - pop) * -42;
            drawPlantGraphics(
              ctx,
              pid,
              cx + cfg.dx,
              cfg.dy + lift,
              cfg.scale * (0.4 + 0.6 * pop),
              t
            );
          }
        });

        // 5. Draw FRONT half of woven walls & front spokes & front half of rim (over plant stems!)
        drawWovenSegments(true);
        spokes
          .filter((s) => Math.sin(s.ang) >= 0)
          .forEach((s) => {
            ctx.strokeStyle = '#DFBF6E';
            ctx.lineWidth = 5.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(s.bx, s.by);
            ctx.quadraticCurveTo((s.bx + s.tx) * 0.5, (s.by + s.ty) * 0.5 + 12, s.tx, s.ty);
            ctx.stroke();
          });

        if (st.phase === 'HANDLE' || st.phase === 'PLANTS' || st.phase === 'DONE') {
          ctx.strokeStyle = '#F2D27C';
          ctx.lineWidth = 9.5;
          ctx.beginPath();
          ctx.ellipse(cx, rimY, topRx + 2, topRy + 2, 0, 0, Math.PI);
          ctx.stroke();

          ctx.strokeStyle = st.accent.primary;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([7, 7]);
          ctx.beginPath();
          ctx.ellipse(cx, rimY, topRx + 2, topRy + 2, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // ============================================================
        // ACTIVE WEAVE GATES ON SPOKE (PHASE === 'WEAVE')
        // ============================================================
        if (st.phase === 'WEAVE') {
          const activeRing = Math.floor(st.stitchesDone / SPOKE_COUNT);
          const spokeIdx = st.stitchesDone % SPOKE_COUNT;
          const tFrac = activeRing === 0 ? 0.32 : 0.72;
          const activeAng = (spokeIdx / SPOKE_COUNT) * Math.PI * 2 - Math.PI * 0.68;
          const ringRx = baseRx + (topRx - baseRx) * tFrac;
          const ringRy = baseRy + (topRy - baseRy) * tFrac;
          const spokeX = cx + Math.cos(activeAng) * ringRx;
          const spokeY = cy - basketHeight * tFrac + Math.sin(activeAng) * ringRy;

          const expected: WeaveStep = st.stitchesDone % 2 === 0 ? 'encima' : 'debajo';
          const showTutorialPulse = st.stitchesDone < 3;

          const beaconR = 11 + Math.sin(t * 6) * 2.5;
          ctx.strokeStyle = '#FFD166';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(spokeX, spokeY, beaconR, 0, Math.PI * 2);
          ctx.stroke();

          const overY = Math.max(46, spokeY - 36);
          const underY = Math.min(h - 28, spokeY + 36);

          const drawGate = (
            gx: number,
            gy: number,
            label: string,
            bgCol: string,
            borderCol: string,
            isHinted: boolean
          ) => {
            const hover = Math.hypot(st.pointerX - gx, st.pointerY - gy) <= 28;
            const pulseScale = isHinted ? 1 + 0.08 * Math.sin(t * 7) : 1;

            ctx.save();
            ctx.translate(gx, gy);
            ctx.scale(hover ? 1.12 : pulseScale, hover ? 1.12 : pulseScale);

            if (isHinted) {
              ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
              ctx.beginPath();
              ctx.arc(0, 0, 27, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = bgCol;
            ctx.strokeStyle = isHinted ? '#FFF8E7' : borderCol;
            ctx.lineWidth = isHinted ? 2.6 : 1.8;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFF8E7';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 0);
            ctx.restore();
          };

          ctx.strokeStyle = 'rgba(255,255,255,0.28)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(spokeX, overY + 18);
          ctx.lineTo(spokeX, underY - 18);
          ctx.stroke();
          ctx.setLineDash([]);

          drawGate(spokeX, overY, '▲', '#B45309', '#F5B700', showTutorialPulse && expected === 'encima');
          drawGate(spokeX, underY, '▼', '#1D4E89', '#4EA8DE', showTutorialPulse && expected === 'debajo');

          hits.push({ kind: 'weave_over', index: 0, x: spokeX, y: overY, r: 28 });
          hits.push({ kind: 'weave_under', index: 1, x: spokeX, y: underY, r: 28 });

          // Top-left Rhythm Strip
          ctx.fillStyle = 'rgba(8, 21, 35, 0.84)';
          drawRoundRect(ctx, 12, 12, 188, 36, 10);
          ctx.fill();
          ctx.fillStyle = '#CBD5E1';
          ctx.font = '600 10px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('Ritmo:', 22, 31);
          for (let k = 0; k < 6; k++) {
            const sym = (st.stitchesDone + k) % 2 === 0 ? '▲' : '▼';
            const sx = 64 + k * 21;
            ctx.fillStyle =
              k === 0
                ? '#FFD166'
                : (st.stitchesDone + k) % 2 === 0
                  ? 'rgba(245, 183, 0, 0.45)'
                  : 'rgba(78, 168, 222, 0.45)';
            ctx.font = k === 0 ? 'bold 14px sans-serif' : '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(sym, sx, 31);
          }
        }

        // ============================================================
        // BRAIDED HANDLE (PHASE === 'HANDLE' | 'PLANTS' | 'DONE')
        // ============================================================
        if (st.phase === 'HANDLE' || st.phase === 'PLANTS' || st.phase === 'DONE') {
          const p0 = { x: cx - topRx + 4, y: rimY };
          const p1 = { x: cx, y: rimY - 122 * scaleBasket };
          const p2 = { x: cx + topRx - 4, y: rimY };

          if (st.phase === 'HANDLE') {
            ctx.strokeStyle = 'rgba(255, 209, 102, 0.45)';
            ctx.lineWidth = 5;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (st.handleSmooth > 0.02) {
            const maxT = Math.min(1, st.handleSmooth);
            const steps = 28;
            ctx.strokeStyle = '#DFBC64';
            ctx.lineWidth = 10.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (let k = 0; k <= steps; k++) {
              const u = (k / steps) * maxT;
              const inv = 1 - u;
              const hx = inv * inv * p0.x + 2 * inv * u * p1.x + u * u * p2.x;
              const hy = inv * inv * p0.y + 2 * inv * u * p1.y + u * u * p2.y;
              if (k === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.stroke();

            ctx.strokeStyle = st.accent.primary;
            ctx.lineWidth = 2.6;
            ctx.setLineDash([6, 8]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (st.phase === 'HANDLE') {
            const archNodes = [
              { x: p0.x + 12, y: rimY - 18, idx: 0 },
              { x: cx, y: rimY - 62, idx: 1 },
              { x: p2.x - 12, y: rimY - 18, idx: 2 }
            ];

            archNodes.forEach((n) => {
              const done = n.idx < st.handleNodesDone;
              const isNext = n.idx === st.handleNodesDone;
              const pulse = isNext ? 1 + 0.12 * Math.sin(t * 7) : 1;

              ctx.save();
              ctx.translate(n.x, n.y);
              ctx.scale(pulse, pulse);

              ctx.fillStyle = done ? '#52B788' : isNext ? '#F5B700' : '#17334E';
              ctx.strokeStyle = '#FFF8E7';
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              ctx.arc(0, 0, 17, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = done ? '#052E16' : isNext ? '#1A1207' : '#CBD5E1';
              ctx.font = 'bold 13px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(done ? '✓' : String(n.idx + 1), 0, 1);
              ctx.restore();

              if (isNext) {
                hits.push({ kind: 'handle_node', index: n.idx, x: n.x, y: n.y, r: 34 });
              }
            });
          }
        }

        // ============================================================
        // BARTER ITEMS ON TABLE (PHASE === 'PLANTS')
        // ============================================================
        if (st.phase === 'PLANTS') {
          const trayCoords = [
            { x: Math.max(54, cx - 178), y: h * 0.34 },
            { x: Math.min(w - 54, cx + 178), y: h * 0.34 },
            { x: Math.max(54, cx - 178), y: h * 0.74 },
            { x: Math.min(w - 54, cx + 178), y: h * 0.74 }
          ];

          TRADITIONAL_PLANTS.forEach((p, idx) => {
            if (st.placedPlants[p.id]) return;
            const pos = trayCoords[idx];
            const hover = Math.hypot(st.pointerX - pos.x, st.pointerY - pos.y) <= 44;
            const pulse = 0.72 + 0.28 * Math.sin(t * 5 + idx);

            ctx.save();
            ctx.fillStyle = hover ? 'rgba(29, 78, 137, 0.92)' : 'rgba(8, 21, 35, 0.86)';
            ctx.strokeStyle = hover ? '#FFF8E7' : `rgba(255, 209, 102, ${pulse})`;
            ctx.lineWidth = hover ? 2.4 : 1.8;
            drawRoundRect(ctx, pos.x - 46, pos.y - 42, 92, 80, 12);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            drawPlantGraphics(ctx, p.id, pos.x, pos.y + 10, 0.72, t);

            ctx.fillStyle = '#FFF8E7';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.name, pos.x, pos.y + 29);

            hits.push({ kind: 'plant_bundle', index: idx, x: pos.x, y: pos.y, r: 46 });
          });
        }
      }

      // Particles & Floating Callouts
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 170 * dt;
        p.life -= dt;
        if (p.life <= 0) {
          st.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = st.callouts.length - 1; i >= 0; i--) {
        const c = st.callouts[i];
        c.y -= 34 * dt;
        c.life -= dt;
        if (c.life <= 0) {
          st.callouts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.min(1, c.life * 1.4);
        ctx.fillStyle = c.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.text, c.x, c.y);
      }
      ctx.globalAlpha = 1;

      st.hitTargets = hits;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, [showMuseumPhoto]);

  return (
    <div className="space-y-3">
      {/* Top Progress & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-3 text-[#E2DDD2]">
          <span className="font-mono-num">
            Base: <strong className="text-[#F5B700]">{baseCount}/{BASE_STALKS_TOTAL}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Tejido: <strong className="text-[#52B788]">{stitchesDone}/{TOTAL_STITCHES}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Trueque: <strong className="text-[#A7C957]">{plantsCount}/{TRADITIONAL_PLANTS.length}</strong>
          </span>
          {combo > 0 && phase !== 'DONE' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">
                Racha: <strong className="text-[#FFD166]">x{combo}</strong>
              </span>
            </>
          )}
          {mistakes > 0 && phase !== 'DONE' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-[#FCA5A5]">Enredos: {mistakes}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowMuseumPhoto((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#1D4E89] text-xs font-medium text-[#E2DDD2] cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#4EA8DE]" />
            <span>{showMuseumPhoto ? 'Volver al taller' : 'Ver artesanías y murales'}</span>
          </button>

          {phase !== 'DONE' && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Andean Accent Band Picker */}
      {!showMuseumPhoto && phase !== 'DONE' && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#081523]/80 border border-white/10 text-xs">
          <span className="text-[#CBD5E1] font-medium">Color de tu cinta andina:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {ACCENT_THEMES.map((theme) => {
              const active = accentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setAccentTheme(theme);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#17334E] border-[#F5B700] text-[#FFF8E7] font-semibold'
                      : 'bg-[#0D2134] border-white/10 text-[#9FB3C8] hover:text-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Canvas OR Craft & Mural Showcase */}
      {showMuseumPhoto ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CRAFT_SHOWCASE_SCENES.map((item, idx) => (
            <figure
              key={item.label}
              className="rounded-2xl overflow-hidden border border-[#D9A05B]/45 bg-[#081523] flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-[#131c26] overflow-hidden">
                {!showcaseErr[idx] ? (
                  <img
                    src={item.src}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    onError={() => setShowcaseErr((prev) => ({ ...prev, [idx]: true }))}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2B1D0E] via-[#1E4D3B] to-[#0F2C4C]" />
                )}
              </div>
              <figcaption className="p-3 space-y-0.5">
                <div className="text-xs font-bold text-[#FFD166]">{item.label}</div>
                <p className="text-[11px] text-[#D8D3C8] leading-snug">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-[#FFD166]">
              {phase === 'BASE' && 'Paso 1 · Estrella Base'}
              {phase === 'WEAVE' &&
                `Paso 2 · Toca ${expectedWeave === 'encima' ? '▲ Encima' : '▼ Debajo'}`}
              {phase === 'HANDLE' && `Paso 3 · Asa (${handleNodesDone}/${HANDLE_NODES_TOTAL})`}
              {phase === 'PLANTS' && `Paso 4 · Trueque (${plantsCount}/${TRADITIONAL_PLANTS.length})`}
              {phase === 'DONE' && '¡Cesta Lista!'}
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-[#D9A05B]/45 bg-[#1c140d] shadow-xl">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="block w-full touch-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Ergonomic Controls per Phase */}
      {phase === 'BASE' && (
        <button
          type="button"
          onClick={handlePlaceNextBaseSlot}
          className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>Colocar siguiente haz de totora ({baseCount}/{BASE_STALKS_TOTAL})</span>
        </button>
      )}

      {phase === 'WEAVE' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleWeaveChoice('encima')}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border font-bold text-sm cursor-pointer transition-all shadow-md ${
              expectedWeave === 'encima' && stitchesDone < 3
                ? 'bg-[#B45309] hover:bg-[#D97706] border-[#FFD166] text-[#FFF8E7] ring-2 ring-[#FFD166]/45'
                : 'bg-[#92400E]/85 hover:bg-[#B45309] border-[#F5B700]/45 text-[#FFF8E7]'
            }`}
          >
            ▲ Por Encima
          </button>
          <button
            type="button"
            onClick={() => handleWeaveChoice('debajo')}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border font-bold text-sm cursor-pointer transition-all shadow-md ${
              expectedWeave === 'debajo' && stitchesDone < 3
                ? 'bg-[#1D4E89] hover:bg-[#2563EB] border-[#7DD3FC] text-[#FFF8E7] ring-2 ring-[#7DD3FC]/45'
                : 'bg-[#17334E] hover:bg-[#1D4E89] border-[#4EA8DE]/45 text-[#FFF8E7]'
            }`}
          >
            ▼ Por Debajo
          </button>
        </div>
      )}

      {phase === 'HANDLE' && (
        <button
          type="button"
          onClick={() => handleAdvanceHandleNode(handleNodesDone)}
          className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>Trenzar nudo del asa ({handleNodesDone}/{HANDLE_NODES_TOTAL})</span>
        </button>
      )}

      {phase === 'PLANTS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TRADITIONAL_PLANTS.map((p) => {
            const added = placedPlants[p.id];
            return (
              <button
                key={p.id}
                type="button"
                disabled={added}
                onClick={() => handleAddPlant(p.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  added
                    ? 'bg-[#1E4D3B]/55 border-[#52B788]/60 text-[#A7F3D0] cursor-default'
                    : 'bg-[#112A3E] hover:bg-[#1A3D58] border-[#F5B700]/45 text-[#FFF8E7] cursor-pointer shadow-md'
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${p.accent}24`, color: p.accent }}
                >
                  {added ? <CheckCircle2 className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold truncate">{p.name}</span>
                  <span className="block text-[11px] text-[#9FB3C8] truncate">
                    {added ? 'En la cesta' : p.role}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Final Showcase Card + Explicit Continue Button so player sees the finished basket! */}
      {phase === 'DONE' && (
        <div className="rounded-xl bg-gradient-to-r from-[#1E4D3B]/75 via-[#17334E]/85 to-[#2B1D0E]/80 border border-[#F5B700]/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
              <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
              <span>¡Tu cesta de totora está lista para el trueque!</span>
            </div>
            <p className="text-xs text-[#E2DDD2]">
              Cinta <strong className="text-[#FFF8E7]">{accentTheme.label}</strong> con{' '}
              <strong className="text-[#E7E5E4]">chuño</strong>,{' '}
              <strong className="text-[#F5B700]">quinua</strong>,{' '}
              <strong className="text-[#A7C957]">k&apos;oa</strong> y{' '}
              <strong className="text-[#F4A261]">papa</strong> de Peñas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-xs font-semibold text-[#E2DDD2] cursor-pointer"
            >
              Tejer otra
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playRelicUnlock();
                onSolved();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm whitespace-nowrap cursor-pointer shadow-lg"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {phase !== 'DONE' && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm border bg-[#081523] border-white/10 text-[#D8D3C8]">
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
};
