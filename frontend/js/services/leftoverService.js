/**
 * SpiceSense - leftoverService
 * Demonstrates: Leftover Lab API integration
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('leftoverService', ['$http', function($http) {
    return {
      getOptions: function() {
        return $http.get('/api/leftovers/options')
          .then(function(res) { return res.data; });
      },

      matchLeftover: function(leftoverItem, extraAvailableIngredients) {
        return $http.post('/api/leftovers/match', {
          leftoverItem: leftoverItem,
          extraAvailableIngredients: extraAvailableIngredients || []
        }).then(function(res) { return res.data; });
      }
    };
  }]);
})();
