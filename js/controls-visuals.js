import { $ } from './utils.js';
import { state } from './state.js';
import { paintBackground } from './canvas.js';

export function attachVisualsControls(){
  const fade = $('#fade'), fadeVal = $('#fadeVal');
  const scatter = $('#scatter'), scatterVal = $('#scatterVal');
  const bgMode = $('#bgMode');
  const composite = $('#composite');
  const randomize = $('#randomize');

  fade.addEventListener('input', e => { state.fade = +e.target.value; fadeVal.textContent = state.fade.toFixed(3); });
  scatter.addEventListener('input', e => { state.scatter = +e.target.value; scatterVal.textContent = state.scatter.toFixed(2); });

  bgMode.addEventListener('change', e => { state.bgMode = e.target.value; paintBackground(true); });
  composite.addEventListener('click', () => {
    state.composite = (state.composite === 'lighter') ? 'source-over' : 'lighter';
    composite.textContent = (state.composite === 'lighter') ? 'Additive' : 'Normal';
    composite.classList.toggle('active', state.composite === 'lighter');
  });

  randomize.addEventListener('click', () => {
    state.colorOffset = Math.random()*360;
    state.stroke.widthMin = Math.floor(1 + Math.random()*6);
    state.stroke.widthMax = Math.floor(8 + Math.random()*40);
    $('#widthMin').value = state.stroke.widthMin; $('#widthMinVal').textContent = state.stroke.widthMin|0;
    $('#widthMax').value = state.stroke.widthMax; $('#widthMaxVal').textContent = state.stroke.widthMax|0;
    state.stroke.detail = +(0.8 + Math.random()*1.8).toFixed(2);
    $('#strokeDetail').value = state.stroke.detail; $('#strokeDetailVal').textContent = state.stroke.detail.toFixed(2);
    state.glow = Math.floor(Math.random()*12); $('#glow').value = state.glow; $('#glowVal').textContent = state.glow;
    state.scatter = +(Math.random().toFixed(2)); scatter.value = state.scatter; scatterVal.textContent = state.scatter.toFixed(2);
    state.symmetry = Math.floor(1 + Math.random()*24); $('#sym').value = state.symmetry; $('#symVal').textContent = state.symmetry;
    state.symAngleDeg = Math.floor(-90 + Math.random()*180); $('#symAngle').value = state.symAngleDeg; $('#symAngVal').textContent = state.symAngleDeg;
    const modes = ['off','radial','radial-kaleido','mirror-vertical','mirror-horizontal','quad','diagonals','octa'];
    state.symMode = modes[Math.floor(Math.random()*modes.length)];
    $('#symMode').value = state.symMode;
    $('#symSlicesBlock').style.display = 'block';
    state.palette = ['Rainbow','Neon','Sunset','Ocean','Acid'][Math.floor(Math.random()*5)]; $('#palette').value = state.palette;
    state.turbMode = Math.random() > 0.5 ? 'curl' : 'noise'; $('#turbMode').value = state.turbMode;
    state.turbDist = ['perp','flow','both'][Math.floor(Math.random()*3)]; $('#turbDist').value = state.turbDist;
    state.turbInt = +(Math.random()*1.1).toFixed(2); $('#turbInt').value = state.turbInt; $('#turbIntVal').textContent = state.turbInt.toFixed(2);
    state.turbScale = +(0.002 + Math.random()*0.02).toFixed(3); $('#turbScale').value = state.turbScale; $('#turbScaleVal').textContent = state.turbScale.toFixed(3);
    state.turbSpeed = +(Math.random()*1.2).toFixed(2); $('#turbSpeed').value = state.turbSpeed; $('#turbSpeedVal').textContent = state.turbSpeed.toFixed(2);
  });
}