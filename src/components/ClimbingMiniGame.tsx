import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Mountain,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wind
} from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { AvatarConfig } from '../types/game';
import { drawRoundRect, observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface ClimbingMiniGameProps {
  playerAvatar: AvatarConfig;
  playerName?: string;
  alreadySolved?: boolean;
  onSolved: () => void;
}

type HoldKind = 'base' | 'solid' | 'loose' | 'ice' | 'wind_fall' | 'overhang' | 'eco' | 'summit';

interface CliffHold {
  id: string;
  tier: number;
  col: number;
  xNorm: number; // 0..1 across cliff wall
  kind: HoldKind;
  name: string;
  clue: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

const TOTAL_TIERS = 6; // 0 = base, 6 = summit

const CLIFF_HOLDS: CliffHold[] = [
  // Tier 0 (Base)
  {
    id: '0-1',
    tier: 0,
    col: 1,
    xNorm: 0.5,
    kind: 'base',
    name: 'Base de las Peñas',
    clue: 'Punto de partida con cuerda asegurada.'
  },
  // Tier 1
  {
    id: '1-0',
    tier: 1,
    col: 0,
    xNorm: 0.24,
    kind: 'solid',
    name: 'Fisura granítica',
    clue: 'Grieta seca y firme en granito sólido.'
  },
  {
    id: '1-1',
    tier: 1,
    col: 1,
    xNorm: 0.5,
    kind: 'loose',
    name: 'Laja agrietada',
    clue: 'Roca fracturada que suelta gravilla; ¡puede ceder!'
  },
  {
    id: '1-2',
    tier: 1,
    col: 2,
    xNorm: 0.76,
    kind: 'eco',
    name: 'Repisa con residuo',
    clue: 'Agarre firme con una botella plástica para recoger.'
  },
  // Tier 2
  {
    id: '2-0',
    tier: 2,
    col: 0,
    xNorm: 0.23,
    kind: 'wind_fall',
    name: 'Canaleta de viento',
    clue: 'Caen piedrillas cada pocos segundos. ¡Sube solo en calma!'
  },
  {
    id: '2-1',
    tier: 2,
    col: 1,
    xNorm: 0.52,
    kind: 'solid',
    name: 'Arista soleada',
    clue: 'Roca firme bañada por el sol del Altiplano.'
  },
  {
    id: '2-2',
    tier: 2,
    col: 2,
    xNorm: 0.78,
    kind: 'loose',
    name: 'Bloque suelto',
    clue: 'Piedra inestable y quebradiza.'
  },
  // Tier 3
  {
    id: '3-0',
    tier: 3,
    col: 0,
    xNorm: 0.25,
    kind: 'overhang',
    name: 'Techo extraplomado',
    clue: 'Exige fuerza (-28% agarre) o usar magnesio.'
  },
  {
    id: '3-1',
    tier: 3,
    col: 1,
    xNorm: 0.5,
    kind: 'ice',
    name: 'Placa con escarcha',
    clue: 'Hielo andino resbaladizo: aplica Magnesio o rodéalo.'
  },
  {
    id: '3-2',
    tier: 3,
    col: 2,
    xNorm: 0.76,
    kind: 'solid',
    name: 'Diedro protegido',
    clue: 'Esquina de granito limpio al resguardo del viento.'
  },
  // Tier 4
  {
    id: '4-0',
    tier: 4,
    col: 0,
    xNorm: 0.24,
    kind: 'eco',
    name: 'Grieta con envoltura',
    clue: 'Repisa segura con residuo olvidado para limpiar.'
  },
  {
    id: '4-1',
    tier: 4,
    col: 1,
    xNorm: 0.5,
    kind: 'wind_fall',
    name: 'Chimenea ventosa',
    clue: 'Ráfagas intermitentes de altura: espera la calma.'
  },
  {
    id: '4-2',
    tier: 4,
    col: 2,
    xNorm: 0.77,
    kind: 'ice',
    name: 'Cornisa helada',
    clue: 'Capa de escarcha fría: requiere Magnesio para adherir.'
  },
  // Tier 5
  {
    id: '5-0',
    tier: 5,
    col: 0,
    xNorm: 0.26,
    kind: 'loose',
    name: 'Roca erosionada',
    clue: 'Arenisca floja que desprende polvo al tacto.'
  },
  {
    id: '5-1',
    tier: 5,
    col: 1,
    xNorm: 0.5,
    kind: 'overhang',
    name: 'Paso del Cóndor',
    clue: 'Extraplomo clave (-25% agarre) directo a la cima.'
  },
  {
    id: '5-2',
    tier: 5,
    col: 2,
    xNorm: 0.74,
    kind: 'solid',
    name: 'Cresta firme norte',
    clue: 'Buen canto de granito rumbo a la cumbre.'
  },
  // Tier 6 (Summit)
  {
    id: '6-1',
    tier: 6,
    col: 1,
    xNorm: 0.5,
    kind: 'summit',
    name: 'Cumbre del Cóndor',
    clue: '¡Cima sagrada a 4.150 m frente a la Cordillera Real!'
  }
];

function getHoldById(id: string): CliffHold {
  return CLIFF_HOLDS.find((h) => h.id === id) || CLIFF_HOLDS[0];
}

function isHoldReachable(current: CliffHold, target: CliffHold): boolean {
  if (target.id === current.id) return false;
  const isNextTier = target.tier === current.tier + 1 && Math.abs(target.xNorm - current.xNorm) <= 0.42;
  const isSideTraverse = target.tier === current.tier && Math.abs(target.col - current.col) === 1;
  return isNextTier || isSideTraverse;
}

export const ClimbingMiniGame: React.FC<ClimbingMiniGameProps> = ({
  playerAvatar,
  alreadySolved = false,
  onSolved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentHoldId, setCurrentHoldId] = useState<string>(alreadySolved ? '6-1' : '0-1');
  const [grip, setGrip] = useState<number>(100);
  const [chalkCharges, setChalkCharges] = useState<number>(3);
  const [chalkActive, setChalkActive] = useState<boolean>(false);
  const [collectedEco, setCollectedEco] = useState<string[]>([]);
  const [slips, setSlips] = useState<number>(0);
  const [windHazardActive, setWindHazardActive] = useState<boolean>(false);
  const [hoveredHoldId, setHoveredHoldId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>(
    'Observa las grietas, hielo y ráfagas en la roca. Toca un agarre accesible para escalar.'
  );
  const [won, setWon] = useState<boolean>(alreadySolved);

  // Mutable animation state inside ref so 60fps canvas loop never triggers React re-renders
  const animRef = useRef({
    climberXNorm: 0.5,
    climberTier: alreadySolved ? 6 : 0,
    targetXNorm: 0.5,
    targetTier: alreadySolved ? 6 : 0,
    moveProgress: 1,
    slipFlash: 0,
    anchorIds: alreadySolved ? ['0-1', '1-0', '2-1', '3-2', '4-0', '5-2', '6-1'] : ['0-1'],
    particles: [] as Particle[],
    screenHolds: [] as Array<{ id: string; px: number; py: number; radius: number }>
  });

  // Sync interactive React state into animRef cleanly for canvas reads
  const gameReadRef = useRef({
    currentHoldId,
    collectedEco,
    chalkActive,
    won,
    hoveredHoldId,
    grip
  });
  gameReadRef.current = {
    currentHoldId,
    collectedEco,
    chalkActive,
    won,
    hoveredHoldId,
    grip
  };

  const spawnParticles = useCallback(
    (x: number, y: number, color: string, count: number, downward = false) => {
      const list = animRef.current.particles;
      for (let i = 0; i < count; i++) {
        list.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 90,
          vy: downward ? 35 + Math.random() * 140 : (Math.random() - 0.7) * 95,
          size: 2.5 + Math.random() * 4.5,
          alpha: 1,
          color,
          life: 0,
          maxLife: 0.55 + Math.random() * 0.45
        });
      }
    },
    []
  );

  // Periodic high-altitude wind & falling-pebble cycle (every 2.8s toggles calm / active)
  useEffect(() => {
    if (won) {
      setWindHazardActive(false);
      return;
    }
    const id = window.setInterval(() => {
      setWindHazardActive((prev) => !prev);
    }, 2800);
    return () => window.clearInterval(id);
  }, [won]);

  const windHazardRef = useRef(windHazardActive);
  windHazardRef.current = windHazardActive;

  const attemptClimb = useCallback(
    (target: CliffHold) => {
      if (won) return;
      const current = getHoldById(currentHoldId);
      if (!isHoldReachable(current, target)) return;

      const screenEntry = animRef.current.screenHolds.find((h) => h.id === target.id);
      const px = screenEntry?.px ?? 240;
      const py = screenEntry?.py ?? 180;

      // 1. Loose rock obstacle
      if (target.kind === 'loose') {
        soundEngine.playWrong();
        setSlips((s) => s + 1);
        setGrip((g) => Math.max(15, g - 20));
        setChalkActive(false);
        animRef.current.slipFlash = 1;
        spawnParticles(px, py, '#9ca3af', 18, true);
        spawnParticles(px, py, '#d97706', 8, true);

        const fallbackTier = Math.max(0, current.tier - 1);
        const fallback =
          CLIFF_HOLDS.find((h) => h.tier === fallbackTier && h.kind !== 'loose') || CLIFF_HOLDS[0];
        setCurrentHoldId(fallback.id);
        animRef.current.targetXNorm = fallback.xNorm;
        animRef.current.targetTier = fallback.tier;
        animRef.current.moveProgress = 0;
        setStatusMsg(
          `¡La ${target.name.toLowerCase()} cedió bajo tu peso! La cuerda te detuvo un nivel abajo.`
        );
        return;
      }

      // 2. Wind + falling pebbles obstacle
      if (target.kind === 'wind_fall' && windHazardRef.current) {
        soundEngine.playWrong();
        setSlips((s) => s + 1);
        setGrip((g) => Math.max(15, g - 18));
        animRef.current.slipFlash = 1;
        spawnParticles(px, py, '#e2e8f0', 16, true);
        setStatusMsg(
          `¡Ráfaga y piedras cayendo en ${target.name}! Espera la ventana de CALMA o toma otra vía.`
        );
        return;
      }

      // 3. Ice obstacle without chalk
      if (target.kind === 'ice' && !chalkActive) {
        soundEngine.playWrong();
        setSlips((s) => s + 1);
        setGrip((g) => Math.max(15, g - 15));
        animRef.current.slipFlash = 1;
        spawnParticles(px, py, '#bae6fd', 18, true);
        setStatusMsg(
          `¡Resbalaste en la ${target.name.toLowerCase()}! Pulsa «Aplicar Magnesio» antes o rodéala por la fisura.`
        );
        return;
      }

      // 4. Steep Overhang stamina check
      if (target.kind === 'overhang') {
        const neededGrip = chalkActive ? 10 : 28;
        if (grip < neededGrip) {
          soundEngine.playWrong();
          setStatusMsg(
            'No tienes suficiente agarre para este extraplomo. Pulsa «Respirar en Repisa» o «Magnesio».'
          );
          return;
        }
        setGrip((g) => Math.max(10, g - (chalkActive ? 12 : 28)));
      } else {
        setGrip((g) => Math.max(10, g - 6));
      }

      // Successful move!
      if (chalkActive) setChalkActive(false);
      spawnParticles(px, py, '#fef3c7', 12, false);

      if (target.kind === 'eco' && !collectedEco.includes(target.id)) {
        setCollectedEco((prev) => [...prev, target.id]);
        setGrip((g) => Math.min(100, g + 16));
        soundEngine.playRelicUnlock();
        setStatusMsg(
          `¡Escalada sin huella! Recogiste el residuo en «${target.name}» (+16% energía).`
        );
      } else {
        soundEngine.playTileSwap();
        setStatusMsg(`Aseguraste el mosquetón en «${target.name}». ¡Lee la roca arriba y sigue!`);
      }

      setCurrentHoldId(target.id);
      animRef.current.targetXNorm = target.xNorm;
      animRef.current.targetTier = target.tier;
      animRef.current.moveProgress = 0;
      if (!animRef.current.anchorIds.includes(target.id)) {
        animRef.current.anchorIds = [...animRef.current.anchorIds, target.id];
      }

      if (target.kind === 'summit') {
        setWon(true);
        soundEngine.playRelicUnlock();
        spawnParticles(px, py, '#f5b700', 26, false);
        setStatusMsg('¡Cumbre del Cóndor alcanzada con técnica, respeto y cero huella!');
        onSolved();
      }
    },
    [chalkActive, collectedEco, currentHoldId, grip, onSolved, spawnParticles, won]
  );

  const handleUseChalk = () => {
    if (won || chalkActive || chalkCharges <= 0) return;
    soundEngine.playTileSwap();
    setChalkCharges((c) => c - 1);
    setChalkActive(true);
    setGrip((g) => Math.min(100, g + 18));
    setStatusMsg('Magnesio aplicado: agarre firme para placas con escarcha o extraplomos.');
  };

  const handleRest = () => {
    if (won) return;
    soundEngine.playClick();
    setGrip((g) => Math.min(100, g + 30));
    setStatusMsg('Respiraste profundo a 4.100 m y recuperaste tu agarre en la repisa.');
  };

  const handleReset = () => {
    soundEngine.playClick();
    setCurrentHoldId('0-1');
    setGrip(100);
    setChalkCharges(3);
    setChalkActive(false);
    setCollectedEco([]);
    setSlips(0);
    setWon(false);
    setHoveredHoldId(null);
    animRef.current = {
      climberXNorm: 0.5,
      climberTier: 0,
      targetXNorm: 0.5,
      targetTier: 0,
      moveProgress: 1,
      slipFlash: 0,
      anchorIds: ['0-1'],
      particles: [],
      screenHolds: []
    };
    setStatusMsg('Observa las grietas, hielo y ráfagas en la roca. Toca un agarre accesible para escalar.');
  };

  // Main 60fps Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTime = performance.now();
    let camTier = animRef.current.climberTier;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let cragBackdrop: HTMLImageElement | null = null;
    let cragReady = false;
    const cragImg = new Image();
    cragImg.referrerPolicy = 'no-referrer';
    cragImg.onload = () => {
      cragBackdrop = cragImg;
      cragReady = true;
    };
    cragImg.src = ASSETS.CASTILLO_CORDILLERA;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = Math.max(300, parent.clientWidth);
      const h = Math.max(330, Math.min(430, Math.round(w * 0.72)));
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
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000;

      const w = canvas.clientWidth || 560;
      const h = canvas.clientHeight || 380;
      const anim = animRef.current;
      const state = gameReadRef.current;
      const currentHold = getHoldById(state.currentHoldId);

      // Update climber interpolation
      if (anim.moveProgress < 1) {
        anim.moveProgress = Math.min(1, anim.moveProgress + dt * (reducedMotion ? 8 : 3.2));
        const ease = 1 - Math.pow(1 - anim.moveProgress, 3);
        anim.climberXNorm = anim.climberXNorm + (anim.targetXNorm - anim.climberXNorm) * Math.min(1, ease * 0.35 + dt * 5);
        anim.climberTier = anim.climberTier + (anim.targetTier - anim.climberTier) * Math.min(1, ease * 0.35 + dt * 5);
      } else {
        anim.climberXNorm = anim.targetXNorm;
        anim.climberTier = anim.targetTier;
      }

      if (anim.slipFlash > 0) {
        anim.slipFlash = Math.max(0, anim.slipFlash - dt * 2.2);
      }

      // Smooth camera vertical pan following climber
      const targetCamTier = Math.min(TOTAL_TIERS - 0.6, Math.max(1.2, anim.climberTier + 0.85));
      camTier += (targetCamTier - camTier) * Math.min(1, dt * 4.5);

      const tierSpacing = h * 0.27;
      const tierToY = (tier: number) => h * 0.68 - (tier - camTier) * tierSpacing;

      // 1. Andean Sky & Cordillera Real Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0f3863');
      skyGrad.addColorStop(0.55, '#2b6cb0');
      skyGrad.addColorStop(1, '#93c5fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      if (cragReady && cragBackdrop) {
        ctx.save();
        ctx.globalAlpha = 0.28;
        const scale = Math.max(w / cragBackdrop.width, h / cragBackdrop.height);
        const dw = cragBackdrop.width * scale;
        const dh = cragBackdrop.height * scale;
        ctx.drawImage(cragBackdrop, (w - dw) * 0.5, (h - dh) * 0.5 + camTier * 4, dw, dh);
        ctx.restore();
      }

      // Distant Snow-capped Cordillera Real peaks (parallax with camTier)
      const bgShift = camTier * 8;
      ctx.fillStyle = '#3b4e68';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.56 + bgShift * 0.3);
      ctx.lineTo(w * 0.14, h * 0.42 + bgShift * 0.3);
      ctx.lineTo(w * 0.28, h * 0.51 + bgShift * 0.3);
      ctx.lineTo(w * 0.48, h * 0.38 + bgShift * 0.3);
      ctx.lineTo(w * 0.72, h * 0.48 + bgShift * 0.3);
      ctx.lineTo(w * 0.88, h * 0.36 + bgShift * 0.3);
      ctx.lineTo(w, h * 0.47 + bgShift * 0.3);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Sunlit snow caps on distant peaks
      ctx.fillStyle = '#eef6ff';
      const drawSnowPeak = (px: number, py: number, span: number, drop: number) => {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - span * 0.5, py + drop);
        ctx.lineTo(px - span * 0.1, py + drop * 0.7);
        ctx.lineTo(px + span * 0.15, py + drop * 0.92);
        ctx.lineTo(px + span * 0.52, py + drop);
        ctx.closePath();
        ctx.fill();
      };
      drawSnowPeak(w * 0.14, h * 0.42 + bgShift * 0.3, w * 0.18, 28);
      drawSnowPeak(w * 0.88, h * 0.36 + bgShift * 0.3, w * 0.22, 34);

      // Circling distant condor near the summit sky
      const condorX = w * 0.5 + Math.cos(t * 0.65) * (w * 0.33);
      const condorY = Math.max(24, tierToY(6.35) + Math.sin(t * 1.1) * 10);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(condorX - 14, condorY + Math.sin(t * 4) * 3);
      ctx.quadraticCurveTo(condorX - 6, condorY - 5, condorX, condorY);
      ctx.quadraticCurveTo(condorX + 6, condorY - 5, condorX + 14, condorY + Math.sin(t * 4) * 3);
      ctx.stroke();

      // 2. Sculpted Granite Rock Spire (Peñas Vertical Cliff Face)
      const cliffTopY = tierToY(6.35);
      const cliffLeft = w * 0.11;
      const cliffRight = w * 0.89;

      const rockGrad = ctx.createLinearGradient(cliffLeft, 0, cliffRight, 0);
      rockGrad.addColorStop(0, '#3e2d21');
      rockGrad.addColorStop(0.28, '#5f4837');
      rockGrad.addColorStop(0.62, '#7a5d46');
      rockGrad.addColorStop(0.88, '#4e392a');
      rockGrad.addColorStop(1, '#2f2218');

      ctx.fillStyle = rockGrad;
      ctx.beginPath();
      ctx.moveTo(w * 0.05, h + 20);
      ctx.lineTo(w * 0.09, tierToY(1.2));
      ctx.lineTo(w * 0.12, tierToY(2.6));
      ctx.lineTo(w * 0.09, tierToY(3.8));
      ctx.lineTo(w * 0.14, tierToY(5.1));
      ctx.lineTo(w * 0.24, cliffTopY + 28);
      ctx.lineTo(w * 0.42, cliffTopY);
      ctx.lineTo(w * 0.58, cliffTopY + 4);
      ctx.lineTo(w * 0.76, cliffTopY + 32);
      ctx.lineTo(w * 0.87, tierToY(5.0));
      ctx.lineTo(w * 0.91, tierToY(3.4));
      ctx.lineTo(w * 0.88, tierToY(1.6));
      ctx.lineTo(w * 0.95, h + 20);
      ctx.closePath();
      ctx.fill();

      // Granite rock strata cracks & golden lichen shading
      ctx.strokeStyle = 'rgba(22, 14, 9, 0.45)';
      ctx.lineWidth = 2;
      for (let tier = 0; tier <= TOTAL_TIERS; tier++) {
        const sy = tierToY(tier) + 18;
        if (sy < cliffTopY + 12 || sy > h + 20) continue;
        ctx.beginPath();
        ctx.moveTo(w * 0.14, sy + 6);
        ctx.lineTo(w * 0.36, sy - 8);
        ctx.lineTo(w * 0.64, sy + 4);
        ctx.lineTo(w * 0.86, sy - 6);
        ctx.stroke();
      }

      // Vertical granite dihedral cracks
      ctx.strokeStyle = 'rgba(20, 14, 10, 0.35)';
      ctx.lineWidth = 2.5;
      [0.34, 0.66].forEach((cxNorm, idx) => {
        ctx.beginPath();
        ctx.moveTo(w * cxNorm, Math.max(cliffTopY + 26, 0));
        ctx.lineTo(w * (cxNorm + (idx === 0 ? -0.02 : 0.02)), h);
        ctx.stroke();
      });

      // Base alpine grass terrace
      const baseFloorY = tierToY(-0.22);
      if (baseFloorY < h + 30) {
        ctx.fillStyle = '#3f6212';
        ctx.fillRect(0, baseFloorY, w, h - baseFloorY + 30);
        ctx.fillStyle = '#ca8a04';
        for (let gx = w * 0.08; gx < w * 0.92; gx += 26) {
          ctx.beginPath();
          ctx.moveTo(gx, baseFloorY + 6);
          ctx.lineTo(gx - 5, baseFloorY - 9);
          ctx.lineTo(gx + 4, baseFloorY + 6);
          ctx.fill();
        }
      }

      // 3. Draw Climbing Rope & Placed Quickdraws along anchorIds
      const anchorPoints = anim.anchorIds.map((id) => {
        const hd = getHoldById(id);
        return { x: w * hd.xNorm, y: tierToY(hd.tier) };
      });
      const climberPx = w * anim.climberXNorm;
      const climberPy = tierToY(anim.climberTier);

      if (anchorPoints.length > 0) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(anchorPoints[0].x, anchorPoints[0].y + 8);
        for (let i = 1; i < anchorPoints.length; i++) {
          const prev = anchorPoints[i - 1];
          const curr = anchorPoints[i];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2 + 12;
          ctx.quadraticCurveTo(midX, midY, curr.x, curr.y);
        }
        ctx.lineTo(climberPx, climberPy - 4);
        ctx.stroke();
      }

      // 4. Draw Rock Features / Holds & Obstacles + Collect Hit Areas
      const nextScreenHolds: Array<{ id: string; px: number; py: number; radius: number }> = [];

      CLIFF_HOLDS.forEach((hold) => {
        const hx = w * hold.xNorm;
        const hy = tierToY(hold.tier);
        if (hy < -40 || hy > h + 40) return;

        const reachable = !state.won && isHoldReachable(currentHold, hold);
        const isCurrent = hold.id === state.currentHoldId;
        const isHovered = hold.id === state.hoveredHoldId;
        const ecoPicked = state.collectedEco.includes(hold.id);

        if (reachable) {
          nextScreenHolds.push({ id: hold.id, px: hx, py: hy, radius: 34 });
        }

        // Animated rock-specific visuals
        ctx.save();
        if (hold.kind === 'loose') {
          // Subtle micro-tremble + cracks
          const jitter = Math.sin(t * 14 + hold.col) * 1.1;
          ctx.translate(hx + jitter, hy);
          ctx.fillStyle = '#57534e';
          ctx.beginPath();
          ctx.moveTo(-22, 6);
          ctx.lineTo(-14, -10);
          ctx.lineTo(8, -12);
          ctx.lineTo(22, 4);
          ctx.lineTo(6, 12);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-8, -9);
          ctx.lineTo(0, 0);
          ctx.lineTo(-5, 9);
          ctx.moveTo(0, 0);
          ctx.lineTo(11, -4);
          ctx.stroke();
          // Falling dust grains
          const grainY = ((t * 28 + hold.tier * 13) % 24);
          ctx.fillStyle = 'rgba(214, 211, 209, 0.7)';
          ctx.fillRect(-6, 10 + grainY * 0.7, 2.5, 2.5);
          ctx.fillRect(8, 8 + ((grainY + 12) % 24) * 0.7, 2, 2);
        } else if (hold.kind === 'ice') {
          ctx.translate(hx, hy);
          ctx.fillStyle = '#bae6fd';
          ctx.beginPath();
          ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Icicle teeth below
          ctx.fillStyle = '#e0f2fe';
          [-10, 0, 10].forEach((ix) => {
            ctx.beginPath();
            ctx.moveTo(ix - 3, 9);
            ctx.lineTo(ix, 20);
            ctx.lineTo(ix + 3, 9);
            ctx.fill();
          });
        } else if (hold.kind === 'overhang') {
          ctx.translate(hx, hy);
          // Deep shadow roof below overhanging rock
          ctx.fillStyle = 'rgba(15, 10, 6, 0.7)';
          ctx.beginPath();
          ctx.ellipse(0, 11, 28, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#854d0e';
          ctx.beginPath();
          ctx.moveTo(-26, 2);
          ctx.lineTo(-16, -13);
          ctx.lineTo(18, -13);
          ctx.lineTo(27, 3);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (hold.kind === 'wind_fall') {
          ctx.translate(hx, hy);
          ctx.fillStyle = '#78716c';
          ctx.beginPath();
          ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          if (windHazardRef.current) {
            // Animated gust ribbons & falling pebbles
            ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
            ctx.lineWidth = 2;
            const shift = ((t * 95) % 44) - 22;
            ctx.beginPath();
            ctx.moveTo(-26 + shift * 0.4, -16);
            ctx.lineTo(22 + shift * 0.4, -10);
            ctx.moveTo(-20 - shift * 0.3, 6);
            ctx.lineTo(24 - shift * 0.3, 10);
            ctx.stroke();

            const stoneY = ((t * 110) % 48) - 34;
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.arc(-8, stoneY, 3, 0, Math.PI * 2);
            ctx.arc(9, ((stoneY + 24) % 48) - 34, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (hold.kind === 'eco') {
          ctx.translate(hx, hy);
          ctx.fillStyle = '#a16207';
          ctx.beginPath();
          ctx.ellipse(0, 2, 23, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          if (!ecoPicked) {
            // Small visible plastic bottle / wrapper on ledge
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-5, -13, 10, 13);
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(-3, -16, 6, 3);
          }
        } else if (hold.kind === 'summit') {
          ctx.translate(hx, hy);
          // Golden sunlit summit spire + Chakana pole
          ctx.fillStyle = '#f5b700';
          ctx.beginPath();
          ctx.ellipse(0, 6, 36, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff8e7';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 4);
          ctx.lineTo(0, -34);
          ctx.stroke();
          // Fluttering Wiphala/Chakana banner
          const wave = Math.sin(t * 5) * 2.5;
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(0, -34, 22, 6);
          ctx.fillStyle = '#f5b700';
          ctx.fillRect(0, -28, 22, 6 + wave * 0.2);
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(0, -22, 22, 6);
        } else {
          // Solid granite edge / base
          ctx.translate(hx, hy);
          ctx.fillStyle = hold.kind === 'base' ? '#65a30d' : '#b48a60';
          ctx.beginPath();
          ctx.moveTo(-22, 5);
          ctx.lineTo(-14, -9);
          ctx.lineTo(15, -9);
          ctx.lineTo(23, 5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        ctx.restore();

        // Highlight ring for reachable holds (tactile affordance)
        if (reachable) {
          const pulse = 1 + Math.sin(t * 4.5 + hold.col) * 0.08;
          ctx.strokeStyle = isHovered ? '#ffd166' : 'rgba(116, 198, 157, 0.85)';
          ctx.lineWidth = isHovered ? 3 : 2;
          ctx.beginPath();
          ctx.arc(hx, hy, 25 * pulse, 0, Math.PI * 2);
          ctx.stroke();
        } else if (isCurrent) {
          ctx.strokeStyle = '#f5b700';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(hx, hy, 22, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Crisp concise rock tag directly beneath reachable holds
        if (reachable || hold.kind === 'summit') {
          let tag = hold.name;
          let tagColor = '#f8fafc';
          if (hold.kind === 'wind_fall') {
            tag = windHazardRef.current ? '¡Ráfaga activa!' : 'En calma · Subir';
            tagColor = windHazardRef.current ? '#fca5a5' : '#86efac';
          } else if (hold.kind === 'ice') {
            tag = state.chalkActive ? 'Hielo (Listo c/ magnesio)' : 'Hielo resbaloso';
            tagColor = state.chalkActive ? '#86efac' : '#7dd3fc';
          } else if (hold.kind === 'loose') {
            tag = 'Roca suelta';
            tagColor = '#fca5a5';
          } else if (hold.kind === 'overhang') {
            tag = 'Extraplomo (-28% fuerza)';
            tagColor = '#fde047';
          } else if (hold.kind === 'eco' && !ecoPicked) {
            tag = 'Limpiar residuo (+16%)';
            tagColor = '#86efac';
          }

          ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
          const tw = ctx.measureText(tag).width + 12;
          ctx.fillStyle = 'rgba(8, 21, 35, 0.86)';
          drawRoundRect(ctx, hx - tw / 2, hy + 18, tw, 18, 6);
          ctx.fill();
          ctx.fillStyle = tagColor;
          ctx.textAlign = 'center';
          ctx.fillText(tag, hx, hy + 30.5);
        }
      });

      anim.screenHolds = nextScreenHolds;

      // 5. Animated Climber Figure (matching player avatar outfit, headwear, hair & palette)
      ctx.save();
      ctx.translate(climberPx, climberPy - 10);
      const isMoving = anim.moveProgress < 1;
      const reachArm = isMoving ? Math.sin(anim.moveProgress * Math.PI) * 11 : Math.sin(t * 2.5) * 1.5;
      const stepLeg = isMoving ? Math.sin(anim.moveProgress * Math.PI * 2) * 5 : 0;

      // Legs
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.lineTo(-9, 17 + stepLeg);
      ctx.moveTo(4, 6);
      ctx.lineTo(9, 17 - stepLeg);
      ctx.stroke();

      // Arms reaching up toward cliff holds
      ctx.strokeStyle = playerAvatar.skinTone || '#d19a6c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-7, -8);
      ctx.lineTo(-14, -20 - reachArm);
      ctx.moveTo(7, -8);
      ctx.lineTo(13, -18 + reachArm * 0.5);
      ctx.stroke();

      const paletteTorso: Record<AvatarConfig['palette'], string> = {
        tierra: '#8c3b2b',
        verde: '#1e4d3b',
        azul: '#1d4e89',
        armonia: '#7b4824'
      };
      const paletteAccent: Record<AvatarConfig['palette'], string> = {
        tierra: '#f5b700',
        verde: '#52b788',
        azul: '#4ea8de',
        armonia: '#f5b700'
      };
      const mainColor = paletteTorso[playerAvatar.palette] || '#8c3b2b';
      const accentColor = paletteAccent[playerAvatar.palette] || '#f5b700';

      // Flowing guardian cape behind torso if selected
      if (playerAvatar.outfit === 'capa_guardian') {
        ctx.fillStyle = '#0F2C4C';
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(-14, 14);
        ctx.lineTo(14, 14);
        ctx.lineTo(8, -10);
        ctx.closePath();
        ctx.fill();
      }

      // Outfit torso / skirt silhouettes
      if (playerAvatar.outfit === 'pollera_manta') {
        // Manta blouse + pleated pollera skirt
        ctx.fillStyle = mainColor;
        ctx.fillRect(-8, -11, 16, 11);
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.lineTo(13, 12);
        ctx.lineTo(-13, 12);
        ctx.closePath();
        ctx.fill();
      } else if (playerAvatar.outfit === 'poncho_tejido') {
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(-9, -11);
        ctx.lineTo(9, -11);
        ctx.lineTo(13, 4);
        ctx.lineTo(0, 10);
        ctx.lineTo(-13, 4);
        ctx.closePath();
        ctx.fill();
      } else {
        // Vest / classic torso
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(-10, 7);
        ctx.lineTo(-8, -11);
        ctx.lineTo(8, -11);
        ctx.lineTo(10, 7);
        ctx.closePath();
        ctx.fill();
      }

      // Harness waist belt + chalk glow if active
      ctx.fillStyle = state.chalkActive ? '#fde047' : '#f5b700';
      ctx.fillRect(-9, 2, 18, 3);

      // Braids or flowing hair behind head
      const hairCol = playerAvatar.hairColor || '#1B1817';
      if (playerAvatar.hairStyle === 'trenzas_tullmas' || playerAvatar.hairStyle === 'trenzas_dobles') {
        ctx.strokeStyle = hairCol;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-6, -15);
        ctx.lineTo(-9, -2);
        ctx.moveTo(6, -15);
        ctx.lineTo(9, -2);
        ctx.stroke();
      } else if (playerAvatar.hairStyle === 'cabello_suelto') {
        ctx.fillStyle = hairCol;
        ctx.beginPath();
        ctx.arc(0, -15, 8.2, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
      }

      // Head
      ctx.fillStyle = playerAvatar.skinTone || '#d19a6c';
      ctx.beginPath();
      ctx.arc(0, -17, 7, 0, Math.PI * 2);
      ctx.fill();

      // Hair crown
      ctx.fillStyle = hairCol;
      ctx.beginPath();
      ctx.arc(0, -18.5, 7, Math.PI, 0);
      ctx.fill();

      // Headwear
      if (playerAvatar.headwear === 'sombrero_bombin') {
        ctx.fillStyle = '#29211B';
        ctx.fillRect(-10, -22, 20, 2.5);
        ctx.fillRect(-6, -28, 12, 6);
        ctx.fillStyle = accentColor;
        ctx.fillRect(-6, -23.5, 12, 1.5);
      } else if (playerAvatar.headwear === 'vincha_chakana') {
        ctx.fillStyle = accentColor;
        ctx.fillRect(-7.5, -22, 15, 3);
        ctx.fillStyle = '#FFF8E7';
        ctx.fillRect(-1.5, -22, 3, 3);
      } else if (playerAvatar.headwear === 'chullo') {
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(0, -19, 7.6, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-7.5, -19, 3, 6);
        ctx.fillRect(4.5, -19, 3, 6);
        ctx.fillStyle = '#FFF8E7';
        ctx.beginPath();
        ctx.arc(0, -27.5, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 6. Dust / Chalk / Pebble / Gold Particles
      for (let i = anim.particles.length - 1; i >= 0; i--) {
        const p = anim.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          anim.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 120 * dt;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Red slip tint flash
      if (anim.slipFlash > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${anim.slipFlash * 0.22})`;
        ctx.fillRect(0, 0, w, h);
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, [playerAvatar]);

  // Pointer Hit-Testing directly on the Rock Holds
  const findHoldAtPointer = (clientX: number, clientY: number): CliffHold | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (const entry of animRef.current.screenHolds) {
      const dx = x - entry.px;
      const dy = y - entry.py;
      if (dx * dx + dy * dy <= (entry.radius + 10) * (entry.radius + 10)) {
        return getHoldById(entry.id);
      }
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = findHoldAtPointer(e.clientX, e.clientY);
    if (hit) attemptClimb(hit);
  };

  const handleCanvasMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hit = findHoldAtPointer(e.clientX, e.clientY);
    setHoveredHoldId(hit ? hit.id : null);
  };

  const currentHold = getHoldById(currentHoldId);
  const reachableHolds = CLIFF_HOLDS.filter((h) => !won && isHoldReachable(currentHold, h));
  const inspectedHold = hoveredHoldId ? getHoldById(hoveredHoldId) : null;

  return (
    <div className="space-y-3">
      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-3 text-[#E2DDD2]">
          <span className="font-mono-num">
            Altura:{' '}
            <strong className="text-[#F5B700]">
              {Math.round(currentHold.tier * 25 + 4000)} m
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Agarre:{' '}
            <strong className={grip < 30 ? 'text-[#FCA5A5]' : 'text-[#52B788]'}>{grip}%</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Sin huella: <strong className="text-[#74C69D]">{collectedEco.length}/2</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">
            Resbalones: <strong className="text-[#FCA5A5]">{slips}</strong>
          </span>
        </div>

        {!won && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
            Reiniciar pared
          </button>
        )}
      </div>

      {/* Live Animated Granite Cliff Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D9A05B]/45 bg-[#0B1D2E] shadow-xl">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onPointerMove={handleCanvasMove}
          onPointerDown={handleCanvasMove}
          onPointerLeave={() => setHoveredHoldId(null)}
          className={`block w-full touch-manipulation ${
            hoveredHoldId ? 'cursor-pointer' : 'cursor-default'
          }`}
        />
      </div>

      {/* Live Rock Clue / Wind Readout Below Cliff Canvas */}
      <div className="rounded-xl bg-[#081523] border border-white/15 px-3.5 py-2 text-xs text-[#FFF8E7]">
        {inspectedHold ? (
          <span>
            <strong className="text-[#FFD166]">{inspectedHold.name}:</strong> {inspectedHold.clue}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Wind
              className={`w-3.5 h-3.5 shrink-0 ${
                windHazardActive ? 'text-[#FCA5A5]' : 'text-[#74C69D]'
              }`}
            />
            <span>
              Viento en canaletas:{' '}
              <strong className={windHazardActive ? 'text-[#FCA5A5]' : 'text-[#86efac]'}>
                {windHazardActive ? 'Ráfaga activa (peligro)' : 'En calma (seguro)'}
              </strong>
            </span>
          </span>
        )}
      </div>

      {/* Tactical Climbing Tools & Accessible Decisions */}
      {!won && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            disabled={chalkActive || chalkCharges <= 0}
            onClick={handleUseChalk}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              chalkActive
                ? 'bg-[#1E4D3B] border-[#52B788] text-[#ECFDF5]'
                : chalkCharges <= 0
                  ? 'bg-[#081523] border-white/10 text-[#64748B] cursor-not-allowed'
                  : 'bg-[#17334E] hover:bg-[#1D4E89] border-[#4EA8DE]/45 text-[#FFF8E7] cursor-pointer'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFD166] shrink-0" />
            <span>
              {chalkActive
                ? 'Magnesio activo (listo para hielo/techo)'
                : `Aplicar Magnesio (${chalkCharges} restantes)`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleRest}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0D2134] hover:bg-[#17334E] border border-[#D9A05B]/45 text-xs sm:text-sm font-semibold text-[#FFF8E7] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#74C69D] shrink-0" />
            <span>Respirar en repisa (+30% agarre)</span>
          </button>
        </div>
      )}

      {/* Keyboard / Mobile Accessibility Shortcut Strip mirroring the visible rock holds */}
      {!won && reachableHolds.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#A3B1BF] mr-1">O elige agarre directo:</span>
          {reachableHolds.map((h) => (
            <button
              key={h.id}
              type="button"
              onMouseEnter={() => setHoveredHoldId(h.id)}
              onMouseLeave={() => setHoveredHoldId(null)}
              onClick={() => attemptClimb(h)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#081523] hover:bg-[#17334E] border border-[#D9A05B]/35 text-[11px] font-medium text-[#FFF8E7] inline-flex items-center gap-1 cursor-pointer"
            >
              <Mountain className="w-3 h-3 text-[#F5B700]" />
              <span>{h.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Feedback Banner with Full-Body Climber Avatar */}
      <div
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs sm:text-sm border ${
          won
            ? 'bg-[#1E4D3B]/65 border-[#52B788] text-[#ECFDF5]'
            : 'bg-[#081523] border-white/10 text-[#D8D3C8]'
        }`}
      >
        <AymaraFullBodyAvatar
          config={playerAvatar}
          pose={won ? 'cheer' : 'climb'}
          className="w-11 h-[68px] shrink-0"
          showGroundShadow={false}
        />
        <div className="min-w-0 flex items-start gap-2">
          {won && <CheckCircle2 className="w-4 h-4 text-[#52B788] shrink-0 mt-0.5" />}
          <span className="leading-snug">{statusMsg}</span>
        </div>
      </div>
    </div>
  );
};
