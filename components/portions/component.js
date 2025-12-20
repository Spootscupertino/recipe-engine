import { formatQty } from '../shared/utils.js';

export function initPortions({ root, ingredientsList, servingsLabel, baseServings = 4 } = {}) {
  if (!root || !ingredientsList) return;
  const input = root.querySelector('#portionInput');
  const applyBtn = root.querySelector('#portionApply');
  if (!input || !applyBtn) return;

  // Persist the base servings on the control so it can be updated when recipes change.
  root.dataset.baseServings = String(baseServings);

  function scale() {
    const currentBase = Math.max(1, Number(root.dataset.baseServings) || baseServings);
    const target = Math.max(1, Number(input.value) || currentBase);
    const multiplier = target / currentBase;

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

  function setBase(newBase) {
    const nextBase = Math.max(1, Number(newBase) || baseServings);
    root.dataset.baseServings = String(nextBase);
    if (input) input.value = nextBase;
    scale();
  }

  applyBtn.addEventListener('click', scale);
  scale();

  return { setBase, scale };
}
