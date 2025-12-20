import { formatQty } from '../shared/utils.js';

export function initPortions({ root, ingredientsList, servingsLabel, baseServings = 4 } = {}) {
  if (!root || !ingredientsList) return;
  const input = root.querySelector('#portionInput');
  const applyBtn = root.querySelector('#portionApply');
  if (!input || !applyBtn) return;

  function scale() {
    const target = Math.max(1, Number(input.value) || baseServings);
    const multiplier = target / baseServings;

    ingredientsList.querySelectorAll('li').forEach(li => {
      const baseQty = Number(li.getAttribute('data-base-qty'));
      const qtyEl = li.querySelector('.qty');
      if (Number.isFinite(baseQty) && qtyEl) {
        qtyEl.textContent = formatQty(baseQty * multiplier);
      }
    });

    if (servingsLabel) {
      servingsLabel.textContent = `Yield: ${formatQty(target)} portions`;
    }
  }

  applyBtn.addEventListener('click', scale);
  scale();
}
