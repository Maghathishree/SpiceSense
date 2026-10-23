/**
 * SpiceSense - mealFilter Filter
 * Demonstrates: Custom AngularJS Filters
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('mealFilter', [function() {
    return function(recipes, mealType) {
      if (!recipes || !mealType || mealType === 'All') return recipes;
      return recipes.filter(function(recipe) {
        return recipe.mealType.toLowerCase() === mealType.toLowerCase() ||
               recipe.category.toLowerCase() === mealType.toLowerCase();
      });
    };
  }]);
})();
