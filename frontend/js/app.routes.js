/**
 * SpiceSense - Client Routing Configuration
 * Demonstrates: AngularJS ngRoute, $routeProvider, SPA navigation, route guards
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    // Helper: resolve factory that marks a route as requiring authentication
    // The actual redirect happens in the $routeChangeStart handler in app.module.js
    function authRequired() {
      return { requiresAuth: true };
    }

    $routeProvider
      // ── PUBLIC ROUTES ──────────────────────────────────────
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'authController',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'authController',
        controllerAs: 'vm'
      })
      .when('/auth', {
        redirectTo: '/login'
      })

      // ── PROTECTED ROUTES (login required) ──────────────────
      .when('/recipes', {
        templateUrl: 'views/recipes.html',
        controller: 'recipeController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/recipes/:id', {
        templateUrl: 'views/recipe-detail.html',
        controller: 'recipeDetailController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/leftover-lab', {
        templateUrl: 'views/leftover-lab.html',
        controller: 'leftoverController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/what-can-i-cook', {
        templateUrl: 'views/what-can-i-cook.html',
        controller: 'whatCanICookController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/nutrition-calculator', {
        templateUrl: 'views/nutrition-calculator.html',
        controller: 'nutritionController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/budget-mode', {
        templateUrl: 'views/budget-mode.html',
        controller: 'budgetController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/regional-explorer', {
        templateUrl: 'views/regional-explorer.html',
        controller: 'regionalController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/shopping-list', {
        templateUrl: 'views/shopping-list.html',
        controller: 'shoppingController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .when('/add-recipe', {
        templateUrl: 'views/add-recipe.html',
        controller: 'addRecipeController',
        data: { requiresAuth: true }
      })
      .when('/edit-recipe/:id', {
        templateUrl: 'views/add-recipe.html',
        controller: 'addRecipeController',
        data: { requiresAuth: true }
      })
      .when('/community-kitchen', {
        templateUrl: 'views/community-kitchen.html',
        controller: 'communityRecipeController',
        data: { requiresAuth: true }
      })
      .when('/my-recipes', {
        templateUrl: 'views/my-recipes.html',
        controller: 'myRecipesController',
        data: { requiresAuth: true }
      })
      .when('/taste-rescue', {
        templateUrl: 'views/taste-rescue.html',
        controller: 'tasteRescueController',
        data: { requiresAuth: true }
      })

      .otherwise({
        redirectTo: '/'
      });

    // Hashbang mode for compatibility
    $locationProvider.html5Mode(false);
  }]);
})();
