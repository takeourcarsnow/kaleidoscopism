import { state } from './state.js';
import { clamp, lerp } from './utils.js';
import { flowVec } from './flow.js';
import { applyBounds } from './bounds.js';
import { safeSymmetricSegment } from './symmetry.js';
import { withClipDraw } from './clip.js';
import { ctx, getDPR, paintBackground } from './canvas.js';

let orientationListenerAdded = false;
let motionListenerAdded = false;

export async function enableSensors(){
  try {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'){
      await DeviceMotionEvent.requestPermission().catch(()=>null);
    }
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'){
      await DeviceOrientationEvent.requestPermission().catch(()=>null);
    }
  } catch(e){}
  addSensorListeners();
  state.sensorsEnabled = true;
}

export function disableSensors(){
  state.sensorsEnabled = false;
}

function addSensorListeners(){
  if (!orientationListenerAdded && 'DeviceOrientationEvent' in window){
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    orientationListenerAdded = true;
  }
  if (!motionListenerAdded && 'DeviceMotionEvent' in window){
    window.addEventListener('devicemotion', onMotion, { passive: true });
    motionListenerAdded = true;
  }
}

export function getScreenAngleRad(){
  const o = (screen.orientation && typeof screen.orientation.angle === 'number') ? screen.orientation.angle : (window.orientation || 0);
  return (o % 360) * Math.PI/180;
}

export function updateSensorPainter(dt){
  if (!state.sensorsEnabled || state.sensorMode === 'off' || !state.sensorDraws) { state.sensorSpeed = 0; return; }

  const now = performance.now();
  const p = state.sensor;
  if (!p.inited){
    p.x = state.cx; p.y = state.cy; p.lastX = p.x; p.lastY = p.y; p.vx = 0; p.vy = 0; p.inited = true;
  }

  const dtSec = Math.max(0.001, dt * 0.001);
  const rotZ = state.rot.alpha || 0;
  const ang = -getScreenAngleRad();
  const gScale = Math.min(state.width, state.height) / 400;

  if (state.sensorMode === 'tilt'){
    const reach = 0.46;
    const tx = state.cx + (state.tiltX * state.width * reach);
    const ty = state.cy + (state.tiltY * state.height * reach);
    const smoothing = 1 - Math.pow(1 - (0.22 + state.sensorInf*0.5), dtSec*60);
    p.x = lerp(p.x, tx, smoothing);
    p.y = lerp(p.y, ty, smoothing);
    const f = flowVec(p.x, p.y, now*0.001);
    p.x += f.x * state.turbInt * 8 * dtSec;
    p.y += f.y * state.turbInt * 8 * dtSec;
    applyBounds(p);

  } else if (state.sensorMode === 'tilt-spring'){
    const reach = 0.6;
    const tx = state.cx + (state.tiltX * state.width * reach);
    const ty = state.cy + (state.tiltY * state.height * reach);
    const k = state.springK * gScale * (0.8 + state.sensorInf);
    const dmp = state.springD;
    p.vx += (tx - p.x) * k * dtSec;
    p.vy += (ty - p.y) * k * dtSec;
    p.vx *= dmp; p.vy *= dmp;
    const f = flowVec(p.x, p.y, now*0.001);
    p.vx += f.x * state.turbInt * 10 * dtSec;
    p.vy += f.y * state.turbInt * 10 * dtSec;

    capSpeed(p, dtSec);
    p.x += p.vx; p.y += p.vy;
    applyBounds(p);

  } else if (state.sensorMode === 'motion' || state.sensorMode === 'motion-swirl' || state.sensorMode === 'motion-raw'){
    let ax = state.ax, ay = state.ay;
    if (state.sensorMode === 'motion-raw'){ ax = state.rawAx; ay = state.rawAy; }
    const rx = ax * Math.cos(ang) - ay * Math.sin(ang);
    const ry = ax * Math.sin(ang) + ay * Math.cos(ang);
    const mag = Math.hypot(rx, ry);
    const dz = state.deadzone;
    const gain = state.motionSens * state.amp * gScale * 60;
    const driveX = (mag > dz ? (rx / (mag || 1)) * (mag - dz) : 0) * gain * dtSec;
    const driveY = (mag > dz ? (ry / (mag || 1)) * (mag - dz) : 0) * gain * dtSec;
    p.vx += driveX; p.vy += driveY;

    const f = flowVec(p.x, p.y, now*0.001);
    let swirl = 0;
    if (state.sensorMode !== 'motion-raw' && state.sensorMode !== 'motion'){
      swirl = clamp((rotZ/180) * state.spinGain, -4, 4);
    }
    p.vx += f.x * state.turbInt * (14 + Math.abs(swirl)*10) * dtSec;
    p.vy += f.y * state.turbInt * (14 + Math.abs(swirl)*10) * dtSec;
    if (swirl !== 0){
      const s = Math.sin(swirl * dtSec), c = Math.cos(swirl * dtSec);
      const vx = p.vx*c - p.vy*s, vy = p.vx*s + p.vy*c;
      p.vx = vx; p.vy = vy;
    }

    p.vx *= state.friction; p.vy *= state.friction;
    capSpeed(p, dtSec);
    p.x += p.vx; p.y += p.vy;
    applyBounds(p);

  } else if (state.sensorMode === 'gyro-orbit'){
    const angleSpeed = (rotZ/180) * (0.6 + state.sensorInf*1.2) * state.spinGain;
    const rMax = Math.min(state.width, state.height)*0.42;
    const rTarget = clamp((state.accelMag - 3)/7, 0, 1) * rMax;
    p._orbitR = lerp(p._orbitR || (rMax*0.25), rTarget, 1 - Math.pow(1-0.25, dtSec*60));
    p._orbitA = (p._orbitA || 0) + angleSpeed * dtSec * Math.PI*2;
    const tx = state.cx + Math.cos(p._orbitA)*p._orbitR;
    const ty = state.cy + Math.sin(p._orbitA)*p._orbitR;
    const smoothing = 1 - Math.pow(1 - 0.3, dtSec*60);
    p.x = lerp(p.x, tx, smoothing);
    p.y = lerp(p.y, ty, smoothing);
    applyBounds(p);

  } else if (state.sensorMode === 'shake-burst'){
    const rx = state.ax * Math.cos(ang) - state.ay * Math.sin(ang);
    const ry = state.ax * Math.sin(ang) + state.ay * Math.cos(ang);
    const gain = state.motionSens * state.amp * gScale * 70;
    p.vx += rx * gain * dtSec; p.vy += ry * gain * dtSec;

    const f = flowVec(p.x, p.y, now*0.001);
    p.vx += f.x * state.turbInt * 12 * dtSec;
    p.vy += f.y * state.turbInt * 12 * dtSec;

    if (state.accelMag > 18){
      const t = now;
      if (t - state._lastBurst > 180){
        state._lastBurst = t;
        const angKick = Math.random()*Math.PI*2;
        const kick = 200 * state.amp * dtSec;
        p.vx += Math.cos(angKick)*kick;
        p.vy += Math.sin(angKick)*kick;
      }
    }

    p.vx *= state.friction; p.vy *= state.friction;
    capSpeed(p, dtSec);
    p.x += p.vx; p.y += p.vy;
    applyBounds(p);
  }

  const speedPx = Math.hypot(p.x - p.lastX, p.y - p.lastY);
  const speed = speedPx / Math.max(1, dt);
  state.sensorSpeed = speed;

  if (speed > state.minDrawSpeed){
    const old = { x: p.lastX, y: p.lastY, t: now - dt };
    const cur = { x: p.x, y: p.y, t: now };
    const d = Math.hypot(cur.x-old.x, cur.y-old.y);
    const MAX_SEG = Math.min(state.width, state.height) * 0.35;
    if (d <= MAX_SEG) withClipDraw(()=> safeSymmetricSegment(old, cur));
    p.lastX = p.x; p.lastY = p.y;
  } else {
    p.lastX = p.x; p.lastY = p.y;
  }
}

function capSpeed(p, dtSec){
  const v = Math.hypot(p.vx||0, p.vy||0);
  if (v <= 1e-6) return;
  const vps = v / dtSec;
  if (vps > state.speedCap){
    const s = (state.speedCap * dtSec) / v;
    p.vx *= s; p.vy *= s;
  }
}

export function drawBrushOverlay(){
  if (!state.showBrush || state.sensorMode === 'off') return;
  const p = state.sensor;
  const DPR = getDPR();
  ctx.save();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
  ctx.fill();
  const vx = p.vx || 0, vy = p.vy || 0;
  const sp = Math.hypot(vx, vy);
  if (sp > 0.01){
    const len = Math.min(24, sp*0.15);
    const ang = Math.atan2(vy, vx);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(ang)*len, p.y + Math.sin(ang)*len);
    ctx.stroke();
  }
  ctx.restore();
}

export function calibrateSensors(){
  state.yawBias = state.yaw;
  state._tiltBiasX = state.tiltX;
  state._tiltBiasY = state.tiltY;
}

export function attachShakeToClear(){
  let lastShakeTime = 0;
  window.addEventListener('devicemotion', (e) => {
    if (!state.shakeClears) return;
    const ai = e.accelerationIncludingGravity || {x:0,y:0,z:0};
    const mag = Math.sqrt((ai.x||0)**2 + (ai.y||0)**2 + (ai.z||0)**2);
    if (mag > 22){
      const t = performance.now();
      if (t - lastShakeTime > 800){ lastShakeTime = t; paintBackground(true); navigator.vibrate?.(50); }
    }
  }, { passive: true });
}

function onOrientation(e){
  if (!state.sensorsEnabled) return;
  const beta = e.beta ?? 0, gamma = e.gamma ?? 0, alpha = e.alpha ?? 0;
  state.tiltX = clamp(gamma/45, -1, 1);
  state.tiltY = clamp(beta/45, -1, 1);
  state.yaw = alpha/180 - 1;
}

const lp = { ax:0, ay:0, az:0, gx:0, gy:0, gz:0, rawx:0, rawy:0 };
function onMotion(e){
  if (!state.sensorsEnabled) return;
  const inc = e.accelerationIncludingGravity || {x:0,y:0,z:0};
  const lin = e.acceleration || null;
  const r = e.rotationRate || { alpha:0, beta:0, gamma:0 };

  const a = clamp(state.filterStrength, 0, 0.95);

  lp.gx = a*lp.gx + (1-a)*(inc.x || 0);
  lp.gy = a*lp.gy + (1-a)*(inc.y || 0);
  lp.gz = a*lp.gz + (1-a)*(inc.z || 0);

  const lax = (lin && isFinite(lin.x)) ? lin.x : (inc.x - lp.gx);
  const lay = (lin && isFinite(lin.y)) ? lin.y : (inc.y - lp.gy);
  const laz = (lin && isFinite(lin.z)) ? lin.z : (inc.z - lp.gz);

  lp.ax = a*lp.ax + (1-a)*lax;
  lp.ay = a*lp.ay + (1-a)*lay;
  lp.az = a*lp.az + (1-a)*laz;

  const aRaw = 0.2;
  lp.rawx = aRaw*lp.rawx + (1-aRaw)*(inc.x || 0);
  lp.rawy = aRaw*lp.rawy + (1-aRaw)*(inc.y || 0);

  state.ax = state.useLinear ? lp.ax : lp.gx;
  state.ay = state.useLinear ? lp.ay : lp.gy;
  state.az = state.useLinear ? lp.az : lp.gz;
  state.rawAx = lp.rawx;
  state.rawAy = lp.rawy;

  const ai = e.accelerationIncludingGravity || {x:0,y:0,z:0};
  state.accelMag = Math.sqrt((ai.x||0)**2 + (ai.y||0)**2 + (ai.z||0)**2);
  state.rot = { alpha: r.alpha||0, beta: r.beta||0, gamma: r.gamma||0 };
  state.rotMag = Math.sqrt((state.rot.alpha)**2 + (state.rot.beta)**2 + (state.rot.gamma)**2);
}