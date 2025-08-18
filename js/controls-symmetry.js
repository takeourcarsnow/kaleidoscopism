import { $ } from './utils.js';
import { state } from './state.js';

export function attachSymmetryControls(){
  const symModeEl = $('#symMode');
  const symBlock = $('#symSlicesBlock');
  const sym = $('#sym'), symVal = $('#symVal');
  const symAngle = $('#symAngle'), symAngVal = $('#symAngVal');

  symModeEl.addEventListener('change', e => {
    state.symMode = e.target.value;
    symBlock.style.display = 'block';
  });
  sym.addEventListener('input', e => { state.symmetry = parseInt(e.target.value,10); symVal.textContent = state.symmetry; });
  symAngle.addEventListener('input', e => { state.symAngleDeg = parseInt(e.target.value, 10); symAngVal.textContent = state.symAngleDeg; });
}