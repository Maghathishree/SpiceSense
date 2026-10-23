/**
 * SpiceSense - regionFilter Filter
 * Demonstrates: Custom Regional Filtering
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('regionFilter', [function() {
    return function(recipes, regionName) {
      if (!recipes || !regionName || regionName === 'All') return recipes;
      return recipes.filter(function(recipe) {
        return recipe.region && recipe.region.toLowerCase().includes(regionName.toLowerCase());
      });
    };
  }]);
})();
