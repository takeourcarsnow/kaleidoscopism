import { $ } from './utils.js';
import { state } from './state.js';

export function attachTurbControls(){
  const turbMode = $('#turbMode');
  const turbDist = $('#turbDist');
  const turbInt = $('#turbInt'), turbIntVal = $('#turbIntVal');
  const turbScale = $('#turbScale'), turbScaleVal = $('#turbScaleVal');
  const turbSpeed = $('#turbSpeed'), turbSpeedVal = $('#turbSpeedVal');

  turbMode.addEventListener('change', e => state.turbMode = e.target.value);
  turbDist.addEventListener('change', e => state.turbDist = e.target.value);
  turbInt.addEventListener('input', e => { state.turbInt = +e.target.value; turbIntVal.textContent = state.turbInt.toFixed(2); });
  turbScale.addEventListener('input', e => { state.turbScale = +e.target.value; turbScaleVal.textContent = state.turbScale.toFixed(3); });
  turbSpeed.addEventListener('input', e => { state.turbSpeed = +e.target.value; turbSpeedVal.textContent = state.turbSpeed.toFixed(2); });
}