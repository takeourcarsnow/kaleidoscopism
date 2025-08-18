import { $ } from './utils.js';
import { state } from './state.js';
import { updateClipPath } from './clip.js';

export function attachBoundsControls(){
  const boundsRegion = $('#boundsRegion');
  const boundsBehavior = $('#boundsBehavior');
  const circleRadius = $('#circleRadius'), circleRadiusVal = $('#circleRadiusVal');
  const rectW = $('#rectW'), rectWVal = $('#rectWVal');
  const rectH = $('#rectH'), rectHVal = $('#rectHVal');
  const edgePad = $('#edgePad'), edgePadVal = $('#edgePadVal');
  const clipDrawBtn = $('#clipDraw');
  const showBounds = $('#showBounds');

  boundsRegion.addEventListener('change', e => { state.boundsRegion = e.target.value; updateClipPath(); });
  boundsBehavior.addEventListener('change', e => {
    state.boundsBehavior = e.target.value;
    if (state.boundsBehavior === 'hide'){
      state.clipDraw = true;
      clipDrawBtn.classList.add('active');
      clipDrawBtn.setAttribute('disabled','true');
    } else {
      clipDrawBtn.removeAttribute('disabled');
    }
  });
  circleRadius.addEventListener('input', e => { state.circleRadiusPct = +e.target.value; circleRadiusVal.textContent = state.circleRadiusPct|0; updateClipPath(); });
  rectW.addEventListener('input', e => { state.rectWpct = +e.target.value; rectWVal.textContent = state.rectWpct|0; updateClipPath(); });
  rectH.addEventListener('input', e => { state.rectHpct = +e.target.value; rectHVal.textContent = state.rectHpct|0; updateClipPath(); });
  edgePad.addEventListener('input', e => { state.edgePad = +e.target.value; edgePadVal.textContent = state.edgePad|0; updateClipPath(); });
  clipDrawBtn.addEventListener('click', () => {
    if (state.boundsBehavior === 'hide') return;
    state.clipDraw = !state.clipDraw;
    clipDrawBtn.classList.toggle('active', state.clipDraw);
  });
  showBounds.addEventListener('click', () => { state.showBounds = !state.showBounds; showBounds.classList.toggle('active', state.showBounds); });
}