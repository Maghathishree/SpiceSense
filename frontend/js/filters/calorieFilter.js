/**
 * SpiceSense - calorieFilter Filter
 * Demonstrates: Calorie threshold filtering
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('calorieFilter', [function() {
    return function(recipes, maxCalories) {
      if (!recipes || !maxCalories || Number(maxCalories) <= 0) return recipes;
      var limit = Number(maxCalories);
      return recipes.filter(function(recipe) {
        return recipe.nutritionPerServing && recipe.nutritionPerServing.calories <= limit;
      });
    };
  }]);
})();
