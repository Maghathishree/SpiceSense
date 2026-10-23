/**
 * SpiceSense - dietFilter Filter
 * Demonstrates: Custom Filters
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('dietFilter', [function() {
    return function(recipes, dietTag) {
      if (!recipes || !dietTag || dietTag === 'All') return recipes;
      return recipes.filter(function(recipe) {
        if (!recipe.dietaryTags) return false;
        return recipe.dietaryTags.some(function(tag) {
          return tag.toLowerCase() === dietTag.toLowerCase();
        });
      });
    };
  }]);
})();
