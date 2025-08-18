export const state = {
  width: 0, height: 0, cx: 0, cy: 0,

  // brush/stroke
  brush: 'stroke',
  brushSize: 30,
  glow: 0,
  stroke: {
    widthMode: 'constant',
    widthMin: 2,
    widthMax: 18,
    widthRange: 1200,
    alpha: 0.95,
    detail: 1.4,
    cap: 'round',
    join: 'round',
    lockColor: false,
  },

  // symmetry
  symMode: 'radial-kaleido',
  symmetry: 10,
  symAngleDeg: 0,
  rotOffset: 0,

  // color
  palette: 'Rainbow',
  colorMode: 'palette',
  metricRange: 180,
  colorSpeed: 0.48,
  colorOffset: Math.random()*360,
  heat: 0, heatGain: 0.6, heatDecay: 0.14, sensorSpeed: 0,

  // visuals
  scatter: 0.2,
  fade: 0.035,
  composite: 'lighter',
  bgMode: 'dark',

  // turbulence
  turbMode: 'curl',
  turbDist: 'perp',
  turbInt: 0.65,
  turbScale: 0.009,
  turbSpeed: 0.6,

  // sensors
  sensorsEnabled: false,
  sensorMode: 'off',
  sensorInf: 0.7,
  motionSens: 2.2,
  amp: 1.6,
  speedCap: 1600,
  friction: 0.92,
  deadzone: 0.06,
  minDrawSpeed: 0.08,
  filterStrength: 0.4,
  springK: 10,
  springD: 0.88,
  spinGain: 1.2,
  useLinear: true,
  shakeClears: false,
  sensorDraws: true,
  showBrush: true,

  // bounds
  boundsRegion: 'screen',
  boundsBehavior: 'bounce',
  circleRadiusPct: 68,
  rectWpct: 72,
  rectHpct: 60,
  edgePad: 0,
  showBounds: false,
  clipDraw: true,

  // device signals
  tiltX: 0, tiltY: 0, yaw: 0, yawBias: 0,
  accelMag: 0,
  ax: 0, ay: 0, az: 0,
  rawAx: 0, rawAy: 0,
  rot: { alpha: 0, beta: 0, gamma: 0 },
  rotMag: 0,

  // sensor painter
  sensor: { x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, inited: false, _orbitR: 0, _orbitA: 0 },
  _lastBurst: 0,

  // input pointers
  pointers: new Map(),

  // auto
  auto: false,
  agents: [],

  // perf
  quality: 'balanced',
};