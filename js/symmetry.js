import { state } from './state.js';
import { toRad } from './utils.js';
import { drawByBrush } from './brush.js';
import { withClipDraw } from './clip.js';

function rotateAround(x,y, cx,cy, ang){
  const dx = x - cx, dy = y - cy;
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: cx + dx*c - dy*s, y: cy + dx*s + dy*c };
}
function reflectAcrossAxis(p, ang){
  const dx = p.x - state.cx, dy = p.y - state.cy;
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const dot = dx*ux + dy*uy;
  const rx = 2*dot*ux - dx, ry = 2*dot*uy - dy;
  return { x: state.cx + rx, y: state.cy + ry };
}

export function drawSymmetricSegment(a, b, dt=16, dist=null){
  const copies = Math.max(1, Math.floor(state.symmetry));
  const base = state.rotOffset + toRad(state.symAngleDeg);
  const emit = (pa, pb) => drawByBrush(pa, pb, dt, dist);

  const mode = state.symMode;
  if (mode === 'off'){ emit(a,b); return; }

  const doRotate = (p, ang) => rotateAround(p.x, p.y, state.cx, state.cy, ang);

  if (mode === 'radial' || mode === 'radial-kaleido'){
    const step = (Math.PI*2) / copies;
    for (let i=0; i<copies; i++){
      const ang = i*step + base;
      const ra = doRotate(a, ang), rb = doRotate(b, ang);
      emit(ra, rb);
      if (mode === 'radial-kaleido'){
        const ka = reflectAcrossAxis(ra, ang), kb = reflectAcrossAxis(rb, ang);
        emit(ka, kb);
      }
    }
    return;
  }

  const axisStep = Math.PI / copies;

  if (mode === 'mirror-vertical'){
    const baseAxis = Math.PI/2;
    for (let i=0; i<copies; i++){
      const rot = base + i*axisStep;
      const angAxis = baseAxis + rot;
      const ra = doRotate(a, rot), rb = doRotate(b, rot);
      emit(ra, rb);
      emit(reflectAcrossAxis(ra, angAxis), reflectAcrossAxis(rb, angAxis));
    }
    return;
  }

  if (mode === 'mirror-horizontal'){
    const baseAxis = 0;
    for (let i=0; i<copies; i++){
      const rot = base + i*axisStep;
      const angAxis = baseAxis + rot;
      const ra = doRotate(a, rot), rb = doRotate(b, rot);
      emit(ra, rb);
      emit(reflectAcrossAxis(ra, angAxis), reflectAcrossAxis(rb, angAxis));
    }
    return;
  }

  if (mode === 'diagonals'){
    for (let i=0; i<copies; i++){
      const rot = base + i*axisStep;
      const ra = doRotate(a, rot), rb = doRotate(b, rot);
      emit(ra, rb);
      const ax1 = Math.PI/4 + rot, ax2 = -Math.PI/4 + rot;
      emit(reflectAcrossAxis(ra, ax1), reflectAcrossAxis(rb, ax1));
      emit(reflectAcrossAxis(ra, ax2), reflectAcrossAxis(rb, ax2));
    }
    return;
  }

  if (mode === 'octa' || mode === 'quad'){
    const axesBase = (mode === 'octa') ? [0, Math.PI/2, Math.PI/4, -Math.PI/4] : [0, Math.PI/2];
    for (let i=0; i<copies; i++){
      const rot = base + i*axisStep;
      const ra = doRotate(a, rot), rb = doRotate(b, rot);
      emit(ra, rb);
      for (const ax of axesBase){
        const angAxis = ax + rot;
        emit(reflectAcrossAxis(ra, angAxis), reflectAcrossAxis(rb, angAxis));
      }
    }
    return;
  }

  emit(a,b);
}

export function safeSymmetricSegment(a, b){
  const dt = Math.abs((b.t||0) - (a.t||0)) || 0;
  const dist = Math.hypot((b.x-a.x), (b.y-a.y));
  const MAX_SEG = Math.min(state.width, state.height) * 0.35;
  if (dt > 180 || dist > MAX_SEG) return;
  withClipDraw(()=> drawSymmetricSegment(a, b, dt, dist));
}