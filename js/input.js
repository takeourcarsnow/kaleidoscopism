import { canvas } from './canvas.js';
import { state } from './state.js';
import { safeSymmetricSegment } from './symmetry.js';

function onDown(e){
  e.preventDefault();
  canvas.setPointerCapture?.(e.pointerId);
  state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now(), pressure: e.pressure ?? 0.6 });
}
function onMove(e){
  const prev = state.pointers.get(e.pointerId);
  if (!prev) return;
  const now = { x: e.clientX, y: e.clientY, t: performance.now(), pressure: e.pressure ?? 0.6 };
  safeSymmetricSegment(prev, now);
  state.pointers.set(e.pointerId, now);
}
function onUp(e){ state.pointers.delete(e.pointerId); }

export function attachPointerInput(){
  canvas.addEventListener('pointerdown', onDown, { passive: false });
  canvas.addEventListener('pointermove', onMove, { passive: false });
  canvas.addEventListener('pointerup', onUp, { passive: false });
  canvas.addEventListener('pointercancel', onUp, { passive: false });
  canvas.addEventListener('pointerleave', onUp, { passive: false });
}