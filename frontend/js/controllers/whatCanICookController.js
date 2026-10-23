/**
 * SpiceSense - whatCanICookController
 * Demonstrates: "What Can I Cook?" Ingredient-First Matching Logic & Compatibility Score (%)
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('whatCanICookController', ['recipeService', function(recipeService) {
    var vm = this;

    vm.selectedIngredients = ['Rice', 'Tomato', 'Onion', 'Curry Leaves', 'Toor Dal'];
    vm.matchedResults = [];
    vm.isSearching = false;
    vm.sortBy = 'matchPercentage';

    vm.runIngredientSearch = function() {
      if (!vm.selectedIngredients || vm.selectedIngredients.length === 0) {
        vm.matchedResults = [];
        return;
      }

      vm.isSearching = true;
      recipeService.searchByIngredients(vm.selectedIngredients)
        .then(function(data) {
          vm.isSearching = false;
          if (data.success) {
            vm.matchedResults = data.results;
            vm.sortResults();
          }
        })
        .catch(function(err) {
          vm.isSearching = false;
          console.error('Ingredient search error:', err);
        });
    };

    vm.sortResults = function() {
      if (!vm.matchedResults || !vm.matchedResults.length) return;

      if (vm.sortBy === 'matchPercentage') {
        vm.matchedResults.sort(function(a, b) { return b.matchPercentage - a.matchPercentage; });
      } else if (vm.sortBy === 'fastest') {
        vm.matchedResults.sort(function(a, b) { return a.recipe.cookTimeMinutes - b.recipe.cookTimeMinutes; });
      } else if (vm.sortBy === 'lowestCalories') {
        vm.matchedResults.sort(function(a, b) { return a.recipe.nutritionPerServing.calories - b.recipe.nutritionPerServing.calories; });
      } else if (vm.sortBy === 'highestProtein') {
        vm.matchedResults.sort(function(a, b) { return b.recipe.nutritionPerServing.protein - a.recipe.nutritionPerServing.protein; });
      }
    };

    vm.runIngredientSearch();
  }]);
})();
