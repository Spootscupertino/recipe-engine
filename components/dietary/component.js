export function initDietary(root) {
  if (!root) return;

  const checks = Array.from(root.querySelectorAll('.dietary-check'));
  const chips = root.querySelector('.chips');
  if (!chips) return;

  function render() {
    const selected = checks.filter(c => c.checked).map(c => c.value);
    chips.innerHTML = selected.map(val => `<span class="chip">${val}</span>`).join('');
  }

  checks.forEach(check => check.addEventListener('change', render));
  render();
}
