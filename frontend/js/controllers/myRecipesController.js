/**
 * SpiceSense - myRecipesController
 * Displays recipes created by the authenticated user with management actions (Edit, Delete, Add).
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('myRecipesController', [
    '$scope',
    '$location',
    'recipeService',
    'authService',
    function($scope, $location, recipeService, authService) {

      if (!authService.isLoggedIn()) {
        $location.path('/auth').search({ redirect: '/my-recipes' });
        return;
      }

      $scope.currentUser = authService.getUser();
      $scope.myRecipes = [];
      $scope.loading = true;
      $scope.errorMessage = '';
      $scope.successMessage = '';

      $scope.loadMyRecipes = function() {
        $scope.loading = true;
        recipeService.getMyRecipes()
          .then(function(res) {
            $scope.loading = false;
            if (res.success) {
              $scope.myRecipes = res.recipes || [];
            }
          })
          .catch(function(err) {
            $scope.loading = false;
            $scope.errorMessage = (err.data && err.data.message) || 'Failed to load your recipes.';
          });
      };

      $scope.editRecipe = function(recipeId) {
        $location.path('/edit-recipe/' + recipeId);
      };

      $scope.deleteRecipe = function(recipe) {
        if (!confirm('Are you sure you want to delete "' + recipe.name + '"? This action cannot be undone.')) {
          return;
        }

        recipeService.deleteRecipe(recipe._id)
          .then(function(res) {
            if (res.success) {
              $scope.successMessage = 'Recipe "' + recipe.name + '" deleted successfully.';
              $scope.myRecipes = $scope.myRecipes.filter(function(r) {
                return r._id !== recipe._id;
              });
              setTimeout(function() {
                $scope.successMessage = '';
                $scope.$apply();
              }, 3000);
            }
          })
          .catch(function(err) {
            $scope.errorMessage = (err.data && err.data.message) || 'Failed to delete recipe.';
          });
      };

      // ── Stats helpers for the dashboard header ──
      $scope.totalIngredients = function() {
        return $scope.myRecipes.reduce(function(sum, r) {
          return sum + (r.ingredients ? r.ingredients.length : 0);
        }, 0);
      };

      $scope.uniqueRegions = function() {
        var regions = {};
        $scope.myRecipes.forEach(function(r) {
          if (r.region) regions[r.region] = true;
        });
        return Object.keys(regions).length;
      };

      // Initial load
      $scope.loadMyRecipes();
    }
  ]);
})();
