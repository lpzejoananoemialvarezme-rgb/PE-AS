import { StoryScenePhoto } from '../data/defaultStages';

export interface StoryPostcardOptions {
  scene: StoryScenePhoto;
  avatarSvg: SVGSVGElement | null;
  playerName: string;
  rankTitle: string;
  travelerTypeTitle: string;
  shareUrl: string;
}

function loadImage(src: string, timeoutMs = 10000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`Timeout loading ${src}`));
    }, timeoutMs);

    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetW: number,
  targetH: number
) {
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const targetRatio = targetW / targetH;
  let drawW = targetW;
  let drawH = targetH;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > targetRatio) {
    drawH = targetH;
    drawW = targetH * imgRatio;
    offsetX = -(drawW - targetW) / 2;
  } else {
    drawW = targetW;
    drawH = targetW / imgRatio;
    offsetY = -(drawH - targetH) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawAguayoStrip(ctx: CanvasRenderingContext2D, y: number, width: number) {
  const bands = [
    { h: 8, color: '#8C3B2B' },
    { h: 6, color: '#F5B700' },
    { h: 8, color: '#1E4D3B' },
    { h: 8, color: '#1D4E89' },
    { h: 6, color: '#D9A05B' }
  ];
  let curY = y;
  for (const band of bands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, curY, width, band.h);
    curY += band.h;
  }
}

function drawChakana(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  const u = size / 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - u, cy - 3 * u);
  ctx.lineTo(cx + u, cy - 3 * u);
  ctx.lineTo(cx + u, cy - 2 * u);
  ctx.lineTo(cx + 2 * u, cy - 2 * u);
  ctx.lineTo(cx + 2 * u, cy - u);
  ctx.lineTo(cx + 3 * u, cy - u);
  ctx.lineTo(cx + 3 * u, cy + u);
  ctx.lineTo(cx + 2 * u, cy + u);
  ctx.lineTo(cx + 2 * u, cy + 2 * u);
  ctx.lineTo(cx + u, cy + 2 * u);
  ctx.lineTo(cx + u, cy + 3 * u);
  ctx.lineTo(cx - u, cy + 3 * u);
  ctx.lineTo(cx - u, cy + 2 * u);
  ctx.lineTo(cx - 2 * u, cy + 2 * u);
  ctx.lineTo(cx - 2 * u, cy + u);
  ctx.lineTo(cx - 3 * u, cy + u);
  ctx.lineTo(cx - 3 * u, cy - u);
  ctx.lineTo(cx - 2 * u, cy - u);
  ctx.lineTo(cx - 2 * u, cy - 2 * u);
  ctx.lineTo(cx - u, cy - 2 * u);
  ctx.closePath();
  ctx.fill();
}

export async function renderInstagramStoryBlob(options: StoryPostcardOptions): Promise<Blob> {
  const W = 1080;
  const H = 1920;

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, 1200))
      ]);
    } catch {
      // ignore font loading timeout
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D no disponible');

  // 1. Background Peñas Real Photo
  let bgImg: HTMLImageElement | null = null;
  try {
    bgImg = await loadImage(options.scene.imageUrl);
  } catch {
    try {
      bgImg = await loadImage(options.scene.fallbackUrl);
    } catch {
      bgImg = null;
    }
  }

  if (bgImg) {
    drawCoverImage(ctx, bgImg, W, H);
  } else {
    const fallbackGrad = ctx.createLinearGradient(0, 0, 0, H);
    fallbackGrad.addColorStop(0, '#0B1D2E');
    fallbackGrad.addColorStop(0.55, '#1E4D3B');
    fallbackGrad.addColorStop(1, '#6B4423');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Measured Top & Bottom Scrim Gradients for Legible Editorial Typography
  const topGrad = ctx.createLinearGradient(0, 0, 0, 560);
  topGrad.addColorStop(0, 'rgba(6, 15, 25, 0.90)');
  topGrad.addColorStop(0.55, 'rgba(6, 15, 25, 0.45)');
  topGrad.addColorStop(1, 'rgba(6, 15, 25, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 560);

  const bottomGrad = ctx.createLinearGradient(0, 860, 0, H);
  bottomGrad.addColorStop(0, 'rgba(6, 15, 25, 0)');
  bottomGrad.addColorStop(0.35, 'rgba(8, 21, 35, 0.72)');
  bottomGrad.addColorStop(0.75, 'rgba(8, 21, 35, 0.94)');
  bottomGrad.addColorStop(1, 'rgba(6, 15, 25, 0.98)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, 860, W, H - 860);

  // 3. Top & Bottom Aguayo Woven Strips + Subtle Gold Frame
  drawAguayoStrip(ctx, 0, W);
  drawAguayoStrip(ctx, H - 36, W);

  ctx.strokeStyle = 'rgba(245, 183, 0, 0.45)';
  ctx.lineWidth = 4;
  roundRectPath(ctx, 32, 58, W - 64, H - 116, 36);
  ctx.stroke();

  // 4. Top Brand Header
  drawChakana(ctx, W / 2, 130, 56, '#F5B700');

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD166';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PEÑAS · LA PAZ, BOLIVIA · 4.000 M', W / 2, 206);

  ctx.fillStyle = '#FFF8E7';
  ctx.font = '700 44px "Cinzel", Georgia, serif';
  ctx.fillText('SENDERO DEL GUARDIÁN', W / 2, 266);

  // 5. Golden Aura + Serialized Aymara Avatar
  const avatarSize = 580;
  const avatarX = (W - avatarSize) / 2;
  const avatarY = 560;
  const aura = ctx.createRadialGradient(
    W / 2,
    avatarY + avatarSize / 2,
    60,
    W / 2,
    avatarY + avatarSize / 2,
    360
  );
  aura.addColorStop(0, 'rgba(245, 183, 0, 0.52)');
  aura.addColorStop(0.55, 'rgba(82, 183, 136, 0.22)');
  aura.addColorStop(1, 'rgba(8, 21, 35, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(W / 2, avatarY + avatarSize / 2, 360, 0, Math.PI * 2);
  ctx.fill();

  if (options.avatarSvg) {
    const clone = options.avatarSvg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(avatarSize));
    clone.setAttribute('height', String(avatarSize));
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    try {
      const avatarImg = await loadImage(svgUrl);
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  // 6. Player Identity & Traveler Type Block
  ctx.textAlign = 'center';
  ctx.fillStyle = '#52B788';
  ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(options.rankTitle.toUpperCase(), W / 2, 1245);

  ctx.fillStyle = '#FFF8E7';
  ctx.font = '700 60px "Cinzel", Georgia, serif';
  ctx.fillText(options.playerName, W / 2, 1320, W - 120);

  ctx.fillStyle = '#FFD166';
  ctx.font = '700 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(options.travelerTypeTitle, W / 2, 1386, W - 120);

  // 7. Bottom Game Callout Card (Clean, no hashtags or extra copy)
  const cardX = 96;
  const cardY = 1475;
  const cardW = W - 192;
  const cardH = 210;

  ctx.fillStyle = 'rgba(13, 33, 52, 0.94)';
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fill();
  ctx.strokeStyle = '#F5B700';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#FFD166';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Juega gratis y aprende sobre Peñas', W / 2, cardY + 72, cardW - 60);

  // Clean URL Box inside card
  const urlDisplay = options.shareUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  ctx.fillStyle = '#081523';
  roundRectPath(ctx, cardX + 44, cardY + 102, cardW - 88, 72, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(78, 168, 222, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#4EA8DE';
  ctx.font = '700 27px "JetBrains Mono", monospace';
  ctx.fillText(urlDisplay, W / 2, cardY + 148, cardW - 128);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('No se pudo generar la postal PNG'));
      },
      'image/png',
      0.95
    );
  });
}
