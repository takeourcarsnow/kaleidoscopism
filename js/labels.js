import { $ } from './utils.js';
import { state } from './state.js';

export function syncLabels(){
  // Brush
  $('#widthMinVal').textContent = state.stroke.widthMin|0;
  $('#widthMaxVal').textContent = state.stroke.widthMax|0;
  $('#widthRangeVal').textContent = state.stroke.widthRange|0;
  $('#strokeAlphaVal').textContent = state.stroke.alpha.toFixed(2);
  $('#strokeDetailVal').textContent = state.stroke.detail.toFixed(2);
  $('#sizeVal').textContent = state.brushSize|0;
  $('#glowVal').textContent = state.glow|0;

  // Symmetry
  $('#symVal').textContent = state.symmetry;
  $('#symAngVal').textContent = state.symAngleDeg;

  // Color
  $('#metricRangeVal').textContent = state.metricRange;
  $('#heatGainVal').textContent = state.heatGain.toFixed(2);
  $('#heatDecayVal').textContent = state.heatDecay.toFixed(2);
  $('#colorSpeedVal').textContent = state.colorSpeed.toFixed(2);

  // Visuals
  $('#fadeVal').textContent = state.fade.toFixed(3);
  $('#scatterVal').textContent = state.scatter.toFixed(2);

  // Turb
  $('#turbIntVal').textContent = state.turbInt.toFixed(2);
  $('#turbScaleVal').textContent = state.turbScale.toFixed(3);
  $('#turbSpeedVal').textContent = state.turbSpeed.toFixed(2);

  // Sensors
  $('#sensorInfVal').textContent = state.sensorInf.toFixed(2);
  $('#motionSensVal').textContent = state.motionSens.toFixed(2);
  $('#ampVal').textContent = state.amp.toFixed(2);
  $('#speedCapVal').textContent = state.speedCap|0;
  $('#frictionVal').textContent = state.friction.toFixed(2);
  $('#deadzoneVal').textContent = state.deadzone.toFixed(2);
  $('#springKVal').textContent = state.springK.toFixed(1);
  $('#springDVal').textContent = state.springD.toFixed(2);
  $('#spinGainVal').textContent = state.spinGain.toFixed(2);
  $('#minDrawVal').textContent = state.minDrawSpeed.toFixed(2);
  $('#filterVal').textContent = state.filterStrength.toFixed(2);

  // Bounds
  $('#edgePadVal').textContent = state.edgePad|0;
  $('#circleRadiusVal').textContent = state.circleRadiusPct|0;
  $('#rectWVal').textContent = state.rectWpct|0;
  $('#rectHVal').textContent = state.rectHpct|0;

  // Toggle visuals
  const showSpeed = (state.stroke.widthMode === 'speed');
  $('#widthRangeLabel').style.display = showSpeed ? 'block' : 'none';
  $('#widthRange').style.display = showSpeed ? 'block' : 'none';
  $('#strokeBlock').style.display = (state.brush === 'stroke') ? 'block' : 'none';
  $('#dotsBlock').style.display = (state.brush !== 'stroke') ? 'block' : 'none';
  $('#lockColor').classList.toggle('active', state.stroke.lockColor);
  $('#showBounds').classList.toggle('active', state.showBounds);
  $('#clipDraw').classList.toggle('active', state.clipDraw);
  $('#showBrushBtn').classList.toggle('active', state.showBrush);

  // Behavior-dependent clip button state
  if (state.boundsBehavior === 'hide'){
    $('#clipDraw').setAttribute('disabled','true');
  } else {
    $('#clipDraw').removeAttribute('disabled');
  }

  // Composite button text/state
  const composite = $('#composite');
  composite.textContent = (state.composite === 'lighter') ? 'Additive' : 'Normal';
  composite.classList.toggle('active', state.composite === 'lighter');
}