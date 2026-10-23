/**
 * SpiceSense - recipeController
 * Demonstrates: Filter integration, AngularJS Custom Filters (`spiceFilter`, `mealFilter`, `dietFilter`, `regionFilter`, `calorieFilter`), Search & Sort
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('recipeController', ['recipeService', '$routeParams', function(recipeService, $routeParams) {
    var vm = this;

    vm.recipes = [];
    vm.isLoading = true;

    // Filter Bindings
    vm.searchQuery = '';
    vm.selectedCategory = 'All';
    vm.selectedRegion = $routeParams.region || 'All';
    vm.selectedMeal = 'All';
    vm.selectedDiet = 'All';
    vm.selectedSpice = 'All';
    vm.maxCalories = 600;
    vm.sortBy = 'createdAt';

    vm.regions = ['All', 'Chettinad', 'Madurai', 'Tirunelveli', 'Kongu Nadu', 'Thanjavur', 'Chennai', 'Coimbatore', 'Nagercoil'];
    vm.meals = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
    vm.diets = ['All', 'Vegetarian', 'Vegan', 'High-Protein', 'Gluten-Free'];
    vm.spiceLevels = ['All', '1', '2', '3', '4'];

    vm.loadRecipes = function() {
      vm.isLoading = true;
      recipeService.getAllRecipes({ sortBy: vm.sortBy })
        .then(function(data) {
          vm.isLoading = false;
          if (data.success) {
            vm.recipes = data.recipes;
          }
        })
        .catch(function(err) {
          vm.isLoading = false;
          console.error('Error loading recipes:', err);
        });
    };

    vm.resetFilters = function() {
      vm.searchQuery = '';
      vm.selectedCategory = 'All';
      vm.selectedRegion = 'All';
      vm.selectedMeal = 'All';
      vm.selectedDiet = 'All';
      vm.selectedSpice = 'All';
      vm.maxCalories = 600;
      vm.sortBy = 'createdAt';
      vm.loadRecipes();
    };

    vm.loadRecipes();
  }]);
})();
