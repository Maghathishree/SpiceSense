/**
 * SpiceSense - authService
 * Demonstrates: AngularJS Services, $http Dependency Injection, Promise handling
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('authService', ['$http', 'storageService', function($http, storageService) {
    var tokenKey = storageService.KEYS.TOKEN;
    var userKey = storageService.KEYS.USER;

    function getAuthHeaders() {
      var token = storageService.get(tokenKey, null);
      if (token) {
        return { 'Authorization': 'Bearer ' + token };
      }
      return {};
    }

    return {
      register: function(userData) {
        return $http.post('/api/auth/register', userData)
          .then(function(response) {
            if (response.data.success) {
              storageService.set(tokenKey, response.data.token);
              storageService.set(userKey, response.data.user);
            }
            return response.data;
          });
      },

      login: function(credentials) {
        return $http.post('/api/auth/login', credentials)
          .then(function(response) {
            if (response.data.success) {
              storageService.set(tokenKey, response.data.token);
              storageService.set(userKey, response.data.user);
            }
            return response.data;
          });
      },

      logout: function() {
        storageService.remove(tokenKey);
        storageService.remove(userKey);
      },

      getUser: function() {
        return storageService.get(userKey, null);
      },

      isLoggedIn: function() {
        return !!storageService.get(tokenKey, null);
      },

      getAuthHeaders: getAuthHeaders
    };
  }]);
})();
