/**
 * SpiceSense - spiceFilter Filter
 * Demonstrates: Custom AngularJS Filters for array filtering
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('spiceFilter', [function() {
    return function(recipes, level) {
      if (!recipes || !level || level === 'All') return recipes;
      var targetLvl = Number(level);
      return recipes.filter(function(recipe) {
        return recipe.spiceLevel === targetLvl;
      });
    };
  }]);
})();
