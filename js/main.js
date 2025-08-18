import { resize, paintBackground } from './canvas.js';
import { updateClipPath } from './clip.js';
import { makeAgents } from './agents.js';
import { startLoop } from './loop.js';
import { attachPointerInput } from './input.js';
import { initUIBasics } from './ui-core.js';

import { attachBrushControls } from './controls-brush.js';
import { attachSymmetryControls } from './controls-symmetry.js';
import { attachColorControls } from './controls-color.js';
import { attachTurbControls } from './controls-turb.js';
import { attachSensorControls } from './controls-sensors.js';
import { attachBoundsControls } from './controls-bounds.js';
import { attachVisualsControls } from './controls-visuals.js';
import { attachSystemControls } from './controls-system.js';
import { syncLabels } from './labels.js';

// Build UI wiring
initUIBasics();
attachBrushControls();
attachSymmetryControls();
attachColorControls();
attachTurbControls();
attachSensorControls();
attachBoundsControls();
attachVisualsControls();
attachSystemControls();

// Init canvas, labels, and loop
resize();
updateClipPath();
syncLabels();
paintBackground(true);
makeAgents(6);
attachPointerInput();
startLoop();