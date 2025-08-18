import { $ } from './utils.js';
import { state } from './state.js';

export function attachColorControls(){
  const paletteEl = $('#palette');
  const colorModeEl = $('#colorMode');
  const metricRange = $('#metricRange');
  const metricRangeVal = $('#metricRangeVal');
  const metricRangeLabel = $('#metricRangeLabel');
  const heatControls = $('#heatControls');
  const heatGain = $('#heatGain'), heatGainVal = $('#heatGainVal');
  const heatDecay = $('#heatDecay'), heatDecayVal = $('#heatDecayVal');
  const colorSpeed = $('#colorSpeed'), colorSpeedVal = $('#colorSpeedVal');
  const lockColor = $('#lockColor');

  paletteEl.addEventListener('change', e => state.palette = e.target.value);
  colorModeEl.addEventListener('change', e => {
    state.colorMode = e.target.value;
    if (state.colorMode === 'velocity'){ metricRangeLabel.firstChild.textContent = 'Velocity range (px/s) '; metricRange.max = 2000; metricRange.value = 600; }
    else if (state.colorMode === 'accel'){ metricRangeLabel.firstChild.textContent = 'Accel range (m/s²) '; metricRange.max = 40; metricRange.value = 18; }
    else if (state.colorMode === 'spin'){ metricRangeLabel.firstChild.textContent = 'Spin range (deg/s) '; metricRange.max = 1000; metricRange.value = 400; }
    else if (state.colorMode === 'direction'){ metricRangeLabel.firstChild.textContent = 'Metric range '; metricRange.value = 180; }
    else if (state.colorMode === 'heat'){ metricRangeLabel.firstChild.textContent = 'Heat drive range '; metricRange.value = 180; }
    else { metricRangeLabel.firstChild.textContent = 'Metric range '; metricRange.value = 180; }
    state.metricRange = +metricRange.value; metricRangeVal.textContent = state.metricRange;
    heatControls.style.display = (state.colorMode === 'heat') ? 'block' : 'none';
  });
  metricRange.addEventListener('input', e => { state.metricRange = +e.target.value; metricRangeVal.textContent = state.metricRange; });
  heatGain.addEventListener('input', e => { state.heatGain = +e.target.value; heatGainVal.textContent = state.heatGain.toFixed(2); });
  heatDecay.addEventListener('input', e => { state.heatDecay = +e.target.value; heatDecayVal.textContent = state.heatDecay.toFixed(2); });
  colorSpeed.addEventListener('input', e => { state.colorSpeed = +e.target.value; colorSpeedVal.textContent = state.colorSpeed.toFixed(2); });
  lockColor.addEventListener('click', () => { state.stroke.lockColor = !state.stroke.lockColor; lockColor.classList.toggle('active', state.stroke.lockColor); });
}