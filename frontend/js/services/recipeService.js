/**
 * SpiceSense - recipeService
 * Demonstrates: AngularJS Service, REST API integration, HTTP promises, Protected CRUD
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('recipeService', ['$http', 'authService', function($http, authService) {
    return {
      getAllRecipes: function(queryParams) {
        return $http.get('/api/recipes', { params: queryParams || {} })
          .then(function(res) { return res.data; });
      },

      getRecipeById: function(id) {
        return $http.get('/api/recipes/' + id)
          .then(function(res) { return res.data; });
      },

      getCommunityRecipes: function(queryParams) {
        return $http.get('/api/recipes/community', { params: queryParams || {} })
          .then(function(res) { return res.data; });
      },

      getMyRecipes: function() {
        return $http.get('/api/recipes/my', { headers: authService.getAuthHeaders() })
          .then(function(res) { return res.data; });
      },

      createRecipe: function(recipeData) {
        return $http.post('/api/recipes', recipeData, { headers: authService.getAuthHeaders() })
          .then(function(res) { return res.data; });
      },

      updateRecipe: function(id, recipeData) {
        return $http.put('/api/recipes/' + id, recipeData, { headers: authService.getAuthHeaders() })
          .then(function(res) { return res.data; });
      },

      deleteRecipe: function(id) {
        return $http.delete('/api/recipes/' + id, { headers: authService.getAuthHeaders() })
          .then(function(res) { return res.data; });
      },

      searchByIngredients: function(ingredientsList) {
        return $http.post('/api/recipes/search-ingredients', { availableIngredients: ingredientsList })
          .then(function(res) { return res.data; });
      },

      getBudgetRecipes: function(budget, people) {
        return $http.get('/api/recipes/budget', { params: { budget: budget, people: people } })
          .then(function(res) { return res.data; });
      }
    };
  }]);
})();
