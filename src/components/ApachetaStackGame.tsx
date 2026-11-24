import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';

interface ApachetaStackGameProps {
  alreadySolved?: boolean;
  onSolved: () => void;
}

interface PlacedStone {
  cx: number; // pixel x
  y: number; // pixel bottom y
  w: number;
  h: number;
  shade: string;
  tilt?: number;
}

interface FallingTumble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  shade: string;
}

interface PrecisionPop {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

const TARGET_STONES = 5;
const STONE_SHADES = ['#78716C', '#6B655E', '#847C73', '#5E5851', '#8F867C'];

export const ApachetaStackGame: React.FC<ApachetaStackGameProps> = ({
  alreadySolved = false,
  onSolved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stackedCount, setStackedCount] = useState(alreadySolved ? TARGET_STONES : 0);
  const [statusMsg, setStatusMsg] = useState(
    alreadySolved
      ? '¡Apacheta de 5 piedras en equilibrio sagrado!'
      : 'Toca la roca o presiona «Soltar Piedra» cuando quede centrada sobre la anterior.'
  );
  const [falls, setFalls] = useState(0);

  const solved = stackedCount >= TARGET_STONES;

  const gameRef = useRef({
    w: 520,
    h: 310,
    placed: [] as PlacedStone[],
    missedStone: null as FallingTumble | null,
    swingX: 260,
    swingDir: 1,
    swingSpeed: 155,
    dropping: false,
    dropY: 56,
    dropVy: 0,
    stoneW: 112,
    stoneH: 24,
    won: alreadySolved,
    shake: 0,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number }>,
    pops: [] as PrecisionPop[]
  });

  const initBase = useCallback(
    (w: number, h: number, prefillSolved: boolean) => {
      const baseW = 136;
      const baseH = 26;
      const baseY = h - 38;
      const base: PlacedStone = {
        cx: w / 2,
        y: baseY,
        w: baseW,
        h: baseH,
        shade: '#4A4540'
      };
      const placed: PlacedStone[] = [base];
      if (prefillSolved) {
        let curW = 112;
        let curY = baseY - baseH;
        for (let i = 0; i < TARGET_STONES; i++) {
          placed.push({
            cx: w / 2,
            y: curY,
            w: curW,
            h: 24,
            shade: STONE_SHADES[i % STONE_SHADES.length]
          });
          curY -= 24;
          curW -= 10;
        }
      }
      gameRef.current.placed = placed;
      gameRef.current.w = w;
      gameRef.current.h = h;
      gameRef.current.swingX = w / 2;
      gameRef.current.stoneW = prefillSolved ? 72 : 112;
      gameRef.current.dropY = 52;
    },
    []
  );

  const triggerDrop = useCallback(() => {
    const g = gameRef.current;
    if (g.won || g.dropping || g.missedStone) return;
    soundEngine.playClick();
    g.dropping = true;
    g.dropVy = 120;
  }, []);

  const handleReset = useCallback(() => {
    soundEngine.playClick();
    const g = gameRef.current;
    g.won = false;
    g.dropping = false;
    g.missedStone = null;
    g.pops = [];
    g.particles = [];
    g.dropY = 52;
    g.dropVy = 0;
    g.swingSpeed = 155;
    initBase(g.w, g.h, false);
    setStackedCount(0);
    setFalls(0);
    setStatusMsg('Toca la roca o presiona «Soltar Piedra» cuando quede centrada sobre la anterior.');
  }, [initBase]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        triggerDrop();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [triggerDrop]);

  useEffect(() => {
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
      const h = 310;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBase(w, h, gameRef.current.won);
    };
    resize();
    const stopResizeObserver = observeElementResize(canvas.parentElement, resize);

    const drawStoneShape = (
      cx: number,
      bottomY: number,
      w: number,
      h: number,
      color: string,
      tilt = 0
    ) => {
      const x = -w / 2;
      const y = -h;
      ctx.save();
      ctx.translate(cx, bottomY);
      if (tilt !== 0) ctx.rotate(tilt);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 6, y);
      ctx.lineTo(x + w - 7, y + 1);
      ctx.lineTo(x + w, y + h * 0.55);
      ctx.lineTo(x + w - 4, 0);
      ctx.lineTo(x + 4, 0);
      ctx.lineTo(x, y + h * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Highlight bevel
      ctx.strokeStyle = 'rgba(255, 248, 231, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 3);
      ctx.lineTo(x + w - 10, y + 3);
      ctx.stroke();
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const g = gameRef.current;
      const w = g.w;
      const h = g.h;
      g.shake = Math.max(0, g.shake - dt * 4);

      if (g.missedStone) {
        g.missedStone.x += g.missedStone.vx * dt;
        g.missedStone.vy += 680 * dt;
        g.missedStone.y += g.missedStone.vy * dt;
        g.missedStone.rot += g.missedStone.vr * dt;
        if (g.missedStone.y > h + 45) {
          g.missedStone = null;
          g.dropY = 52;
          g.dropVy = 0;
        }
      }

      if (!g.won && !g.missedStone) {
        if (!g.dropping) {
          g.swingX += g.swingDir * g.swingSpeed * dt;
          const minX = Math.max(70, w / 2 - 145);
          const maxX = Math.min(w - 70, w / 2 + 145);
          if (g.swingX >= maxX) {
            g.swingX = maxX;
            g.swingDir = -1;
          } else if (g.swingX <= minX) {
            g.swingX = minX;
            g.swingDir = 1;
          }
        } else {
          g.dropVy += 680 * dt;
          g.dropY += g.dropVy * dt;

          const topStone = g.placed[g.placed.length - 1];
          const targetBottomY = topStone.y - topStone.h;

          if (g.dropY >= targetBottomY) {
            const signedDx = g.swingX - topStone.cx;
            const dx = Math.abs(signedDx);
            const maxTolerance = topStone.w * 0.52;

            if (dx <= maxTolerance) {
              // Success! Settle stone onto Apacheta
              const placedCountNow = g.placed.length;
              const shade = STONE_SHADES[(placedCountNow - 1) % STONE_SHADES.length];
              const isPerfect = dx <= 12;
              const isEdge = dx > topStone.w * 0.32;
              const tilt = isEdge ? Math.sign(signedDx) * 0.055 : 0;

              g.placed.push({
                cx: g.swingX,
                y: targetBottomY,
                w: g.stoneW,
                h: g.stoneH,
                shade,
                tilt
              });

              g.pops.push({
                x: g.swingX,
                y: targetBottomY - g.stoneH - 8,
                text: isPerfect ? '¡Centro perfecto!' : isEdge ? '¡Al borde!' : '¡Bien!',
                color: isPerfect ? '#F5B700' : isEdge ? '#7DD3FC' : '#52B788',
                life: 0.9
              });

              for (let p = 0; p < (isPerfect ? 16 : 10); p++) {
                g.particles.push({
                  x: g.swingX + (Math.random() - 0.5) * g.stoneW * 0.7,
                  y: targetBottomY,
                  vx: (Math.random() - 0.5) * 95,
                  vy: -25 - Math.random() * 55,
                  life: 0.65
                });
              }

              const nextStacked = g.placed.length - 1;
              setStackedCount(nextStacked);

              if (nextStacked >= TARGET_STONES) {
                soundEngine.playRelicUnlock();
                g.won = true;
                g.dropping = false;
                setStatusMsg('¡Equilibrio perfecto! Has levantado una Apacheta sagrada para la Pachamama.');
              } else {
                soundEngine.playTileSwap();
                g.dropping = false;
                g.dropY = 52;
                g.dropVy = 0;
                g.stoneW = Math.max(70, g.stoneW - 10);
                g.swingSpeed = 155 + nextStacked * 24;
                setStatusMsg(`¡Piedra ${nextStacked}/${TARGET_STONES} en equilibrio! Sigue subiendo.`);
              }
            } else {
              // Missed / Toppled off with tumbling animation!
              soundEngine.playWrong();
              g.shake = 1;
              g.dropping = false;
              const dir = Math.sign(signedDx) || 1;
              const shade = STONE_SHADES[(g.placed.length - 1) % STONE_SHADES.length];
              g.missedStone = {
                x: g.swingX,
                y: targetBottomY,
                vx: dir * 105,
                vy: -85,
                rot: 0,
                vr: dir * 5.2,
                w: g.stoneW,
                h: g.stoneH,
                shade
              };
              for (let p = 0; p < 8; p++) {
                g.particles.push({
                  x: topStone.cx + dir * (topStone.w * 0.45),
                  y: targetBottomY,
                  vx: dir * (20 + Math.random() * 70),
                  vy: -20 - Math.random() * 45,
                  life: 0.55
                });
              }
              setFalls((f) => f + 1);
              setStatusMsg('¡Resbaló por un borde! Apunta más cerca del centro para sostener el equilibrio.');
            }
          }
        }
      }

      // Draw Calvario Sunset Sky & Ruins Backdrop
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#10243C');
      bg.addColorStop(0.62, '#2B4257');
      bg.addColorStop(1, '#4E3929');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Calvario hill silhouette
      ctx.fillStyle = '#2A231E';
      ctx.beginPath();
      ctx.moveTo(0, h - 38);
      ctx.quadraticCurveTo(w * 0.5, h - 78, w, h - 38);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Ground altar rock
      ctx.fillStyle = '#3B342D';
      ctx.fillRect(0, h - 38, w, 38);

      const shakeX = g.shake > 0 ? Math.sin(now * 0.07) * 6 * g.shake : 0;
      ctx.save();
      ctx.translate(shakeX, 0);

      // Draw placed Apacheta stones
      g.placed.forEach((st) => {
        drawStoneShape(st.cx, st.y, st.w, st.h, st.shade, st.tilt || 0);
      });

      // Celebratory golden aura + k'oa sprig when Apacheta is complete
      if (g.won && g.placed.length > 0) {
        const crown = g.placed[g.placed.length - 1];
        const crownTopY = crown.y - crown.h;
        ctx.save();
        const aura = ctx.createRadialGradient(crown.cx, crownTopY, 6, crown.cx, crownTopY, 95);
        aura.addColorStop(0, 'rgba(245, 183, 0, 0.35)');
        aura.addColorStop(1, 'rgba(245, 183, 0, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(crown.cx, crownTopY, 95, 0, Math.PI * 2);
        ctx.fill();

        // K'oa blessing sprig atop summit stone
        ctx.strokeStyle = '#52B788';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(crown.cx, crownTopY);
        ctx.quadraticCurveTo(crown.cx - 8, crownTopY - 14, crown.cx - 12, crownTopY - 22);
        ctx.moveTo(crown.cx, crownTopY);
        ctx.quadraticCurveTo(crown.cx + 7, crownTopY - 16, crown.cx + 11, crownTopY - 24);
        ctx.stroke();
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(crown.cx - 12, crownTopY - 22, 3, 0, Math.PI * 2);
        ctx.arc(crown.cx + 11, crownTopY - 24, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw tumbling missed stone
      if (g.missedStone) {
        drawStoneShape(
          g.missedStone.x,
          g.missedStone.y,
          g.missedStone.w,
          g.missedStone.h,
          g.missedStone.shade,
          g.missedStone.rot
        );
      }

      // Draw active swinging / falling stone
      if (!g.won && !g.missedStone) {
        const activeColor = STONE_SHADES[(g.placed.length - 1) % STONE_SHADES.length];
        drawStoneShape(g.swingX, g.dropY, g.stoneW, g.stoneH, activeColor, 0);

        // Subtle alignment plumb line hint
        ctx.strokeStyle = 'rgba(245, 183, 0, 0.22)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(g.swingX, g.dropY + 2);
        ctx.lineTo(g.swingX, h - 38);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Dust particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 120 * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Precision callout pops
      for (let i = g.pops.length - 1; i >= 0; i--) {
        const pop = g.pops[i];
        pop.y -= 24 * dt;
        pop.life -= dt;
        if (pop.life <= 0) {
          g.pops.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.min(1, pop.life * 1.6);
        ctx.fillStyle = pop.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();
      }
      ctx.restore();

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, [initBase]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-[#E2DDD2]">
          <span className="font-mono-num">
            Piedras: <strong className="text-[#F5B700]">{stackedCount}/{TARGET_STONES}</strong>
          </span>
          {falls > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-[#FCA5A5]">Deslices: {falls}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
          Reiniciar
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-[#78716C]/70 bg-[#1A1E24] shadow-2xl">
        <canvas
          ref={canvasRef}
          onClick={triggerDrop}
          className="block w-full touch-none cursor-pointer"
        />
      </div>

      {!solved ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={triggerDrop}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <ArrowDown className="w-4 h-4" />
            <span>Soltar Piedra ({stackedCount + 1}/{TARGET_STONES})</span>
          </button>
          <p className="text-xs text-[#D8D3C8] text-center">{statusMsg}</p>
        </div>
      ) : (
        <div className="rounded-xl bg-gradient-to-r from-[#1E4D3B]/80 via-[#17334E]/85 to-[#2B1D0E]/85 border border-[#F5B700]/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
              <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
              <span>¡Apacheta levantada por la prosperidad!</span>
            </div>
            <p className="text-xs text-[#E2DDD2]">
              <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
              {statusMsg}
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
