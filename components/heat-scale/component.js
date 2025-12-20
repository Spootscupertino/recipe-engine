import { heatDescriptor } from '../shared/utils.js';

export function initHeatScale(root) {
  if (!root) return;
  const slider = root.querySelector('#heatSlider');
  const label = root.querySelector('#heatLabel');
  if (!slider || !label) return;

  function update() {
    const val = Number(slider.value || 0);
    label.textContent = `${heatDescriptor(val)} (${val}/10)`;
  }

  slider.addEventListener('input', update);
  update();
}
