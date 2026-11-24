/**
 * Cross-browser rounded rectangle path compatible with iOS Safari < 15.4
 * and older Android WebViews where CanvasRenderingContext2D.prototype.roundRect
 * is not implemented.
 */
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Safely observes container size changes, falling back to window 'resize' and
 * 'orientationchange' events on older mobile browsers without ResizeObserver.
 */
export function observeElementResize(
  el: Element | null,
  onResize: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let ro: ResizeObserver | null = null;
  if (el && typeof ResizeObserver !== 'undefined') {
    try {
      ro = new ResizeObserver(() => onResize());
      ro.observe(el);
    } catch {
      ro = null;
    }
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  return () => {
    if (ro) {
      ro.disconnect();
    }
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
  };
}
