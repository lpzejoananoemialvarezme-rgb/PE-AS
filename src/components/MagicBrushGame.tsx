import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Brush, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { AvatarConfig, DEFAULT_AVATAR } from '../types/game';
import { observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface MagicBrushGameProps {
  playerAvatar?: AvatarConfig;
  playerName?: string;
  alreadySolved?: boolean;
  onSolved: () => void;
}

const GRID_COLS = 14;
const GRID_ROWS = 9;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
const TARGET_PERCENT = 78;

export const MagicBrushGame: React.FC<MagicBrushGameProps> = ({
  playerAvatar = DEFAULT_AVATAR,
  playerName = 'Viajero',
  alreadySolved = false,
  onSolved
}) => {
  const dustCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparkleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visitedRef = useRef<Uint8Array>(new Uint8Array(TOTAL_CELLS));
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundRef = useRef(0);
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }>
  >([]);
  const [clearedPct, setClearedPct] = useState(alreadySolved ? 100 : 0);
  const [revealed, setRevealed] = useState(alreadySolved);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const paintDustOverlay = useCallback(() => {
    if (revealed) return;
    const canvas = dustCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth || 560;
    const h = canvas.clientHeight || 315;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Centuries-old dust & shadow patina over the colonial retablo (no overlaid text)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#3D352B');
    grad.addColorStop(0.5, '#594C3C');
    grad.addColorStop(1, '#2D251C');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle stone/dust speckles
    for (let i = 0; i < 240; i++) {
      const sx = ((i * 73) % 100) * (w / 100);
      const sy = ((i * 47) % 100) * (h / 100);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(215, 198, 170, 0.14)' : 'rgba(20, 15, 10, 0.22)';
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + (i % 5), 0, Math.PI * 2);
      ctx.fill();
    }
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;
    paintDustOverlay();
    const canvas = dustCanvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    return observeElementResize(canvas.parentElement, () => {
      paintDustOverlay();
    });
  }, [paintDustOverlay, revealed]);

  useEffect(() => {
    const sCanvas = sparkleCanvasRef.current;
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    if (!sCtx) return;

    let rafId = 0;
    let last = performance.now();

    const syncSize = () => {
      const w = sCanvas.clientWidth || 560;
      const h = sCanvas.clientHeight || 315;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sCanvas.width = w * dpr;
      sCanvas.height = h * dpr;
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncSize();
    const stopResizeObserver = observeElementResize(sCanvas.parentElement, syncSize);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = sCanvas.clientWidth || 560;
      const h = sCanvas.clientHeight || 315;
      sCtx.clearRect(0, 0, w, h);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const pt = list[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 40 * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          list.splice(i, 1);
          continue;
        }
        const alpha = Math.max(0, pt.life / pt.maxLife);
        sCtx.save();
        sCtx.globalAlpha = alpha;
        sCtx.fillStyle = '#FFE082';
        sCtx.shadowColor = '#F5B700';
        sCtx.shadowBlur = 8;
        sCtx.beginPath();
        sCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.restore();
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, []);

  const scrubAt = (clientX: number, clientY: number, isStart = false) => {
    if (revealed) return;
    const canvas = dustCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const brushR = Math.max(26, Math.min(38, w * 0.065));

    const prev = isStart || !lastPosRef.current ? { x, y } : lastPosRef.current;
    lastPosRef.current = { x, y };

    const dist = Math.hypot(x - prev.x, y - prev.y);
    const steps = Math.max(1, Math.ceil(dist / (brushR * 0.35)));

    for (let s = 0; s <= steps; s++) {
      const t = steps === 0 ? 1 : s / steps;
      const sx = prev.x + (x - prev.x) * t;
      const sy = prev.y + (y - prev.y) * t;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const rg = ctx.createRadialGradient(sx, sy, brushR * 0.25, sx, sy, brushR);
      rg.addColorStop(0, 'rgba(0,0,0,1)');
      rg.addColorStop(0.75, 'rgba(0,0,0,0.88)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(sx, sy, brushR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Mark grid cells along interpolated path
      const colStart = Math.max(0, Math.floor(((sx - brushR * 0.7) / w) * GRID_COLS));
      const colEnd = Math.min(GRID_COLS - 1, Math.floor(((sx + brushR * 0.7) / w) * GRID_COLS));
      const rowStart = Math.max(0, Math.floor(((sy - brushR * 0.7) / h) * GRID_ROWS));
      const rowEnd = Math.min(GRID_ROWS - 1, Math.floor(((sy + brushR * 0.7) / h) * GRID_ROWS));

      for (let r = rowStart; r <= rowEnd; r++) {
        for (let c = colStart; c <= colEnd; c++) {
          visitedRef.current[r * GRID_COLS + c] = 1;
        }
      }
    }

    // Emit subtle golden brush sparkles
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * 42,
        vy: -18 - Math.random() * 28,
        size: 1.8 + Math.random() * 2.2,
        life: 0.45 + Math.random() * 0.25,
        maxLife: 0.7
      });
    }

    let clearedCount = 0;
    for (let i = 0; i < TOTAL_CELLS; i++) {
      if (visitedRef.current[i] === 1) clearedCount++;
    }
    const pct = Math.min(100, Math.round((clearedCount / TOTAL_CELLS) * 100));
    setClearedPct(pct);

    const now = performance.now();
    if (now - lastSoundRef.current > 180) {
      lastSoundRef.current = now;
      soundEngine.playTileSwap();
    }

    if (pct >= TARGET_PERCENT) {
      ctx.clearRect(0, 0, w, h);
      setClearedPct(100);
      setRevealed(true);
      lastPosRef.current = null;
      for (let i = 0; i < 36; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 90,
          vy: -30 - Math.random() * 70,
          size: 2.2 + Math.random() * 3.2,
          life: 0.9 + Math.random() * 0.5,
          maxLife: 1.4
        });
      }
      soundEngine.playRelicUnlock();
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    visitedRef.current = new Uint8Array(TOTAL_CELLS);
    lastPosRef.current = null;
    particlesRef.current = [];
    setClearedPct(0);
    setRevealed(false);
    setIsScrubbing(false);
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-[#E2DDD2]">
          <Brush className="w-4 h-4 text-[#F5B700]" />
          <span>
            Pan de oro revelado:{' '}
            <strong className="font-mono-num text-[#FFD166]">{clearedPct}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!revealed && (
            <span className="text-[11px] text-[#A3B1BF]">Meta: {TARGET_PERCENT}%</span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-xs font-medium text-[#E2DDD2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
            Reiniciar polvo
          </button>
        </div>
      </div>

      {/* Swipe-to-Reveal Canvas Frame (Unobstructed clean glowing photo on completion) */}
      <div
        className={`relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 bg-[#1C140C] select-none transition-all duration-700 ${
          revealed
            ? 'border-[#F5B700] shadow-[0_0_38px_rgba(245,183,0,0.45)]'
            : 'border-[#D9A05B]/55 shadow-2xl'
        }`}
      >
        {!imgError ? (
          <img
            src={ASSETS.CHURCH_INTERIOR}
            alt="Retablo colonial en pan de oro del Templo de Peñas"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-center transition-all duration-700 ${
              revealed ? 'brightness-125 contrast-105 saturate-125 scale-[1.02]' : 'brightness-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#8C5A2B] via-[#F5B700] to-[#3E2712]" />
        )}

        {/* Radiant Golden Glow Overlay when revealed (no text covering image) */}
        {revealed && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#F5B700]/22 via-transparent to-[#FFF8E7]/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1/2 left-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-[#FFF8E7]/35 to-transparent animate-sun-sweep"
            />
          </>
        )}

        {/* Interactive Dust Canvas Layer (completely removed once revealed) */}
        {!revealed && (
          <canvas
            ref={dustCanvasRef}
            onPointerDown={(e) => {
              isDrawingRef.current = true;
              setIsScrubbing(true);
              scrubAt(e.clientX, e.clientY, true);
            }}
            onPointerMove={(e) => {
              if (isDrawingRef.current) scrubAt(e.clientX, e.clientY, false);
            }}
            onPointerUp={() => {
              isDrawingRef.current = false;
              setIsScrubbing(false);
              lastPosRef.current = null;
            }}
            onPointerLeave={() => {
              isDrawingRef.current = false;
              setIsScrubbing(false);
              lastPosRef.current = null;
            }}
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          />
        )}

        {/* Golden Sparkle Particles Layer */}
        <canvas
          ref={sparkleCanvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
      </div>

      {/* Instruction / Reveal Caption with Full-Body Avatar Restorer */}
      {!revealed ? (
        <div className="rounded-xl bg-[#081523] border border-white/10 px-3.5 py-2 flex items-center gap-3 text-xs sm:text-sm text-[#D8D3C8]">
          <AymaraFullBodyAvatar
            config={playerAvatar}
            pose={isScrubbing ? 'paint' : 'idle'}
            heldItem="brush"
            className="w-11 h-[68px] shrink-0"
            showGroundShadow={false}
          />
          <p className="leading-snug">
            <strong className="text-[#FFD166]">{playerName}</strong> limpia el retablo: desliza el dedo o el cursor sobre el polvo del tiempo hasta revelar el pan de oro.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-gradient-to-r from-[#1E4D3B]/80 via-[#17334E]/85 to-[#2B1D0E]/85 border border-[#F5B700]/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AymaraFullBodyAvatar
              config={playerAvatar}
              pose="cheer"
              heldItem="brush"
              className="w-11 h-[68px] shrink-0"
              showGroundShadow={false}
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#FFD166]">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>¡Brillo colonial restaurado!</span>
              </div>
              <p className="text-xs text-[#E2DDD2]">
                <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
                Retablo barroco en pan de oro · Templo Colonial y Pisadas de la Virgen de Peñas.
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
