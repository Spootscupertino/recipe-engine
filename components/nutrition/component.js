export function initNutrition(root, { portionInput } = {}) {
  if (!root) return;

  const caloriesInput = root.querySelector('#caloriesInput');
  const sodiumInput = root.querySelector('#sodiumInput');
  const satFatInput = root.querySelector('#satFatInput');
  const summary = root.querySelector('#nutritionSummary');

  function servings() {
    return Math.max(1, Number(portionInput?.value) || 1);
  }

  function update() {
    const cals = Number(caloriesInput?.value) || 0;
    const sodium = Number(sodiumInput?.value) || 0;
    const satFat = Number(satFatInput?.value) || 0;
    const s = servings();
    const calTotal = cals * s;
    if (summary) {
      summary.textContent = `${cals} kcal / serving · ${calTotal} kcal total · ${sodium} mg sodium · ${satFat} g sat fat`;
    }
  }

  [caloriesInput, sodiumInput, satFatInput].forEach(input => {
    if (input) input.addEventListener('input', update);
  });

  if (portionInput) {
    portionInput.addEventListener('input', update);
  }

  update();
}
