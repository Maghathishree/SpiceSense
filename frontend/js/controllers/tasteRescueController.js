/**
 * SpiceSense - tasteRescueController
 * Controller for the Taste Rescue Signature Feature (Deterministic Culinary Correction Engine)
 * Demonstrates: Dynamic reactive state, rule-based computational modeling, multi-service integration
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('tasteRescueController', [
    '$scope',
    '$routeParams',
    '$location',
    'recipeService',
    'tasteRescueService',
    'shoppingService',
    function($scope, $routeParams, $location, recipeService, tasteRescueService, shoppingService) {

      $scope.allRecipes = [];
      $scope.selectedRecipeId = $routeParams.recipeId || '';
      $scope.selectedRecipe = null;
      $scope.servings = 4;
      $scope.customDishName = '';
      $scope.customCategory = 'Lunch';
      $scope.isCustomMeal = false;

      // Available taste problems from service
      $scope.tasteProblems = tasteRescueService.getProblems();
      $scope.selectedProblem = null;
      $scope.diagnosisResult = null;
      $scope.shoppingSuccessMsg = '';

      // Load all recipes for selector dropdown
      $scope.loadRecipes = function() {
        recipeService.getAllRecipes()
          .then(function(res) {
            if (res.success) {
              $scope.allRecipes = res.recipes || [];
              if ($scope.selectedRecipeId) {
                $scope.onRecipeSelect();
              }
            }
          })
          .catch(function(err) {
            console.error('Failed to load recipes in Taste Rescue:', err);
          });
      };

      $scope.onRecipeSelect = function() {
        if ($scope.selectedRecipeId === 'custom') {
          $scope.isCustomMeal = true;
          $scope.selectedRecipe = {
            name: $scope.customDishName || 'My Current Cooking Dish',
            category: $scope.customCategory,
            servings: $scope.servings || 4,
            spiceLevel: 3,
            ingredients: [],
            nutritionPerServing: { calories: 250, protein: 7, carbs: 35, fat: 8, fiber: 4 }
          };
        } else {
          $scope.isCustomMeal = false;
          var found = $scope.allRecipes.find(function(r) { return r._id === $scope.selectedRecipeId; });
          if (found) {
            $scope.selectedRecipe = angular.copy(found);
            $scope.servings = $scope.selectedRecipe.servings || 4;
          } else {
            $scope.selectedRecipe = null;
          }
        }
        if ($scope.selectedProblem) {
          $scope.runDiagnosis();
        }
      };

      $scope.selectProblem = function(prob) {
        $scope.selectedProblem = prob;
        $scope.runDiagnosis();
      };

      $scope.onServingsChange = function() {
        if ($scope.selectedProblem) {
          $scope.runDiagnosis();
        }
      };

      $scope.runDiagnosis = function() {
        if (!$scope.selectedProblem) return;

        var currentDish = $scope.selectedRecipe;
        if (!currentDish) {
          currentDish = {
            name: $scope.customDishName || 'Cooking Dish',
            category: $scope.customCategory || 'Lunch',
            servings: $scope.servings || 4,
            spiceLevel: 3,
            ingredients: [],
            nutritionPerServing: { calories: 250, protein: 7, carbs: 35, fat: 8, fiber: 4 }
          };
        }

        $scope.diagnosisResult = tasteRescueService.diagnoseAndRescue(
          currentDish,
          $scope.servings,
          $scope.selectedProblem.id
        );
      };

      $scope.addRescueIngredientToShopping = function() {
        if (!$scope.diagnosisResult || !$scope.diagnosisResult.recommendation) return;

        var rec = $scope.diagnosisResult.recommendation;
        var ingredientObj = {
          name: rec.ingredientToAdd,
          quantity: rec.suggestedQuantity,
          unit: rec.unit,
          category: 'Taste Rescue Fix'
        };

        var recipeTitle = $scope.selectedRecipe ? $scope.selectedRecipe.name : 'Taste Rescue Fix';

        shoppingService.addIngredients(recipeTitle, [ingredientObj])
          .then(function() {
            $scope.shoppingSuccessMsg = 'Added "' + rec.suggestedQuantity + ' ' + rec.unit + ' of ' + rec.ingredientToAdd + '" to your shopping list!';
            setTimeout(function() {
              $scope.shoppingSuccessMsg = '';
              $scope.$apply();
            }, 3500);
          })
          .catch(function(err) {
            console.error('Failed to add rescue ingredient to shopping:', err);
          });
      };

      $scope.sendToLeftoverLab = function() {
        var dishName = $scope.selectedRecipe ? $scope.selectedRecipe.name : 'Leftover Gravy';
        $location.path('/leftover-lab').search({ query: dishName });
      };

      $scope.resetRescue = function() {
        $scope.selectedProblem = null;
        $scope.diagnosisResult = null;
        $scope.shoppingSuccessMsg = '';
      };

      // Initialize
      $scope.loadRecipes();
    }
  ]);
})();
