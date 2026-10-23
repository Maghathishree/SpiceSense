/**
 * SpiceSense - budgetService
 * Demonstrates: Budget mode solver API calls
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('budgetService', ['$http', function($http) {
    return {
      calculateBudgetRecipes: function(budget, people) {
        return $http.get('/api/recipes/budget', {
          params: { budget: budget, people: people }
        }).then(function(res) { return res.data; });
      }
    };
  }]);
})();
