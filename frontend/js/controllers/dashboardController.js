/**
 * SpiceSense - dashboardController
 * Demonstrates: Personalized User Dashboard, Favorites, Cooking History & Notes
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('dashboardController', ['authService', 'recipeService', 'storageService', '$rootScope', '$location', function(authService, recipeService, storageService, $rootScope, $location) {
    var vm = this;

    vm.user = authService.getUser() || { username: 'Guest Chef', email: 'guest@spicesense.in' };
    vm.favorites = [];
    vm.recentlyViewed = [];
    vm.myRecipes = [];
    vm.cookingHistory = [
      { recipeName: 'Traditional Madurai Idli & Sambar', cookedAt: new Date(), servings: 4, caloriesConsumed: 280, notes: 'Super soft idlis, reduce red chilli slightly next time.' },
      { recipeName: 'Chettinad Chicken / Mushroom Sukka', cookedAt: new Date(Date.now() - 86400000 * 2), servings: 3, caloriesConsumed: 340, notes: 'Used extra kalpasi spice.' }
    ];

    vm.init = function() {
      vm.recentlyViewed = storageService.getRecentlyViewed();

      // Load all recipes and filter favorites
      recipeService.getAllRecipes()
        .then(function(data) {
          if (data.success && data.recipes.length) {
            vm.favorites = data.recipes.slice(0, 3);
          }
        });

      // Load user's own created recipes
      if (authService.isLoggedIn()) {
        recipeService.getMyRecipes()
          .then(function(res) {
            if (res.success) {
              vm.myRecipes = res.recipes || [];
            }
          })
          .catch(function(err) {
            console.error('Error fetching my recipes in dashboard:', err);
          });
      }
    };

    vm.init();
  }]);
})();
