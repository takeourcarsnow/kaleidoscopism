import { state } from './state.js';
import { clamp, lerp, map01, hsla } from './utils.js';

function hueFromVal(val){ return 220 - 220*val; }
export function colorFromVal(val, scheme='hue'){
  val = clamp(val, 0, 1);
  if (scheme === 'fire'){
    const h = lerp(280, 50, val);
    const l = lerp(40, 65, Math.pow(val, 0.7));
    return hsla(h, 100, l);
  }
  if (scheme === 'ice'){
    const h = lerp(180, 200, val);
    const l = lerp(45, 80, val*0.8);
    return hsla(h, 90, l);
  }
  return hsla(hueFromVal(val), 100, 58);
}

function getPaletteColor(name, t, x, y){
  const base = state.colorOffset + t;
  switch(name){
    case 'Neon':   return hsla(base + (x - state.cx)*0.05, 100, 60 + 10*Math.sin((y + t)*0.01));
    case 'Sunset': return hsla(10 + 30*Math.sin((t + x*0.3)*0.003) + 20*Math.sin((t + y*0.2)*0.002), 95, 55 + 10*Math.sin(t*0.0012));
    case 'Ocean':  return hsla(190 + 40*Math.sin((x+y+t)*0.002), 90, 50 + 10*Math.sin((t + x)*0.001));
    case 'Acid':   return hsla(base*1.1 + 180*Math.sin((x*0.02)+(t*0.003)), 100, 60);
    default:       return hsla(base + 0.06*(x - state.cx) + 0.04*(y - state.cy), 100, 58);
  }
}

export function getStrokeColor(x, y, segSpeed, segDir, tNow, stepIndex, dist) {
  const baseT = state.colorOffset + dist*state.colorSpeed*0.3 + stepIndex*state.colorSpeed*1.1;
  if (state.colorMode === 'palette'){
    return getPaletteColor(state.palette, baseT + (state.yaw - state.yawBias)*15*state.sensorInf, x, y);
  }
  if (state.colorMode === 'velocity'){
    const val = map01(segSpeed*1000, 0, state.metricRange);
    return colorFromVal(val, 'hue');
  }
  if (state.colorMode === 'accel'){
    const val = map01(state.accelMag, 0, state.metricRange);
    return colorFromVal(val, 'ice');
  }
  if (state.colorMode === 'spin'){
    const val = map01(state.rotMag, 0, state.metricRange);
    return colorFromVal(val, 'hue');
  }
  if (state.colorMode === 'direction'){
    const dirDeg = (segDir*180/Math.PI + 360) % 360;
    return hsla(dirDeg, 100, 58);
  }
  if (state.colorMode === 'heat'){
    const val = clamp(state.heat, 0, 1);
    return colorFromVal(val, 'fire');
  }
  return getPaletteColor(state.palette, baseT, x, y);
}