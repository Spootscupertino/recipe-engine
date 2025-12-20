export function formatQty(num) {
  const rounded = Math.round(num * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded
    .toFixed(2)
    .replace(/\.0+$/, '')
    .replace(/\.([1-9]*)0+$/, '.$1');
}

export function kcalFromMacros(protein = 0, carbs = 0, fat = 0) {
  const p = Number(protein) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fat) || 0;
  return Math.round(p * 4 + c * 4 + f * 9);
}

export function heatDescriptor(val) {
  const n = Number(val) || 0;
  if (n <= 2) return 'No heat';
  if (n <= 4) return 'Mild';
  if (n <= 7) return 'Medium';
  if (n <= 9) return 'Hot';
  return 'Inferno';
}
