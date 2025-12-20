import { kcalFromMacros } from '../shared/utils.js';

export function initMacros(root) {
  if (!root) return;
  const proteinInput = root.querySelector('#proteinInput');
  const carbsInput = root.querySelector('#carbsInput');
  const fatInput = root.querySelector('#fatInput');
  const macroSummary = root.querySelector('#macroSummary');

  if (!macroSummary) return;

  function update() {
    const kcal = kcalFromMacros(proteinInput?.value, carbsInput?.value, fatInput?.value);
    macroSummary.textContent = `~${kcal} kcal / serving`;
  }

  [proteinInput, carbsInput, fatInput].forEach(input => {
    if (input) input.addEventListener('input', update);
  });

  update();
}
