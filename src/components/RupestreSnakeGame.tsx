import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Palette, RotateCcw, Sparkles } from 'lucide-react';
import { ASSETS } from '../data/defaultStages';
import { AvatarConfig, DEFAULT_AVATAR } from '../types/game';
import { observeElementResize } from '../utils/canvasHelpers';
import { soundEngine } from '../utils/sound';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface RupestreSnakeGameProps {
  playerAvatar?: AvatarConfig;
  playerName?: string;
  alreadySolved?: boolean;
  onSolved: () => void;
}

type PigmentId = 'rojo' | 'amarillo';

const PIGMENTS: Record<PigmentId, { label: string; stroke: string; glow: string; mineral: string }> = {
  rojo: {
    label: 'Rojo Ocre',
    mineral: 'Óxido de hierro (Hematita)',
    stroke: '#C84B31',
    glow: '#F87171'
  },
  amarillo: {
    label: 'Amarillo Ocre',
    mineral: 'Limonita andina',
    stroke: '#E5A93B',
    glow: '#FDE047'
  }
};

// Normalized points (0..1) aligned to the real white mineral rock-art motifs in Qillqantiji
// Traces: Left crowned head -> Central upper fork & Top head -> Stepped zigzag spine -> Right 3-pronged head
const SNAKE_NODES: Array<{ x: number; y: number; isHead?: boolean; headAngle?: number }> = [
  { x: 0.08, y: 0.36, isHead: true, headAngle: -Math.PI / 2 }, // 1: Left crowned head
  { x: 0.19, y: 0.45 }, // 2: Left companion figure
  { x: 0.34, y: 0.34 }, // 3: Mid-left crowned motif
  { x: 0.49, y: 0.34 }, // 4: Central junction
  { x: 0.49, y: 0.20, isHead: true, headAngle: -Math.PI / 2 }, // 5: Top-center head
  { x: 0.60, y: 0.41 }, // 6: Upper zigzag bend
  { x: 0.49, y: 0.52 }, // 7: Middle zigzag bend
  { x: 0.65, y: 0.57 }, // 8: Lower-mid zigzag bend
  { x: 0.50, y: 0.70 }, // 9: Lower stepped spine
  { x: 0.69, y: 0.78 }, // 10: Bottom curve
  { x: 0.81, y: 0.70 }, // 11: Right ascending tail
  { x: 0.81, y: 0.54, isHead: true, headAngle: -Math.PI / 2 } // 12: Right 3-pronged head
];

export const RupestreSnakeGame: React.FC<RupestreSnakeGameProps> = ({
  playerAvatar = DEFAULT_AVATAR,
  playerName = 'Viajero',
  alreadySolved = false,
  onSolved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>
  >([]);
  const connectedCountRef = useRef(alreadySolved ? SNAKE_NODES.length : 1);
  const pigmentRef = useRef<PigmentId>('rojo');
  const isDraggingRef = useRef(false);
  const [pigment, setPigment] = useState<PigmentId>('rojo');
  const [connectedCount, setConnectedCount] = useState(alreadySolved ? SNAKE_NODES.length : 1);
  const [isPainting, setIsPainting] = useState(false);

  const solved = connectedCount >= SNAKE_NODES.length;

  useEffect(() => {
    connectedCountRef.current = connectedCount;
  }, [connectedCount]);

  useEffect(() => {
    pigmentRef.current = pigment;
  }, [pigment]);

  useEffect(() => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      bgImageRef.current = img;
    };
    img.src = ASSETS.QILLQANTIJI_SNAKE;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let last = performance.now();

    const syncSize = () => {
      const w = canvas.clientWidth || 560;
      const h = canvas.clientHeight || 370;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncSize();
    const stopResizeObserver = observeElementResize(canvas.parentElement, syncSize);

    const drawSerpentHead = (
      x: number,
      y: number,
      angle: number,
      active: boolean,
      activePig: { stroke: string; glow: string }
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // 3-Pronged Andean Yaya-Mama Crown Rays
      ctx.strokeStyle = active ? activePig.glow : 'rgba(255, 248, 231, 0.45)';
      ctx.lineWidth = active ? 2.4 : 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(22, 0);
      ctx.moveTo(8, -5);
      ctx.lineTo(20, -10);
      ctx.moveTo(8, 5);
      ctx.lineTo(20, 10);
      ctx.stroke();

      // Crown ray tips
      ctx.fillStyle = active ? activePig.glow : 'rgba(255, 248, 231, 0.5)';
      [
        [22, 0],
        [20, -10],
        [20, 10]
      ].forEach(([tx, ty]) => {
        ctx.beginPath();
        ctx.arc(tx, ty, active ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Diamond Serpent Head
      ctx.fillStyle = active ? activePig.stroke : 'rgba(255, 248, 231, 0.25)';
      ctx.strokeStyle = active ? activePig.glow : 'rgba(255, 248, 231, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-7, -11);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-7, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (active) {
        ctx.fillStyle = '#FFF8E7';
        ctx.beginPath();
        ctx.arc(3, -3.5, 1.5, 0, Math.PI * 2);
        ctx.arc(3, 3.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const w = canvas.clientWidth || 560;
      const h = canvas.clientHeight || 370;
      const count = connectedCountRef.current;
      const isSolved = count >= SNAKE_NODES.length;
      const activePig = PIGMENTS[pigmentRef.current];

      ctx.clearRect(0, 0, w, h);

      // Authentic Qillqantiji Rock-Art Backdrop (object-cover math)
      const img = bgImageRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.fillStyle = 'rgba(12, 15, 20, 0.24)';
        ctx.fillRect(0, 0, w, h);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#3D3B38');
        grad.addColorStop(1, '#1E1E20');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Faint ghost dotted guide along the real rock-art serpent
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 248, 231, 0.36)';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      SNAKE_NODES.forEach((n, idx) => {
        const px = n.x * w;
        const py = n.y * h;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Drawn pigment path so far
      if (count >= 2) {
        ctx.save();
        ctx.strokeStyle = activePig.stroke;
        ctx.lineWidth = isSolved ? 10 : 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = activePig.glow;
        ctx.shadowBlur = isSolved ? 18 : 8;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const n = SNAKE_NODES[i];
          const px = n.x * w;
          const py = n.y * h;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = activePig.glow;
        ctx.lineWidth = 2.8;
        ctx.stroke();
        ctx.restore();
      }

      // Live brush line from last connected node to active pointer
      if (!isSolved && isDraggingRef.current && pointerPosRef.current && count >= 1) {
        const prevNode = SNAKE_NODES[count - 1];
        const ptr = pointerPosRef.current;
        ctx.save();
        ctx.strokeStyle = activePig.glow;
        ctx.globalAlpha = 0.72;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevNode.x * w, prevNode.y * h);
        ctx.lineTo(ptr.x, ptr.y);
        ctx.stroke();

        // Mineral brush tip aura
        ctx.fillStyle = activePig.glow;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw 3 Serpent Heads once reached
      SNAKE_NODES.forEach((n, idx) => {
        if (n.isHead) {
          drawSerpentHead(
            n.x * w,
            n.y * h,
            n.headAngle ?? -Math.PI / 2,
            count >= idx + 1,
            activePig
          );
        }
      });

      // Draw Interactive Dots + Pulsing Halo on Next Target
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.006);
      SNAKE_NODES.forEach((n, idx) => {
        const px = n.x * w;
        const py = n.y * h;
        const done = idx < count;
        const isNext = idx === count;

        if (isSolved && !n.isHead) return;

        if (isNext) {
          ctx.save();
          ctx.strokeStyle = '#F5B700';
          ctx.globalAlpha = 0.25 + (1 - pulse) * 0.55;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(px, py, 16 + pulse * 9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.fillStyle = done ? activePig.stroke : isNext ? '#F5B700' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = isNext ? '#FFF8E7' : done ? activePig.glow : '#CBD5E1';
        ctx.lineWidth = isNext ? 2.5 : 1.8;
        ctx.beginPath();
        ctx.arc(px, py, isNext ? 14 : 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isNext ? '#1A1207' : '#FFF8E7';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), px, py + 0.5);
        ctx.restore();
      });

      // Pigment dust burst particles
      const pts = particlesRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        const pt = pts[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          pts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.min(1, pt.life * 1.8);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => {
      cancelAnimationFrame(rafId);
      stopResizeObserver();
    };
  }, []);

  const tryHitNextDot = useCallback((clientX: number, clientY: number) => {
    const count = connectedCountRef.current;
    if (count >= SNAKE_NODES.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    pointerPosRef.current = { x, y };

    const target = SNAKE_NODES[count];
    if (!target) return;
    const tx = target.x * rect.width;
    const ty = target.y * rect.height;

    if (Math.hypot(x - tx, y - ty) <= 32) {
      const next = count + 1;
      connectedCountRef.current = next;
      setConnectedCount(next);

      const pig = PIGMENTS[pigmentRef.current];
      const burstCount = next >= SNAKE_NODES.length ? 22 : 10;
      for (let i = 0; i < burstCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 25 + Math.random() * 65;
        particlesRef.current.push({
          x: tx,
          y: ty,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          color: i % 2 === 0 ? pig.glow : '#FFF8E7',
          life: 0.5 + Math.random() * 0.35
        });
      }

      if (next >= SNAKE_NODES.length) {
        soundEngine.playRelicUnlock();
      } else {
        soundEngine.playTileSwap();
      }
    }
  }, []);

  const handleReset = () => {
    soundEngine.playClick();
    connectedCountRef.current = 1;
    particlesRef.current = [];
    pointerPosRef.current = null;
    setConnectedCount(1);
  };

  return (
    <div className="space-y-3">
      {/* Pigment Picker & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081523] border border-[#D9A05B]/35 rounded-xl px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D8D3C8]">
            <Palette className="w-4 h-4 text-[#F5B700]" />
            Pigmento:
          </span>
          {(['rojo', 'amarillo'] as PigmentId[]).map((pid) => {
            const p = PIGMENTS[pid];
            const active = pigment === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setPigment(pid);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#17334E] border-[#F5B700] text-[#FFF8E7]'
                    : 'bg-[#0D2134] border-white/15 text-[#9FB3C8] hover:text-white'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.stroke }} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono-num text-[#FFD166]">
            Puntos: {connectedCount}/{SNAKE_NODES.length}
          </span>
          {!solved && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-[#E2DDD2] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D9A05B]" />
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Rock Wall Canvas */}
      <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-[#78716C]/75 bg-[#1E1E20] shadow-2xl">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            setIsPainting(true);
            tryHitNextDot(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (isDraggingRef.current) tryHitNextDot(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            isDraggingRef.current = false;
            setIsPainting(false);
            pointerPosRef.current = null;
          }}
          onPointerLeave={() => {
            isDraggingRef.current = false;
            setIsPainting(false);
            pointerPosRef.current = null;
          }}
          className="block w-full h-full touch-none cursor-crosshair"
        />
      </div>

      {!solved && (
        <div className="rounded-xl bg-[#081523] border border-[#D9A05B]/35 px-3.5 py-2 flex items-center gap-3 text-xs sm:text-sm text-[#FFD166]">
          <AymaraFullBodyAvatar
            config={playerAvatar}
            pose={isPainting ? 'paint' : 'idle'}
            heldItem="brush"
            className="w-11 h-[68px] shrink-0"
            showGroundShadow={false}
          />
          <p className="leading-snug">
            <strong className="text-[#FFF8E7]">{playerName}</strong> traza con pigmento mineral: une los puntos en orden (1 → {SNAKE_NODES.length}) para restaurar la Serpiente de 3 Cabezas (<span className="text-[#E2DDD2]">{PIGMENTS[pigment].mineral}</span>).
          </p>
        </div>
      )}

      {solved && (
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
                <span>¡Arte rupestre Yaya-Mama (tradición padre-madre) restaurado!</span>
              </div>
              <p className="text-xs text-[#E2DDD2]">
                <Sparkles className="w-3.5 h-3.5 inline text-[#F5B700] mr-1" />
                Devolviste su trazo sagrado en {PIGMENTS[pigment].label} a la Serpiente de 3 Cabezas de Qillqantiji (abrigo rocoso pintado).
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
