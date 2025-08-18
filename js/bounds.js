import { state } from './state.js';

function wrapRange(v, min, max){
  const w = max - min;
  if (w <= 0) return min;
  return min + ((v - min) % w + w) % w;
}
export { wrapRange };

export function applyBounds(p){
  if (state.boundsBehavior === 'hide') return;

  const pad = state.edgePad;
  const w = state.width, h = state.height;
  const cx = state.cx, cy = state.cy;
  const behavior = state.boundsBehavior;
  const region = state.boundsRegion;

  function reflectRect(){
    const rw = (state.rectWpct/100) * w * 0.5;
    const rh = (state.rectHpct/100) * h * 0.5;
    const xMin = cx - rw + pad, xMax = cx + rw - pad;
    const yMin = cy - rh + pad, yMax = cy + rh - pad;

    if (behavior === 'wrap'){
      p.x = wrapRange(p.x, xMin, xMax);
      p.y = wrapRange(p.y, yMin, yMax);
      return;
    }

    p.vx = p.vx || 0; p.vy = p.vy || 0;
    let safety = 0;
    while ((p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax) && safety++ < 6){
      if (p.x < xMin){ p.x = xMin + (xMin - p.x); p.vx = -p.vx; }
      if (p.x > xMax){ p.x = xMax - (p.x - xMax); p.vx = -p.vx; }
      if (p.y < yMin){ p.y = yMin + (yMin - p.y); p.vy = -p.vy; }
      if (p.y > yMax){ p.y = yMax - (p.y - yMax); p.vy = -p.vy; }
    }
    p.vx *= 0.9; p.vy *= 0.9;
  }

  if (region === 'screen'){
    if (behavior === 'wrap'){
      const xMin = 0 + pad, xMax = w - pad;
      const yMin = 0 + pad, yMax = h - pad;
      p.x = wrapRange(p.x, xMin, xMax);
      p.y = wrapRange(p.y, yMin, yMax);
    } else if (behavior === 'bounce'){
      const xMin = 0 + pad, xMax = w - pad;
      const yMin = 0 + pad, yMax = h - pad;
      p.vx = p.vx || 0; p.vy = p.vy || 0;
      let safety = 0;
      while ((p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax) && safety++ < 6){
        if (p.x < xMin){ p.x = xMin + (xMin - p.x); p.vx = -p.vx; }
        if (p.x > xMax){ p.x = xMax - (p.x - xMax); p.vx = -p.vx; }
        if (p.y < yMin){ p.y = yMin + (yMin - p.y); p.vy = -p.vy; }
        if (p.y > yMax){ p.y = yMax - (p.y - yMax); p.vy = -p.vy; }
      }
      p.vx *= 0.9; p.vy *= 0.9;
    }
    return;
  }

  if (region === 'circle'){
    const R = (Math.min(w, h) * 0.5) * (state.circleRadiusPct/100);
    const rLimit = Math.max(10, R - pad);
    let dx = p.x - cx, dy = p.y - cy;
    let r = Math.hypot(dx, dy);

    if (behavior === 'wrap'){
      if (r > rLimit){
        const nx = dx / r, ny = dy / r;
        const per = (r - rLimit) % (2*rLimit);
        const opposite = (per <= rLimit);
        const newR = opposite ? (rLimit - per) : (per - rLimit);
        const sign = opposite ? -1 : 1;
        p.x = cx + sign * nx * newR;
        p.y = cy + sign * ny * newR;
      }
      return;
    }

    if (behavior === 'bounce'){
      if (r > rLimit){
        p.vx = p.vx || 0; p.vy = p.vy || 0;
        let safety = 0;
        while (r > rLimit && safety++ < 6){
          const nx = dx / r, ny = dy / r;
          const overshoot = r - rLimit;
          p.x = cx + nx * (rLimit - overshoot);
          p.y = cy + ny * (rLimit - overshoot);
          const vdotn = p.vx*nx + p.vy*ny;
          p.vx = p.vx - 2*vdotn*nx;
          p.vy = p.vy - 2*vdotn*ny;
          dx = p.x - cx; dy = p.y - cy; r = Math.hypot(dx, dy);
        }
        p.vx *= 0.9; p.vy *= 0.9;
      }
      return;
    }
    return;
  }

  if (region === 'rect'){
    if (behavior === 'wrap' || behavior === 'bounce'){
      reflectRect();
    }
  }
}