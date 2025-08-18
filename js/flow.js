import { state } from './state.js';
import { noise3 } from './noise.js';
import { clamp } from './utils.js';

export function flowVec(x, y, tSec) {
  if (state.turbMode === 'off') return { x: 0, y: 0 };
  const s = state.turbScale;
  const z = tSec * state.turbSpeed;
  const biasX = state.tiltX * state.sensorInf * 0.6;
  const biasY = -state.tiltY * state.sensorInf * 0.6;

  let fx = 0, fy = 0;
  if (state.turbMode === 'noise') {
    fx = (noise3(x*s + 5.2, y*s + 1.7, z) - 0.5)*2;
    fy = (noise3(x*s - 7.1, y*s - 3.4, z) - 0.5)*2;
  } else {
    const eps = 1.0;
    const nx1 = noise3((x+eps)*s, y*s, z), nx2 = noise3((x-eps)*s, y*s, z);
    const ny1 = noise3(x*s, (y+eps)*s, z), ny2 = noise3(x*s, (y-eps)*s, z);
    const dnx = nx1 - nx2, dny = ny1 - ny2;
    fx = dny; fy = -dnx;
  }
  const mag = Math.hypot(fx, fy) || 1;
  fx = fx/mag + biasX;
  fy = fy/mag + biasY;
  const bump = clamp(state.accelMag*0.015, 0, 2) * state.sensorInf;
  return { x: fx*(1 + bump), y: fy*(1 + bump) };
}