import { state } from './state.js';
import { ctx } from './canvas.js';
import { clamp, map01 } from './utils.js';
import { updateSensorPainter, drawBrushOverlay } from './sensors.js';
import { stepAgents } from './agents.js';
import { drawBoundsOverlay } from './clip.js';

let lastFrame = performance.now();

export function startLoop(){
  lastFrame = performance.now();
  requestAnimationFrame(tick);
}

function tick(){
  const now = performance.now();
  let dt = now - lastFrame;
  if (dt > 120) dt = 16;
  lastFrame = now;

  if (state.fade > 0){
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    const alpha = clamp(state.fade, 0, 1);
    if (state.bgMode === 'light') ctx.fillStyle = `rgba(250,252,255,${alpha})`;
    else if (state.bgMode === 'deep') ctx.fillStyle = `rgba(0,0,0,${alpha*0.95})`;
    else ctx.fillStyle = `rgba(5,5,8,${alpha})`;
    ctx.fillRect(0,0,state.width,state.height);
    ctx.restore();
  }

  state.rotOffset = (state.yaw - state.yawBias) * 0.15 * state.sensorInf;

  updateSensorPainter(dt);

  const accelVal = map01(state.accelMag, 0, Math.max(1, state.metricRange));
  const speedVal = map01(state.sensorSpeed*1000, 0, state.metricRange);
  const energy = (accelVal + speedVal) * 0.5 * state.heatGain;
  state.heat = clamp(state.heat + energy*dt*0.001 - state.heatDecay*dt*0.001, 0, 1);

  if (state.auto) stepAgents(dt);

  drawBoundsOverlay();
  drawBrushOverlay();

  requestAnimationFrame(tick);
}