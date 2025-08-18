import { state } from './state.js';

export const canvas = document.getElementById('c');
export const ctx = canvas.getContext('2d', { alpha: true });

let DPR_MAX = 2;
let DPR = Math.min(DPR_MAX, window.devicePixelRatio || 1);
export function getDPR() { return DPR; }
export function setDprMax(v) { DPR_MAX = v; DPR = Math.min(DPR_MAX, window.devicePixelRatio || 1); }

export function resize(preserve = false) {
  let prevBitmap = null;
  if (preserve && canvas.transferToImageBitmap) {
    try { prevBitmap = canvas.transferToImageBitmap(); } catch(_) {}
  }
  DPR = Math.min(DPR_MAX, window.devicePixelRatio || 1);
  const w = Math.floor(window.innerWidth);
  const h = Math.floor(window.innerHeight);
  canvas.width = Math.floor(w * DPR);
  canvas.height = Math.floor(h * DPR);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  state.width = w; state.height = h; state.cx = w/2; state.cy = h/2;
  paintBackground(true);
  if (!state.sensor.inited) {
    state.sensor.x = state.cx; state.sensor.y = state.cy;
    state.sensor.lastX = state.cx; state.sensor.lastY = state.cy;
  }
  if (preserve && prevBitmap) {
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(prevBitmap, 0, 0, w, h);
    ctx.restore(); prevBitmap.close?.();
  }
}

export function paintBackground(hard=false) {
  ctx.save();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if (hard) ctx.clearRect(0,0,state.width,state.height);
  if (state.bgMode === 'light') {
    ctx.fillStyle = 'rgba(250,252,255,1)'; ctx.fillRect(0,0,state.width,state.height);
  } else if (state.bgMode === 'deep') {
    const g = ctx.createRadialGradient(state.cx, state.cy, Math.min(state.width,state.height)*0.1, state.cx, state.cy, Math.max(state.width,state.height));
    g.addColorStop(0, 'rgba(10,10,20,1)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g; ctx.fillRect(0,0,state.width,state.height);
  } else {
    ctx.fillStyle = 'rgba(5,5,8,1)'; ctx.fillRect(0,0,state.width,state.height);
  }
  ctx.restore();
}