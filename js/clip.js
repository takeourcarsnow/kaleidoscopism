import { state } from './state.js';
import { ctx, getDPR } from './canvas.js';

let clipCache = { path: null, key: '' };
function clipKey(){
  return [
    state.boundsRegion, state.edgePad, state.circleRadiusPct, state.rectWpct, state.rectHpct,
    state.width, state.height
  ].join('|');
}

export function updateClipPath(){
  const key = clipKey();
  if (clipCache.key === key) return;
  clipCache.key = key;

  const pad = state.edgePad;
  const p = new Path2D();
  if (state.boundsRegion === 'screen'){
    p.rect(0+pad, 0+pad, state.width - pad*2, state.height - pad*2);
  } else if (state.boundsRegion === 'circle'){
    const R = (Math.min(state.width, state.height) * 0.5) * (state.circleRadiusPct/100) - pad;
    p.arc(state.cx, state.cy, Math.max(5, R), 0, Math.PI*2);
  } else {
    const rw = (state.rectWpct/100) * state.width * 0.5 - pad;
    const rh = (state.rectHpct/100) * state.height * 0.5 - pad;
    p.rect(state.cx - rw, state.cy - rh, rw*2, rh*2);
  }
  clipCache.path = p;
}

export function isClipNeeded(){
  if (state.boundsBehavior === 'hide') return true;
  if (!state.clipDraw) return false;
  if (state.boundsRegion === 'screen' && state.edgePad === 0) return false;
  return true;
}

export function withClipDraw(fn){
  if (!isClipNeeded()){
    fn();
    return;
  }
  const DPR = getDPR();
  ctx.save();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.beginPath();
  ctx.clip(clipCache.path);
  fn();
  ctx.restore();
}

export function drawBoundsOverlay(){
  if (!state.showBounds) return;
  const DPR = getDPR();
  ctx.save();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6,6]);

  const pad = state.edgePad;
  if (state.boundsRegion === 'screen'){
    ctx.strokeRect(0+pad, 0+pad, state.width - pad*2, state.height - pad*2);
  } else if (state.boundsRegion === 'circle'){
    const R = (Math.min(state.width, state.height) * 0.5) * (state.circleRadiusPct/100) - pad;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, Math.max(5, R), 0, Math.PI*2);
    ctx.stroke();
  } else if (state.boundsRegion === 'rect'){
    const rw = (state.rectWpct/100) * state.width * 0.5 - pad;
    const rh = (state.rectHpct/100) * state.height * 0.5 - pad;
    ctx.strokeRect(state.cx - rw, state.cy - rh, rw*2, rh*2);
  }
  ctx.setLineDash([]);
  ctx.restore();
}