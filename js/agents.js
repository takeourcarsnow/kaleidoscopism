import { state } from './state.js';
import { flowVec } from './flow.js';
import { applyBounds } from './bounds.js';
import { safeSymmetricSegment } from './symmetry.js';
import { withClipDraw } from './clip.js';

export function makeAgents(n=6){
  state.agents = [];
  for (let i=0;i<n;i++){
    state.agents.push({ x: state.cx + (Math.random()-0.5)*state.width*0.4, y: state.cy + (Math.random()-0.5)*state.height*0.4, vx: 0, vy: 0 });
  }
}

export function stepAgents(dt){
  const t = performance.now();
  const sp = 0.9;
  for (const a of state.agents){
    const f = flowVec(a.x, a.y, t*0.001);
    a.vx = (a.vx + f.x * 0.7)*0.96;
    a.vy = (a.vy + f.y * 0.7)*0.96;
    const old = { x: a.x, y: a.y, t: t - dt };
    a.x += a.vx * sp * dt*0.06;
    a.y += a.vy * sp * dt*0.06;
    applyBounds(a);
    withClipDraw(()=> safeSymmetricSegment(old, {x:a.x, y:a.y, t:t}));
  }
}