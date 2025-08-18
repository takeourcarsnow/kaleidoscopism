import { $ } from './utils.js';
import { state } from './state.js';
import { setDprMax, resize, paintBackground } from './canvas.js';

export function attachSystemControls(){
  const quality = $('#quality');
  const resetView = $('#resetView');

  quality.addEventListener('change', e => {
    state.quality = e.target.value;
    if (state.quality === 'performance') {
      setDprMax(1);
      state.glow = 0; $('#glow').value = state.glow; $('#glowVal').textContent = state.glow|0;
    } else if (state.quality === 'high') {
      setDprMax(2.5);
    } else {
      setDprMax(2);
    }
    resize(true);
  });

  resetView.addEventListener('click', () => {
    state.colorOffset = Math.random()*360; state.rotOffset = 0; paintBackground(true);
  });
}