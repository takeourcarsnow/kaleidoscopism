export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => t * t * (3 - 2 * t);
export const map01 = (x, a, b) => clamp((x - a) / (b - a), 0, 1);
export const toRad = d => d * Math.PI / 180;
export const hsla = (h, s, l, a = 1) => `hsla(${(h % 360 + 360) % 360},${s}%,${l}%,${a})`;

export function preventDoubleTapZoom() {
  let last = 0;
  document.addEventListener('touchend', (e) => {
    const t = Date.now();
    if (t - last < 300) e.preventDefault();
    last = t;
  }, { passive: false });
}