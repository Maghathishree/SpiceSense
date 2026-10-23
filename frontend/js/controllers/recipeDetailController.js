/**
 * SpiceSense - recipeDetailController
 * Demonstrates: Flexible Cooking Engine, Two-way Data Binding ($watch), Spice Personalization, Ingredient Substitution Modal
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('recipeDetailController', [
    'recipeService',
    'nutritionService',
    'ingredientService',
    'shoppingService',
    'storageService',
    'authService',
    '$routeParams',
    '$location',
    function(recipeService, nutritionService, ingredientService, shoppingService, storageService, authService, $routeParams, $location) {
    var vm = this;

    vm.recipe = null;
    vm.isLoading = true;
    vm.isOwner = false;

    // Flexible Cooking Engine state
    vm.servings = 4;
    vm.baseServings = 4;
    vm.scaledIngredients = [];
    vm.spiceLevel = 2;

    // Substitution Engine state
    vm.showSubModal = false;
    vm.selectedSubIngredient = null;
    vm.substitutesList = [];

    // Step-by-step cooking state
    vm.isCookingMode = false;
    vm.currentStepIndex = 0;
    vm.completedSteps = [];

    // Status notifications
    vm.notificationMsg = '';
    vm.notificationType = 'success';

    function showNotify(msg, type) {
      vm.notificationMsg = msg;
      vm.notificationType = type || 'success';
      setTimeout(function() {
        vm.notificationMsg = '';
      }, 4000);
    }

    vm.loadRecipe = function() {
      var id = $routeParams.id;
      if (!id) return;

      recipeService.getRecipeById(id)
        .then(function(data) {
          vm.isLoading = false;
          if (data.success) {
            vm.recipe = data.recipe;
            vm.servings = vm.recipe.servings || 4;
            vm.baseServings = vm.recipe.servings || 4;
            vm.spiceLevel = vm.recipe.spiceLevel || 2;
            vm.recalculateIngredients();

            // Check if current logged in user created this recipe
            var currentUser = authService.getUser();
            var ownerId = vm.recipe.createdBy ? (vm.recipe.createdBy._id || vm.recipe.createdBy) : null;
            var currentUserId = currentUser ? (currentUser.id || currentUser._id) : null;
            vm.isOwner = !!(ownerId && currentUserId && (String(ownerId) === String(currentUserId)));

            // Track in LocalStorage Recently Viewed
            storageService.addRecentlyViewed(vm.recipe);
          }
        })
        .catch(function(err) {
          vm.isLoading = false;
          console.error('Error loading recipe detail:', err);
        });
    };

    vm.goToTasteRescue = function() {
      $location.path('/taste-rescue').search({ recipeId: vm.recipe._id });
    };

    vm.editRecipe = function() {
      $location.path('/edit-recipe/' + vm.recipe._id);
    };

    // Flexible Cooking Engine: Recalculate ingredient quantities dynamically
    vm.recalculateIngredients = function() {
      if (!vm.recipe || !vm.recipe.ingredients) return;

      vm.scaledIngredients = nutritionService.scaleIngredients(
        vm.recipe.ingredients,
        vm.baseServings,
        vm.servings
      );

      // Adjust spice level multiplier if applicable
      if (vm.spiceLevel !== vm.recipe.spiceLevel) {
        var spiceRatio = (vm.spiceLevel / (vm.recipe.spiceLevel || 2));
        vm.scaledIngredients.forEach(function(ing) {
          var name = ing.name.toLowerCase();
          if (name.includes('chilli') || name.includes('pepper') || name.includes('sambar powder') || name.includes('masala')) {
            ing.quantity = Number((ing.quantity * spiceRatio).toFixed(2));
          }
        });
      }
    };

    // Serving change handlers
    vm.incrementServings = function() {
      vm.servings += 1;
      vm.recalculateIngredients();
    };

    vm.decrementServings = function() {
      if (vm.servings > 1) {
        vm.servings -= 1;
        vm.recalculateIngredients();
      }
    };

    // Ingredient Substitution Lookup
    vm.openSubstituteModal = function(ingredientName) {
      vm.selectedSubIngredient = ingredientName;
      vm.substitutesList = ingredientService.getSubstitutesFor(ingredientName);
      vm.showSubModal = true;
    };

    // Smart Shopping List Integration
    vm.addToShoppingList = function() {
      shoppingService.addIngredients(vm.recipe.name, vm.scaledIngredients)
        .then(function() {
          showNotify('Added ' + vm.scaledIngredients.length + ' ingredients to your Shopping List!', 'success');
        })
        .catch(function() {
          showNotify('Failed to add to shopping list.', 'error');
        });
    };

    // Start Step-by-Step Cooking Mode
    vm.toggleCookingMode = function() {
      vm.isCookingMode = !vm.isCookingMode;
      vm.currentStepIndex = 0;
      vm.completedSteps = [];
    };

    vm.toggleStepComplete = function(idx) {
      var foundIdx = vm.completedSteps.indexOf(idx);
      if (foundIdx !== -1) {
        vm.completedSteps.splice(foundIdx, 1);
      } else {
        vm.completedSteps.push(idx);
      }
    };

    vm.findLeftoversForRecipe = function() {
      $location.path('/leftover-lab').search({ item: vm.recipe.name });
    };

    vm.loadRecipe();
  }]);
})();
