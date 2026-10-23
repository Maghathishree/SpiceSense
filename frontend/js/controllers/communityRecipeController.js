/**
 * SpiceSense - communityRecipeController
 * Handles the Community Kitchen showcase where user-submitted recipes are explored and celebrated.
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('communityRecipeController', [
    '$scope',
    '$location',
    'recipeService',
    'authService',
    'storageService',
    function($scope, $location, recipeService, authService, storageService) {

      $scope.isLoggedIn = authService.isLoggedIn();
      $scope.currentUser = authService.getUser();
      $scope.recipes = [];
      $scope.isLoading = true;
      $scope.errorMessage = '';

      // Filters
      $scope.searchQuery = '';
      $scope.selectedCategory = 'All';
      $scope.selectedRegion = 'All';
      $scope.selectedClassification = 'All';
      $scope.sortBy = 'createdAt';

      $scope.categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Sweets', 'Fusion', 'Regional'];
      $scope.regions = ['All', 'Chettinad', 'Madurai', 'Tirunelveli', 'Kongu Nadu', 'Thanjavur', 'Chennai', 'Coimbatore', 'Nagercoil', 'All Tamil Nadu'];
      $scope.classifications = ['All', 'Traditional', 'Modern', 'Fusion'];

      $scope.loadCommunityRecipes = function() {
        $scope.isLoading = true;
        var params = {};
        if ($scope.selectedCategory !== 'All') params.category = $scope.selectedCategory;
        if ($scope.selectedRegion !== 'All') params.region = $scope.selectedRegion;
        if ($scope.selectedClassification !== 'All') params.classification = $scope.selectedClassification;
        if ($scope.searchQuery.trim()) params.search = $scope.searchQuery.trim();
        params.sortBy = $scope.sortBy;

        recipeService.getCommunityRecipes(params)
          .then(function(res) {
            $scope.isLoading = false;
            if (res.success) {
              $scope.recipes = res.recipes || [];
            }
          })
          .catch(function(err) {
            $scope.isLoading = false;
            $scope.errorMessage = (err.data && err.data.message) || 'Failed to load community recipes.';
          });
      };

      $scope.resetFilters = function() {
        $scope.searchQuery = '';
        $scope.selectedCategory = 'All';
        $scope.selectedRegion = 'All';
        $scope.selectedClassification = 'All';
        $scope.sortBy = 'createdAt';
        $scope.loadCommunityRecipes();
      };

      $scope.navigateToAdd = function() {
        if ($scope.isLoggedIn) {
          $location.path('/add-recipe');
        } else {
          $location.path('/auth').search({ redirect: '/add-recipe' });
        }
      };

      $scope.onFavorite = function(recipe) {
        var favs = storageService.get(storageService.KEYS.FAVORITES, []);
        var existsIdx = favs.findIndex(function(f) { return f._id === recipe._id; });
        if (existsIdx > -1) {
          favs.splice(existsIdx, 1);
        } else {
          favs.push(recipe);
        }
        storageService.set(storageService.KEYS.FAVORITES, favs);
      };

      // Initial load
      $scope.loadCommunityRecipes();
    }
  ]);
})();
