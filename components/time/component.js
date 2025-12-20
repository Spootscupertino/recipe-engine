export function initTime(root) {
  if (!root) return;
  const prepInput = root.querySelector('#prepTime');
  const cookInput = root.querySelector('#cookTime');
  const summary = root.querySelector('#timeSummary');
  if (!prepInput || !cookInput || !summary) return;

  function update() {
    const prep = Math.max(0, Number(prepInput.value) || 0);
    const cook = Math.max(0, Number(cookInput.value) || 0);
    const total = prep + cook;
    summary.textContent = `${total} min total (prep ${prep}, cook ${cook})`;
  }

  prepInput.addEventListener('input', update);
  cookInput.addEventListener('input', update);
  update();
}
