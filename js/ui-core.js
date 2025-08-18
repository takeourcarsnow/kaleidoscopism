import { $, preventDoubleTapZoom } from './utils.js';
import { paintBackground, resize } from './canvas.js';
import { state } from './state.js';
import { makeAgents } from './agents.js';
import { enableSensors, disableSensors, attachShakeToClear } from './sensors.js';
import { updateClipPath } from './clip.js';

export function initUIBasics(){
  const panel = $('#panel');
  const menuBtn = $('#menuBtn');
  const saveBtn = $('#saveBtn');
  const clearBtn = $('#clearBtn');
  const autoBtn = $('#autoBtn');
  const sensorBtn = $('#sensorBtn');
  const hint = $('#hint');

  // Tabs
  const tabs = $('#tabs');
  tabs.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tabbtn'); if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tabbtn').forEach(b=>b.classList.toggle('active', b===btn));
    document.querySelectorAll('.tabcontent').forEach(c=>{
      c.classList.toggle('active', c.id === 'tab-' + tab);
    });
  });

  menuBtn.addEventListener('click', () => panel.classList.toggle('hidden'));
  saveBtn.addEventListener('click', () => {
    const canvas = document.getElementById('c');
    try {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a'); a.href = url; a.download = `psychedelic-${Date.now()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e){ window.open(canvas.toDataURL('image/png'), '_blank'); }
  });
  clearBtn.addEventListener('click', () => paintBackground(true));
  autoBtn.addEventListener('click', () => {
    state.auto = !state.auto;
    autoBtn.textContent = state.auto ? 'Auto (On)' : 'Auto';
    if (state.auto && state.agents.length === 0) makeAgents(6);
  });

  sensorBtn.addEventListener('click', async () => {
    if (!state.sensorsEnabled) {
      await enableSensors();
      state.sensorsEnabled = true;
      sensorBtn.classList.add('active');
      sensorBtn.innerHTML = '📳 Sensors On';
    } else {
      disableSensors();
      state.sensorMode = 'off';
      document.getElementById('sensorMode').value = 'off';
      sensorBtn.classList.remove('active');
      sensorBtn.innerHTML = '📳 Sensors';
    }
  });

  // Hint fade
  let hinted = false;
  function hideHint(){ if (hinted) return; hinted = true; hint.style.opacity = '0'; setTimeout(()=> hint.style.display='none', 400); }
  document.getElementById('c').addEventListener('pointerdown', hideHint, { passive: true });
  sensorBtn.addEventListener('click', hideHint);

  // Shake to clear binding
  attachShakeToClear();

  // Resize handling
  window.addEventListener('resize', () => { resize(true); updateClipPath(); }, { passive: true });

  // Prevent iOS double-tap zoom
  preventDoubleTapZoom();
}