import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { AvatarConfig, DEFAULT_AVATAR } from '../types/game';
import { drawRoundRect, observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface PlatoPacenoGameProps {
  playerAvatar?: AvatarConfig;
  playerName?: string;
  alreadySolved?: boolean;
  onSolved: () => void;
}

type IngredientId = 'choclo' | 'papa' | 'haba' | 'queso';
type FallingKind = IngredientId | 'piedra';

interface FallingItem {
  id: number;
  kind: FallingKind;
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  radius: number;
}

interface FloatingPop {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

const TARGET_PER_INGREDIENT = 2; // 2x choclo, 2x papa, 2x haba, 2x queso = 8 total
const INGREDIENT_META: Record<IngredientId, { label: string; color: string }> = {
  choclo: { label: 'Choclo', color: '#F5B700' },
  papa: { label: 'Papa', color: '#C8926E' },
  haba: { label: 'Haba', color: '#52B788' },
  queso: { label: 'Queso', color: '#FFE082' }
};

export const PlatoPacenoGame: React.FC<PlatoPacenoGameProps> = ({
  playerAvatar = DEFAULT_AVATAR,
  playerName = 'Viajero',
  alreadySolved = false,
  onSolved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarTrackRef = useRef<HTMLDivElement | null>(null);
  const [counts, setCounts] = useState<Record<IngredientId, number>>(
    alreadySolved
      ? { choclo: 2, papa: 2, haba: 2, queso: 2 }
      : { choclo: 0, papa: 0, haba: 0, queso: 0 }
  );
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(alreadySolved);

  const stateRef = useRef({
    plateX: 0.5, // normalized 0.1..0.9
    targetPlateX: 0.5,
    moveDir: 0, // -1 | 0 | 1 for buttons/keys
    items: [] as FallingItem[],
    pops: [] as FloatingPop[],
    spawnTimer: 0.4,
    nextId: 1,
    counts: alreadySolved
      ? { choclo: 2, papa: 2, haba: 2, queso: 2 }
      : { choclo: 0, papa: 0, haba: 0, queso: 0 },
    lives: 3,
    won: alreadySolved,
    gameOver: false,
    shake: 0
  });

  const resetGame = useCallback(() => {
    soundEngine.playClick();
    const freshCounts = { choclo: 0, papa: 0, haba: 0, queso: 0 };
    stateRef.current = {
      plateX: 0.5,
      targetPlateX: 0.5,
      moveDir: 0,
      items: [],
      pops: [],
      spawnTimer: 0.35,
      nextId: 1,
      counts: freshCounts,
      lives: 3,
      won: false,
      gameOver: false,
      shake: 0
    };
    setCounts(freshCounts);
    setLives(3);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        stateRef.current.moveDir = -1;
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        stateRef.current.moveDir = 1;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowLeft' ||
        e.key.toLowerCase() === 'a' ||
        e.key === 'ArrowRight' ||
        e.key.toLowerCase() === 'd'
      ) {
        stateRef.current.moveDir = 0;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let backdropImg: HTMLImageElement | null = null;
    let backdropReady = false;
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      backdropImg = img;
      backdropReady = true;
    };
    img.src = ASSETS.MURALES_CAFETERIA;

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

    const drawItem = (kind: FallingKind, x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      if (kind === 'choclo') {
        // Golden Andean corn cob with green husk tips
        ctx.fillStyle = '#3E7B3A';
        ctx.beginPath();
        ctx.ellipse(-7, 6, 6, 13, -0.35, 0, Math.PI * 2);
        ctx.ellipse(7, 6, 6, 13, 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F5B700';
        ctx.strokeStyle = '#92400E';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, -1, 9.5, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFE57F';
        for (let r = -10; r <= 8; r += 6) {
          ctx.beginPath();
          ctx.arc(-3, r, 2, 0, Math.PI * 2);
          ctx.arc(3, r + 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (kind === 'papa') {
        // Speckled highland potato
        ctx.fillStyle = '#B87D52';
        ctx.strokeStyle = '#5C3820';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 11, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#6E4528';
        ctx.beginPath();
        ctx.arc(-5, -3, 1.8, 0, Math.PI * 2);
        ctx.arc(4, 2, 1.5, 0, Math.PI * 2);
        ctx.arc(1, -5, 1.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'haba') {
        // Green broad bean pod
        ctx.fillStyle = '#40916C';
        ctx.strokeStyle = '#1B4332';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-14, 4);
        ctx.quadraticCurveTo(0, -12, 15, -2);
        ctx.quadraticCurveTo(2, 12, -14, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#95D5B2';
        ctx.beginPath();
        ctx.arc(-4, 1, 3.2, 0, Math.PI * 2);
        ctx.arc(5, -1, 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'queso') {
        // Fried golden cheese slice
        ctx.fillStyle = '#FFF3B0';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, -13, -10, 26, 20, 4);
        ctx.fill();
        ctx.stroke();
        // Crispy golden sear marks
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-7, -5);
        ctx.lineTo(5, 4);
        ctx.moveTo(-4, 5);
        ctx.lineTo(8, -4);
        ctx.stroke();
      } else {
        // Obstacle: Falling stone / ember
        ctx.fillStyle = '#4B5563';
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-12, -4);
        ctx.lineTo(-4, -13);
        ctx.lineTo(9, -10);
        ctx.lineTo(13, 3);
        ctx.lineTo(3, 12);
        ctx.lineTo(-10, 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.arc(-2, -1, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const pickSpawnKind = (): FallingKind => {
      const st = stateRef.current;
      const c = st.counts;
      const needed: IngredientId[] = (['choclo', 'papa', 'haba', 'queso'] as IngredientId[]).filter(
        (k) => c[k] < TARGET_PER_INGREDIENT
      );
      if (st.nextId > 2 && Math.random() < 0.24) return 'piedra';
      if (needed.length > 0 && Math.random() < 0.92) {
        return needed[Math.floor(Math.random() * needed.length)];
      }
      const all: IngredientId[] = ['choclo', 'papa', 'haba', 'queso'];
      return all[Math.floor(Math.random() * all.length)];
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = canvas.clientWidth || 500;
      const h = canvas.clientHeight || 320;
      const st = stateRef.current;

      // Update plate movement
      if (st.moveDir !== 0) {
        st.targetPlateX = Math.max(0.11, Math.min(0.89, st.targetPlateX + st.moveDir * dt * 0.72));
      }
      st.plateX += (st.targetPlateX - st.plateX) * Math.min(1, dt * 16);
      st.shake = Math.max(0, st.shake - dt * 4);

      const platePixelX = st.plateX * w + (st.shake > 0 ? Math.sin(now * 0.06) * 6 * st.shake : 0);
      const platePixelY = h - 34;

      if (avatarTrackRef.current) {
        const avatarPx = Math.max(26, Math.min(w - 26, platePixelX - 66));
        const deltaX = st.targetPlateX - st.plateX;
        const movingDir = Math.abs(deltaX) > 0.01 ? (deltaX < 0 ? -1 : 1) : 1;
        avatarTrackRef.current.style.left = `${(avatarPx / w) * 100}%`;
        avatarTrackRef.current.style.transform = `translate(-50%, 0) scaleX(${movingDir})`;
      }

      // Spawn & physics
      if (!st.won && !st.gameOver) {
        st.spawnTimer -= dt;
        if (st.spawnTimer <= 0) {
          st.spawnTimer = 0.62 + Math.random() * 0.35;
          const kind = pickSpawnKind();
          st.items.push({
            id: st.nextId++,
            kind,
            x: 32 + Math.random() * (w - 64),
            y: -22,
            vy: kind === 'piedra' ? 145 + Math.random() * 45 : 120 + Math.random() * 45,
            rot: (Math.random() - 0.5) * 0.5,
            vr: (Math.random() - 0.5) * 1.4,
            radius: 16
          });
        }

        for (let i = st.items.length - 1; i >= 0; i--) {
          const item = st.items[i];
          item.y += item.vy * dt;
          item.rot += item.vr * dt;

          const caught =
            Math.abs(item.x - platePixelX) < 50 &&
            item.y >= platePixelY - 22 &&
            item.y <= platePixelY + 14;

          if (caught) {
            st.items.splice(i, 1);
            if (item.kind === 'piedra') {
              soundEngine.playWrong();
              st.shake = 1;
              st.lives = Math.max(0, st.lives - 1);
              setLives(st.lives);
              st.pops.push({
                x: item.x,
                y: platePixelY - 24,
                text: '¡Piedra!',
                color: '#FCA5A5',
                life: 0.9
              });
              if (st.lives <= 0) {
                st.gameOver = true;
                setGameOver(true);
              }
            } else {
              soundEngine.playTileSwap();
              const prevVal = st.counts[item.kind];
              const alreadyMaxed = prevVal >= TARGET_PER_INGREDIENT;
              const nextVal = Math.min(TARGET_PER_INGREDIENT, prevVal + 1);
              st.counts = { ...st.counts, [item.kind]: nextVal };
              setCounts(st.counts);
              st.pops.push({
                x: item.x,
                y: platePixelY - 24,
                text: alreadyMaxed
                  ? `${INGREDIENT_META[item.kind].label} 2/2 ¡Listo!`
                  : `+ ${INGREDIENT_META[item.kind].label}`,
                color: alreadyMaxed ? '#7DD3FC' : INGREDIENT_META[item.kind].color,
                life: 0.9
              });

              const allReady = (Object.keys(INGREDIENT_META) as IngredientId[]).every(
                (k) => st.counts[k] >= TARGET_PER_INGREDIENT
              );
              if (allReady) {
                soundEngine.playRelicUnlock();
                st.won = true;
                setWon(true);
              }
            }
            continue;
          }

          if (item.y > h + 30) {
            st.items.splice(i, 1);
          }
        }
      }

      // Draw background (Andean night plaza silhouette + subtle Peñas street backdrop)
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#071525');
      bg.addColorStop(0.65, '#122B40');
      bg.addColorStop(1, '#261B12');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (backdropReady && backdropImg) {
        ctx.save();
        ctx.globalAlpha = 0.28;
        const scale = Math.max(w / backdropImg.width, h / backdropImg.height);
        const dw = backdropImg.width * scale;
        const dh = backdropImg.height * scale;
        ctx.drawImage(backdropImg, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
        ctx.restore();
      }

      // Distant snow peaks
      ctx.fillStyle = 'rgba(24, 54, 79, 0.72)';
      ctx.beginPath();
      ctx.moveTo(0, h - 55);
      ctx.lineTo(w * 0.22, h - 110);
      ctx.lineTo(w * 0.48, h - 72);
      ctx.lineTo(w * 0.72, h - 125);
      ctx.lineTo(w, h - 65);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Table strip
      ctx.fillStyle = '#3B2514';
      ctx.fillRect(0, h - 22, w, 22);
      ctx.fillStyle = '#D9A05B';
      ctx.fillRect(0, h - 22, w, 2);

      // Falling items + subtle micro-tag while still needed
      for (const item of st.items) {
        drawItem(item.kind, item.x, item.y, item.rot);
        if (item.kind !== 'piedra' && st.counts[item.kind] === 0) {
          ctx.save();
          ctx.fillStyle = 'rgba(8, 21, 35, 0.78)';
          drawRoundRect(ctx, item.x - 22, item.y + 17, 44, 14, 4);
          ctx.fill();
          ctx.fillStyle = INGREDIENT_META[item.kind].color;
          ctx.font = 'bold 9.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(INGREDIENT_META[item.kind].label, item.x, item.y + 24);
          ctx.restore();
        }
      }

      // Ceramic Plate
      ctx.save();
      ctx.translate(platePixelX, platePixelY);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 12, 52, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E5DEC9';
      ctx.strokeStyle = '#8C5A2B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 52, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 41, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Mini preview of gathered ingredients resting on plate
      if (st.counts.papa > 0) drawItem('papa', -20, -2, -0.2);
      if (st.counts.choclo > 0) drawItem('choclo', 0, -4, 0.35);
      if (st.counts.haba > 0) drawItem('haba', 19, -1, 0.2);
      if (st.counts.queso > 0) drawItem('queso', 6, -6, 0.1);

      // Gentle warm steam wisps once hot ingredients are on the plate
      const collectedSum = st.counts.papa + st.counts.choclo + st.counts.haba + st.counts.queso;
      if (collectedSum > 0) {
        ctx.strokeStyle = 'rgba(255, 248, 231, 0.32)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let s = 0; s < 3; s++) {
          const sx = (s - 1) * 18;
          const wave = Math.sin(now * 0.004 + s * 1.4) * 5;
          ctx.beginPath();
          ctx.moveTo(sx, -12);
          ctx.quadraticCurveTo(sx + wave, -24, sx - wave * 0.6, -36 - (s % 2) * 6);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Floating pops
      for (let i = st.pops.length - 1; i >= 0; i--) {
        const p = st.pops[i];
        p.y -= 32 * dt;
        p.life -= dt;
        if (p.life <= 0) {
          st.pops.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        ctx.fillStyle = p.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, []);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const norm = (e.clientX - rect.left) / Math.max(1, rect.width);
    stateRef.current.targetPlateX = Math.max(0.11, Math.min(0.89, norm));
  };

  return (
    <div className="space-y-3">
      {/* Ingredient Checklist + Lives HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {(Object.keys(INGREDIENT_META) as IngredientId[]).map((k) => {
            const done = counts[k] >= TARGET_PER_INGREDIENT;
            return (
              <span
                key={k}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono-num ${
                  done
                    ? 'bg-[#1E4D3B]/65 border-[#52B788] text-[#ECFDF5]'
                    : 'bg-[#0D2134] border-white/15 text-[#E2DDD2]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: INGREDIENT_META[k].color }}
                />
                <span>
                  {INGREDIENT_META[k].label}: {counts[k]}/{TARGET_PER_INGREDIENT}
                </span>
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < lives ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#475569]'}`}
            />
          ))}
        </div>
      </div>

      {/* Playfield Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D9A05B]/45 bg-[#081523] shadow-xl">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointer}
          onPointerMove={handlePointer}
          className="block w-full touch-none cursor-ew-resize"
        />

        {/* 60fps Synced Full-Body Player Avatar Catcher */}
        <div
          ref={avatarTrackRef}
          className="pointer-events-none absolute bottom-1 z-10 w-11 h-[68px]"
          style={{ left: '38%', transform: 'translate(-50%, 0)' }}
        >
          <AymaraFullBodyAvatar
            config={playerAvatar}
            pose={won ? 'cheer' : 'walk'}
            walking={!won && !gameOver}
            className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)]"
            showGroundShadow={false}
          />
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-[#050E17]/85 flex flex-col items-center justify-center p-4 text-center gap-3">
            <div className="font-display text-lg font-bold text-[#FCA5A5]">
              ¡Cayeron demasiadas piedras en el plato!
            </div>
            <p className="text-xs text-[#D8D3C8] max-w-sm">
              Esquiva las piedras ardientes y atrapa choclo, papa, habas y queso para armar el Plato Paceño de 1781.
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>

      {/* Touch-Friendly Left/Right Buttons */}
      {!won && !gameOver && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onPointerDown={() => (stateRef.current.moveDir = -1)}
            onPointerUp={() => (stateRef.current.moveDir = 0)}
            onPointerLeave={() => (stateRef.current.moveDir = 0)}
            className="min-h-[44px] rounded-xl bg-[#17334E] hover:bg-[#1D4E89] border border-[#4EA8DE]/40 text-sm font-bold text-[#FFF8E7] flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Mover Izquierda
          </button>
          <button
            type="button"
            onPointerDown={() => (stateRef.current.moveDir = 1)}
            onPointerUp={() => (stateRef.current.moveDir = 0)}
            onPointerLeave={() => (stateRef.current.moveDir = 0)}
            className="min-h-[44px] rounded-xl bg-[#17334E] hover:bg-[#1D4E89] border border-[#4EA8DE]/40 text-sm font-bold text-[#FFF8E7] flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            Mover Derecha
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {won && (
        <div className="rounded-xl bg-gradient-to-r from-[#1E4D3B]/80 via-[#17334E]/85 to-[#2B1D0E]/85 border border-[#F5B700]/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AymaraFullBodyAvatar
              config={playerAvatar}
              pose="cheer"
              className="w-11 h-[68px] shrink-0"
              showGroundShadow={false}
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>¡Plato Paceño completo, {playerName}!</span>
              </div>
              <p className="text-xs text-[#E2DDD2]">
                <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
                Reuniste choclo, papa, habas y queso frito como en el cerco de 1781.
              </p>
            </div>
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
