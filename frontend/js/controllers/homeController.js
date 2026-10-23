/**
 * SpiceSense - homeController
 * Demonstrates: AngularJS Controllers, Dependency Injection, Scope State Management
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('homeController', ['recipeService', 'storageService', function(recipeService, storageService) {
    var vm = this;

    vm.popularRecipes = [];
    vm.traditionalRecipes = [];
    vm.fusionRecipes = [];
    vm.paatiSpecials = [];
    vm.recentlyViewed = [];
    vm.isLoading = true;

    // Load home page sections
    function init() {
      vm.recentlyViewed = storageService.getRecentlyViewed();

      recipeService.getAllRecipes()
        .then(function(data) {
          vm.isLoading = false;
          if (data.success) {
            var all = data.recipes;
            vm.popularRecipes = all.slice(0, 6);
            vm.traditionalRecipes = all.filter(function(r) { return r.isTraditional; }).slice(0, 4);
            vm.fusionRecipes = all.filter(function(r) { return !r.isTraditional; }).slice(0, 4);
            vm.paatiSpecials = all.filter(function(r) { return !!r.paatiTip; }).slice(0, 4);
          }
        })
        .catch(function(err) {
          vm.isLoading = false;
          console.error('Error loading home recipes:', err);
        });
    }

    init();
  }]);
})();
