import { initDietary } from './dietary/component.js';
import { initMacros } from './macros/component.js';
import { initNutrition } from './nutrition/component.js';
import { initHeatScale } from './heat-scale/component.js';
import { initPortions } from './portions/component.js';
import { initPrice } from './price/component.js';
import { initDifficulty } from './difficulty/component.js';
import { initTime } from './time/component.js';

// Bootstraps the componentized controls once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  const portionRoot = document.getElementById('portionsControl');
  const portionInput = document.getElementById('portionInput');
  const portionApply = document.getElementById('portionApply');

  initDietary(document.getElementById('dietaryControl'));
  initMacros(document.getElementById('macrosControl'));
  initNutrition(document.getElementById('nutritionControl'), { portionInput });
  initHeatScale(document.getElementById('heatControl'));
  initPortions({
    root: portionRoot,
    ingredientsList: document.getElementById('ingredientsList'),
    servingsLabel: document.getElementById('servingsLabel'),
    baseServings: 4
  });
  initPrice(document.getElementById('priceControl'), { portionInput, portionApply });
  initDifficulty(document.getElementById('difficultyControl'));
  initTime(document.getElementById('timeControl'));
});
