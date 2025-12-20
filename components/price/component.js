export function initPrice(root, { portionInput, portionApply } = {}) {
  if (!root) return;
  const perServingInput = root.querySelector('#pricePerServing');
  const currencySelect = root.querySelector('#currencySelect');
  const summary = root.querySelector('#priceSummary');

  function servings() {
    return Math.max(1, Number(portionInput?.value) || 1);
  }

  function formatCurrency(value, currency) {
    const cur = currency || 'USD';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(value);
    } catch (e) {
      return `${cur} ${value.toFixed(2)}`;
    }
  }

  function update() {
    const per = Number(perServingInput?.value) || 0;
    const cur = currencySelect?.value || 'USD';
    const s = servings();
    const total = per * s;
    if (summary) {
      summary.textContent = `${formatCurrency(per, cur)} per serving · ${formatCurrency(total, cur)} total (${s} servings)`;
    }
  }

  [perServingInput, currencySelect].forEach(input => {
    if (input) input.addEventListener('input', update);
  });

  if (portionInput) {
    portionInput.addEventListener('input', update);
  }
  if (portionApply) {
    portionApply.addEventListener('click', update);
  }

  update();
}
