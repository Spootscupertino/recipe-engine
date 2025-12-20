document.addEventListener('DOMContentLoaded', () => {
  const dietaryChecks = Array.from(document.querySelectorAll('.dietary-check'));
  const dietaryChips = document.getElementById('dietaryChips');

  const proteinInput = document.getElementById('proteinInput');
  const carbsInput = document.getElementById('carbsInput');
  const fatInput = document.getElementById('fatInput');
  const macroSummary = document.getElementById('macroSummary');

  const heatSlider = document.getElementById('heatSlider');
  const heatLabel = document.getElementById('heatLabel');

  const portionInput = document.getElementById('portionInput');
  const portionApply = document.getElementById('portionApply');
  const ingredientsList = document.getElementById('ingredientsList');
  const servingsLabel = document.getElementById('servingsLabel');

  const BASE_SERVINGS = 4;

  function renderDietaryChips() {
    const selected = dietaryChecks.filter(c => c.checked).map(c => c.value);
    dietaryChips.innerHTML = selected.map(val => `<span class="chip">${val}</span>`).join('');
  }

  dietaryChecks.forEach(check => check.addEventListener('change', renderDietaryChips));
  renderDietaryChips();

  function updateMacros() {
    const p = Number(proteinInput?.value || 0);
    const c = Number(carbsInput?.value || 0);
    const f = Number(fatInput?.value || 0);
    const kcal = Math.round(p * 4 + c * 4 + f * 9);
    if (macroSummary) macroSummary.textContent = `~${kcal} kcal / serving`;
  }

  [proteinInput, carbsInput, fatInput].forEach(input => {
    if (input) input.addEventListener('input', updateMacros);
  });
  updateMacros();

  function heatDescriptor(val) {
    if (val <= 2) return 'No heat';
    if (val <= 4) return 'Mild';
    if (val <= 7) return 'Medium';
    if (val <= 9) return 'Hot';
    return 'Inferno';
  }

  function updateHeat() {
    if (!heatSlider || !heatLabel) return;
    const val = Number(heatSlider.value || 0);
    const label = `${heatDescriptor(val)} (${val}/10)`;
    heatLabel.textContent = label;
  }

  if (heatSlider) heatSlider.addEventListener('input', updateHeat);
  updateHeat();

  function formatQty(num) {
    const rounded = Math.round(num * 100) / 100;
    if (Math.abs(rounded - Math.round(rounded)) < 0.001) return String(Math.round(rounded));
    return rounded.toFixed(2).replace(/\.0+$/, '').replace(/\.([1-9]*)0+$/, '.$1');
  }

  function scaleIngredients() {
    if (!ingredientsList || !portionInput) return;
    const targetServings = Math.max(1, Number(portionInput.value) || BASE_SERVINGS);
    const multiplier = targetServings / BASE_SERVINGS;

    ingredientsList.querySelectorAll('li').forEach(li => {
      const baseQty = Number(li.getAttribute('data-base-qty'));
      const qtyEl = li.querySelector('.qty');
      if (isFinite(baseQty) && qtyEl) {
        qtyEl.textContent = formatQty(baseQty * multiplier);
      }
    });

    if (servingsLabel) {
      servingsLabel.textContent = `Yield: ${formatQty(targetServings)} portions`;
    }
  }

  if (portionApply) portionApply.addEventListener('click', scaleIngredients);
  scaleIngredients();
});
