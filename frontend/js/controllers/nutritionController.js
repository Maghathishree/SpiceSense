/**
 * SpiceSense - nutritionController
 * Demonstrates: Dynamic Nutrition Calculator & Reusable NutritionService
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('nutritionController', ['recipeService', 'nutritionService', function(recipeService, nutritionService) {
    var vm = this;

    vm.recipes = [];
    vm.selectedRecipe = null;
    vm.servings = 4;
    vm.calculatedNutrition = {
      totalCalories: 320,
      protein: 11,
      carbs: 52,
      fat: 6,
      fiber: 5
    };

    vm.customAdditions = [];
    vm.newAddName = '';
    vm.newAddQty = 1;

    vm.init = function() {
      recipeService.getAllRecipes()
        .then(function(data) {
          if (data.success && data.recipes.length) {
            vm.recipes = data.recipes;
            vm.selectedRecipe = data.recipes[0];
            vm.recalculate();
          }
        });
    };

    vm.recalculate = function() {
      if (!vm.selectedRecipe) return;

      var baseNut = vm.selectedRecipe.nutritionPerServing;
      var scaled = nutritionService.scaleNutrition(baseNut, vm.selectedRecipe.servings || 4, vm.servings || 4);
      vm.calculatedNutrition = scaled.total;
    };

    vm.addCustomIngredient = function() {
      if (!vm.newAddName) return;
      vm.customAdditions.push({
        name: vm.newAddName,
        quantityMultiplier: Number(vm.newAddQty) || 1,
        caloriesPerUnit: 50,
        proteinPerUnit: 2,
        carbsPerUnit: 8,
        fatPerUnit: 1
      });
      vm.newAddName = '';
      vm.newAddQty = 1;

      // Recalculate with additions
      nutritionService.calculateNutritionAPI({
        recipeId: vm.selectedRecipe._id,
        servings: vm.servings,
        customIngredients: vm.customAdditions
      }).then(function(res) {
        if (res.success) {
          vm.calculatedNutrition = res.nutrition;
        }
      });
    };

    vm.removeCustomIngredient = function(idx) {
      vm.customAdditions.splice(idx, 1);
      vm.recalculate();
    };

    vm.init();
  }]);
})();
