export function initDifficulty(root) {
  if (!root) return;
  const select = root.querySelector('#difficultySelect');
  const badge = root.querySelector('#difficultyBadge');
  if (!select || !badge) return;

  function update() {
    const level = select.value || 'Easy';
    badge.textContent = level;
    badge.dataset.level = level.toLowerCase();
  }

  select.addEventListener('change', update);
  update();
}
