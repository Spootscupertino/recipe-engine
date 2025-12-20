import { initDietary } from './dietary/component.js';
import { initMacros } from './macros/component.js';
import { initNutrition } from './nutrition/component.js';
import { initHeatScale } from './heat-scale/component.js';
import { initPortions } from './portions/component.js';
import { initPrice } from './price/component.js';
import { initDifficulty } from './difficulty/component.js';
import { initTime } from './time/component.js';
import { formatQty } from './shared/utils.js';
import { suggestSubs } from './shared/substitutions.js';

let recipeIndex = [];
let portionsControl;

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderIngredients(listEl, ingredients = []) {
  if (!listEl) return;
  listEl.innerHTML = ingredients
    .map(item => {
      const qty = item.quantity;
      const numericQty = Number(qty);
      const displayQty = Number.isFinite(numericQty) ? formatQty(numericQty) : qty;
      const unit = item.unit || '';
      const name = item.name || '';
      const baseAttr = Number.isFinite(numericQty) ? numericQty : '';
      return `<li data-base-qty="${baseAttr}" data-unit="${unit}" data-name="${name}">
        <div class="ing-row">
          <span class="qty">${displayQty}</span> <span class="unit">${unit}</span> <span class="name">${name}</span>
          <button class="sub-btn" type="button" data-name="${name}">Substitute</button>
        </div>
        <div class="sub-panel" hidden>
          <div class="sub-title">Try:</div>
          <ul class="sub-list"></ul>
        </div>
      </li>`;
    })
    .join('');
}

function renderDirections(listEl, directions = []) {
  if (!listEl) return;
  listEl.innerHTML = directions.map(step => `<li>${step}</li>`).join('');
}

async function loadRecipeList() {
  if (recipeIndex.length) return recipeIndex;
  try {
    recipeIndex = await fetchJSON('recipes/list.json');
    return recipeIndex;
  } catch (err) {
    console.warn('Failed to load recipe list:', err);
    return [];
  }
}

async function fetchRecipeBySlug(slug) {
  if (!slug) return null;
  try {
    return await fetchJSON(`recipes/${slug}/recipe.json`);
  } catch (err) {
    console.warn(`Failed to load recipe ${slug}:`, err);
    return null;
  }
}

function populateRecipe(recipe) {
  if (!recipe) return;
  const titleEl = document.querySelector('.brand h1');
  if (titleEl) titleEl.textContent = recipe.title || 'Recipe';

  const portionInput = document.getElementById('portionInput');
  const ingredientsList = document.getElementById('ingredientsList');
  const directionsList = document.querySelector('.section-content ol');
  const notesEl = document.querySelector('.section-content p');

  const recipeYield = Number(recipe.yield) || 4;
  if (portionInput) portionInput.value = recipeYield;

  renderIngredients(ingredientsList, recipe.ingredients);
  renderDirections(directionsList, recipe.directions);
  if (notesEl && recipe.notes) notesEl.textContent = recipe.notes;

  // Nutrition/macros
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  setVal('caloriesInput', recipe.nutrition?.calories);
  setVal('sodiumInput', recipe.nutrition?.sodium);
  setVal('satFatInput', recipe.nutrition?.saturatedFat);
  setVal('fiberInput', recipe.nutrition?.fiber);
  setVal('sugarInput', recipe.nutrition?.sugar);

  setVal('proteinInput', recipe.macros?.protein);
  setVal('carbsInput', recipe.macros?.carbs);
  setVal('fatInput', recipe.macros?.fat);

  setVal('pricePerServing', recipe.price?.perServing);
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect && recipe.price?.currency) currencySelect.value = recipe.price.currency;

  const diffSelect = document.getElementById('difficultySelect');
  if (diffSelect && recipe.difficulty) diffSelect.value = recipe.difficulty;

  setVal('prepTime', recipe.time?.prepMinutes);
  setVal('cookTime', recipe.time?.cookMinutes);
}

// Bootstraps the componentized controls once the DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const portionRoot = document.getElementById('portionsControl');
  const portionInput = document.getElementById('portionInput');
  const portionApply = document.getElementById('portionApply');
  const servingsLabel = document.getElementById('servingsLabel');

  const list = await loadRecipeList();
  const initialSlug = getSlugFromQuery() || (list[0] && list[0].slug);
  const recipe = initialSlug ? await fetchRecipeBySlug(initialSlug) : null;
  populateRecipe(recipe);
  const recipeYield = Number(recipe?.yield) || 4;

  initDietary(document.getElementById('dietaryControl'));
  initMacros(document.getElementById('macrosControl'));
  initNutrition(document.getElementById('nutritionControl'), { portionInput });
  initHeatScale(document.getElementById('heatControl'));
  portionsControl = initPortions({
    root: portionRoot,
    ingredientsList: document.getElementById('ingredientsList'),
    servingsLabel,
    baseServings: recipeYield
  });
  attachSubstitutionControls(document.getElementById('ingredientsList'));
  initPrice(document.getElementById('priceControl'), { portionInput, portionApply });
  initDifficulty(document.getElementById('difficultyControl'));
  initTime(document.getElementById('timeControl'));
  refreshControlSummaries();

  initSearch(list, async slug => {
    const nextRecipe = await fetchRecipeBySlug(slug);
    if (!nextRecipe) return;
    populateRecipe(nextRecipe);
    const nextYield = Number(nextRecipe.yield) || 4;
    if (portionInput) portionInput.value = nextYield;
    if (portionsControl?.setBase) portionsControl.setBase(nextYield);
    attachSubstitutionControls(document.getElementById('ingredientsList'));
    refreshControlSummaries();
    updateQueryString(slug);
  }, initialSlug);
});

function attachSubstitutionControls(listEl) {
  if (!listEl) return;
  const buttons = Array.from(listEl.querySelectorAll('.sub-btn'));
  buttons.forEach(btn => {
    const name = btn.dataset.name || '';
    const panel = btn.closest('li')?.querySelector('.sub-panel');
    const list = panel?.querySelector('.sub-list');
    if (!panel || !list) return;
    const suggestions = suggestSubs(name);
    if (suggestions.length === 0) {
      list.innerHTML = '<li>No suggested substitutions yet.</li>';
    } else {
      list.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    }
    btn.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    });
  });
}

function refreshControlSummaries() {
  const ids = [
    'proteinInput',
    'carbsInput',
    'fatInput',
    'caloriesInput',
    'sodiumInput',
    'satFatInput',
    'prepTime',
    'cookTime',
    'pricePerServing'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const difficulty = document.getElementById('difficultySelect');
  if (difficulty) difficulty.dispatchEvent(new Event('change', { bubbles: true }));
}

function updateQueryString(slug) {
  const url = new URL(window.location.href);
  url.searchParams.set('slug', slug);
  window.history.replaceState({}, '', url);
}

function initSearch(list = [], onSelect, activeSlug) {
  const input = document.getElementById('recipeSearch');
  const results = document.getElementById('searchResults');
  const card = input?.closest('.search-card');
  if (!input || !results || !card) return;

  if (activeSlug) {
    const active = list.find(item => item.slug === activeSlug);
    if (active) input.value = active.title || active.slug;
  }

  const render = term => {
    const needle = term.trim().toLowerCase();
    const matches = list
      .filter(item => {
        const title = (item.title || '').toLowerCase();
        const slug = item.slug || '';
        return title.includes(needle) || slug.includes(needle);
      })
      .slice(0, 8);
    results.innerHTML = matches
      .map(item => `<li data-slug="${item.slug}">${item.title || item.slug}</li>`)
      .join('');
    results.hidden = matches.length === 0;
  };

  input.addEventListener('input', e => render(e.target.value));
  input.addEventListener('focus', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      results.hidden = true;
      results.innerHTML = '';
    }
  });

  results.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const slug = li.dataset.slug;
    const match = list.find(item => item.slug === slug);
    if (match) {
      input.value = match.title || match.slug;
      results.hidden = true;
      results.innerHTML = '';
      onSelect?.(slug);
    }
  });

  document.addEventListener('click', e => {
    if (!card.contains(e.target)) {
      results.hidden = true;
    }
  });
}
