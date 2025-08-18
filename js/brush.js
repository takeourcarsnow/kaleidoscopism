import { state } from './state.js';
import { ctx } from './canvas.js';
import { clamp, lerp } from './utils.js';
import { noise3 } from './noise.js';
import { flowVec } from './flow.js';
import { getStrokeColor } from './color.js';

export function drawByBrush(a, b, dt=16, dist=null){
  if (state.brush === 'stroke') drawStrokeSegment(a, b, dt, dist);
  else drawDottySegment(a, b, dt, dist, state.brush);
}

export function drawStrokeSegment(a, b, dt=16, preDist=null){
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = preDist ?? Math.hypot(dx, dy);
  if (dist < 0.2) return;

  const tNow = performance.now();
  const dtms = Math.max(1, dt);
  const segSpeed = dist / dtms;
  const segDir = Math.atan2(dy, dx);

  let w = state.stroke.widthMax;
  if (state.stroke.widthMode === 'speed'){
    const speed_ps = segSpeed * 1000;
    const t = clamp(1 - speed_ps / state.stroke.widthRange, 0, 1);
    w = state.stroke.widthMin + (state.stroke.widthMax - state.stroke.widthMin) * t;
  }
  w = clamp(w, 1, 200);

  ctx.save();
  ctx.globalCompositeOperation = state.composite;
  ctx.lineCap = state.stroke.cap;
  ctx.lineJoin = state.stroke.join;
  ctx.miterLimit = 8;
  ctx.lineWidth = w;
  ctx.globalAlpha = state.stroke.alpha;
  ctx.shadowBlur = state.glow || 0;

  const baseStep = 6 / state.stroke.detail;
  const steps = Math.max(1, Math.ceil(dist / Math.max(1, baseStep)));
  const nx = -dy / dist, ny = dx / dist;

  const sT = state.turbScale, zT = (tNow*0.001) * (0.6 + state.turbSpeed);

  const doDistort = (x, y) => {
    if (state.turbMode !== 'off' && state.turbInt > 0){
      const wob = (noise3(x*sT + 12.3, y*sT - 9.7, zT) - 0.5) * 2;
      const ampPerp = state.turbInt * (4 + w*0.25);
      if (state.turbDist === 'perp' || state.turbDist === 'both'){
        x += nx * wob * ampPerp;
        y += ny * wob * ampPerp;
      }
      if (state.turbDist === 'flow' || state.turbDist === 'both'){
        const fv = flowVec(x, y, tNow*0.001);
        const ampFlow = state.turbInt * (6 + w*0.2);
        x += fv.x * ampFlow;
        y += fv.y * ampFlow;
      }
    }
    if (state.scatter > 0){
      const nval = (noise3(x*0.015, y*0.015, tNow*0.001) - 0.5) * 2;
      const tiltW = (state.tiltX + state.tiltY)*0.5;
      const wiggle = (state.scatter*6 + w*0.04) * (nval + tiltW*state.sensorInf*0.4);
      x += nx * wiggle; y += ny * wiggle;
    }
    return {x,y};
  };

  if (state.stroke.lockColor){
    const lockedColor = getStrokeColor(a.x, a.y, segSpeed, segDir, tNow, 0, dist);
    ctx.strokeStyle = lockedColor;
    if (state.glow > 0) ctx.shadowColor = lockedColor;
    ctx.beginPath();
    let p0 = doDistort(a.x, a.y);
    ctx.moveTo(p0.x, p0.y);
    for (let i=1; i<=steps; i++){
      const f = i/steps;
      const p = doDistort(lerp(a.x, b.x, f), lerp(a.y, b.y, f));
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  } else {
    let pPrev = doDistort(a.x, a.y);
    for (let i=1; i<=steps; i++){
      const f = i/steps;
      const p = doDistort(lerp(a.x, b.x, f), lerp(a.y, b.y, f));
      const col = getStrokeColor(p.x, p.y, segSpeed, segDir, tNow, i, dist);
      ctx.strokeStyle = col;
      if (state.glow > 0) ctx.shadowColor = col;
      ctx.beginPath();
      ctx.moveTo(pPrev.x, pPrev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      pPrev = p;
    }
  }
  ctx.restore();
}

export function drawDottySegment(a, b, dt=16, preDist=null, mode='dots'){
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = preDist ?? Math.hypot(dx, dy);
  if (dist < 0.5) return;

  const tNow = performance.now();
  const nx = -dy / dist, ny = dx / dist;
  const stepBase = Math.max(1, state.brushSize * 0.32);
  const steps = Math.max(1, Math.floor(dist / Math.max(1, stepBase)));

  ctx.save();
  ctx.globalCompositeOperation = state.composite;
  ctx.shadowBlur = state.glow || 0;
  ctx.globalAlpha = 0.95;

  const sT = state.turbScale, zT = (tNow*0.001) * (0.6 + state.turbSpeed);

  const doDistort = (x, y, sizeRef=state.brushSize) => {
    if (state.turbMode !== 'off' && state.turbInt > 0){
      const wob = (noise3(x*sT + 3.1, y*sT - 7.2, zT) - 0.5) * 2;
      const ampPerp = state.turbInt * (4 + sizeRef*0.18);
      if (state.turbDist === 'perp' || state.turbDist === 'both'){
        x += nx * wob * ampPerp;
        y += ny * wob * ampPerp;
      }
      if (state.turbDist === 'flow' || state.turbDist === 'both'){
        const fv = flowVec(x, y, tNow*0.001);
        const ampFlow = state.turbInt * (6 + sizeRef*0.15);
        x += fv.x * ampFlow;
        y += fv.y * ampFlow;
      }
    }
    if (state.scatter > 0){
      const nval = (noise3(x*0.015, y*0.015, tNow*0.001) - 0.5) * 2;
      const tiltW = (state.tiltX + state.tiltY)*0.5;
      const wiggle = (state.scatter*10 + sizeRef*0.08) * (nval + tiltW*state.sensorInf*0.6);
      x += nx * wiggle; y += ny * wiggle;
    }
    return {x,y};
  };

  for (let i=0; i<=steps; i++){
    const f = i/steps;
    let x = lerp(a.x, b.x, f);
    let y = lerp(a.y, b.y, f);
    const pressure = state.pointers.size ? [...state.pointers.values()][0]?.pressure || 0.7 : 0.7;
    const accelBoost = (state.accelMag * 0.03) * state.sensorInf;
    const size = Math.max(1, state.brushSize * (0.6 + 0.4*Math.random()) * (0.85 + accelBoost) * (0.6 + 0.7*pressure));

    const p = doDistort(x, y, size);

    const segSpeed = dist / Math.max(1, dt);
    const segDir = Math.atan2(dy, dx);
    const col = getStrokeColor(p.x, p.y, segSpeed, segDir, tNow, i, dist);

    ctx.fillStyle = col;
    if (state.glow > 0) ctx.shadowColor = col;

    if (mode === 'dots'){
      ctx.beginPath(); ctx.arc(p.x, p.y, size*0.5, 0, Math.PI*2); ctx.fill();
    } else {
      const sprayCount = 3;
      for (let s=0; s<sprayCount; s++){
        const ang = Math.random()*Math.PI*2;
        const rad = size * (0.2 + Math.random()*0.6) * state.scatter * 1.4;
        const sp = doDistort(p.x + Math.cos(ang)*rad, p.y + Math.sin(ang)*rad, size*0.6);
        ctx.globalAlpha = 0.35 + Math.random()*0.25;
        ctx.beginPath(); ctx.arc(sp.x, sp.y, size*(0.12 + Math.random()*0.24), 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95;
      }
    }
  }
  ctx.restore();
}