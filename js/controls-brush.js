import { $ } from './utils.js';
import { state } from './state.js';

export function attachBrushControls(){
  const brushType = $('#brushType');
  const strokeBlock = $('#strokeBlock');
  const dotsBlock = $('#dotsBlock');
  const widthMode = $('#widthMode');
  const widthMin = $('#widthMin'), widthMinVal = $('#widthMinVal');
  const widthMax = $('#widthMax'), widthMaxVal = $('#widthMaxVal');
  const widthRange = $('#widthRange'), widthRangeVal = $('#widthRangeVal');
  const widthRangeLabel = $('#widthRangeLabel');
  const strokeAlpha = $('#strokeAlpha'), strokeAlphaVal = $('#strokeAlphaVal');
  const strokeDetail = $('#strokeDetail'), strokeDetailVal = $('#strokeDetailVal');
  const lineCap = $('#lineCap');
  const lineJoin = $('#lineJoin');
  const size = $('#size'), sizeVal = $('#sizeVal');
  const glow = $('#glow'), glowVal = $('#glowVal');

  brushType.addEventListener('change', e => {
    state.brush = e.target.value;
    strokeBlock.style.display = (state.brush === 'stroke') ? 'block' : 'none';
    dotsBlock.style.display = (state.brush !== 'stroke') ? 'block' : 'none';
  });
  widthMode.addEventListener('change', e => {
    state.stroke.widthMode = e.target.value;
    const show = (state.stroke.widthMode === 'speed');
    widthRangeLabel.style.display = show ? 'block' : 'none';
    widthRange.style.display = show ? 'block' : 'none';
  });
  widthMin.addEventListener('input', e => { state.stroke.widthMin = +e.target.value; widthMinVal.textContent = state.stroke.widthMin|0; });
  widthMax.addEventListener('input', e => { state.stroke.widthMax = +e.target.value; widthMaxVal.textContent = state.stroke.widthMax|0; });
  widthRange.addEventListener('input', e => { state.stroke.widthRange = +e.target.value; widthRangeVal.textContent = state.stroke.widthRange|0; });
  strokeAlpha.addEventListener('input', e => { state.stroke.alpha = +e.target.value; strokeAlphaVal.textContent = state.stroke.alpha.toFixed(2); });
  strokeDetail.addEventListener('input', e => { state.stroke.detail = +e.target.value; strokeDetailVal.textContent = state.stroke.detail.toFixed(2); });
  lineCap.addEventListener('change', e => state.stroke.cap = e.target.value);
  lineJoin.addEventListener('change', e => state.stroke.join = e.target.value);
  size.addEventListener('input', e => { state.brushSize = +e.target.value; sizeVal.textContent = state.brushSize|0; });
  glow.addEventListener('input', e => { state.glow = +e.target.value; glowVal.textContent = state.glow|0; });
}