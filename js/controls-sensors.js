import { $ } from './utils.js';
import { state } from './state.js';
import { enableSensors } from './sensors.js';

export function attachSensorControls(){
  const sensorMode = $('#sensorMode');
  const sensorInf = $('#sensorInf'), sensorInfVal = $('#sensorInfVal');
  const motionSens = $('#motionSens'), motionSensVal = $('#motionSensVal');
  const amp = $('#amp'), ampVal = $('#ampVal');
  const speedCap = $('#speedCap'), speedCapVal = $('#speedCapVal');
  const friction = $('#friction'), frictionVal = $('#frictionVal');
  const deadzone = $('#deadzone'), deadzoneVal = $('#deadzoneVal');
  const springK = $('#springK'), springKVal = $('#springKVal');
  const springD = $('#springD'), springDVal = $('#springDVal');
  const spinGain = $('#spinGain'), spinGainVal = $('#spinGainVal');
  const minDraw = $('#minDraw'), minDrawVal = $('#minDrawVal');
  const filter = $('#filter'), filterVal = $('#filterVal');
  const useLinear = $('#useLinear');
  const shakeClear = $('#shakeClear');
  const sensorDraw = $('#sensorDraw');
  const showBrushBtn = $('#showBrushBtn');
  const calibrate = $('#calibrate');
  const center = $('#center');

  sensorMode.addEventListener('change', async e => {
    state.sensorMode = e.target.value;
    state.sensor.inited = false;
    if (state.sensorMode !== 'off' && !state.sensorsEnabled) await enableSensors();
  });
  sensorInf.addEventListener('input', e => { state.sensorInf = +e.target.value; sensorInfVal.textContent = state.sensorInf.toFixed(2); });
  motionSens.addEventListener('input', e => { state.motionSens = +e.target.value; motionSensVal.textContent = state.motionSens.toFixed(2); });
  amp.addEventListener('input', e => { state.amp = +e.target.value; ampVal.textContent = state.amp.toFixed(2); });
  speedCap.addEventListener('input', e => { state.speedCap = +e.target.value; speedCapVal.textContent = state.speedCap|0; });
  friction.addEventListener('input', e => { state.friction = +e.target.value; frictionVal.textContent = state.friction.toFixed(2); });
  deadzone.addEventListener('input', e => { state.deadzone = +e.target.value; deadzoneVal.textContent = state.deadzone.toFixed(2); });
  springK.addEventListener('input', e => { state.springK = +e.target.value; springKVal.textContent = state.springK.toFixed(1); });
  springD.addEventListener('input', e => { state.springD = +e.target.value; springDVal.textContent = state.springD.toFixed(2); });
  spinGain.addEventListener('input', e => { state.spinGain = +e.target.value; spinGainVal.textContent = state.spinGain.toFixed(2); });
  minDraw.addEventListener('input', e => { state.minDrawSpeed = +e.target.value; minDrawVal.textContent = state.minDrawSpeed.toFixed(2); });
  filter.addEventListener('input', e => { state.filterStrength = +e.target.value; filterVal.textContent = state.filterStrength.toFixed(2); });

  useLinear.addEventListener('click', () => { state.useLinear = !state.useLinear; useLinear.classList.toggle('active', state.useLinear); });
  shakeClear.addEventListener('click', () => { state.shakeClears = !state.shakeClears; shakeClear.classList.toggle('active', state.shakeClears); });
  sensorDraw.addEventListener('click', () => { state.sensorDraws = !state.sensorDraws; sensorDraw.classList.toggle('active', state.sensorDraws); });
  showBrushBtn.addEventListener('click', () => { state.showBrush = !state.showBrush; showBrushBtn.classList.toggle('active', state.showBrush); });
  calibrate.addEventListener('click', () => { state.yawBias = state.yaw; state._tiltBiasX = state.tiltX; state._tiltBiasY = state.tiltY; });
  center.addEventListener('click', () => { state.sensor.inited = false; });
}