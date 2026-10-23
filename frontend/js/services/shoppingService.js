/**
 * SpiceSense - shoppingService
 * Demonstrates: Smart Shopping List with MongoDB sync & LocalStorage guest fallback
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('shoppingService', ['$http', 'authService', 'storageService', function($http, authService, storageService) {
    var guestKey = storageService.KEYS.GUEST_SHOPPING;

    function getLocalList() {
      return storageService.get(guestKey, []);
    }

    function saveLocalList(items) {
      storageService.set(guestKey, items);
    }

    return {
      getList: function() {
        if (authService.isLoggedIn()) {
          return $http.get('/api/shopping-list', { headers: authService.getAuthHeaders() })
            .then(function(res) { return res.data.items; });
        } else {
          return Promise.resolve(getLocalList());
        }
      },

      addIngredients: function(recipeName, ingredients) {
        if (authService.isLoggedIn()) {
          return $http.post('/api/shopping-list/add', {
            recipeName: recipeName,
            ingredients: ingredients
          }, { headers: authService.getAuthHeaders() })
          .then(function(res) { return res.data.items; });
        } else {
          var current = getLocalList();
          ingredients.forEach(function(newItem) {
            var normName = newItem.name.trim();
            var normUnit = newItem.unit || 'pcs';
            var qty = Number(newItem.quantity) || 1;

            var idx = current.findIndex(function(i) {
              return i.name.toLowerCase() === normName.toLowerCase() && i.unit === normUnit;
            });

            if (idx !== -1) {
              current[idx].quantity = Number((current[idx].quantity + qty).toFixed(1));
              if (recipeName && (!current[idx].addedFromRecipe || !current[idx].addedFromRecipe.includes(recipeName))) {
                current[idx].addedFromRecipe = (current[idx].addedFromRecipe || '') + ', ' + recipeName;
              }
            } else {
              current.push({
                _id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                name: normName,
                quantity: qty,
                unit: normUnit,
                category: newItem.category || 'General',
                isPurchased: false,
                addedFromRecipe: recipeName || 'Custom'
              });
            }
          });
          saveLocalList(current);
          return Promise.resolve(current);
        }
      },

      togglePurchased: function(itemId) {
        if (authService.isLoggedIn()) {
          return $http.put('/api/shopping-list/toggle/' + itemId, {}, { headers: authService.getAuthHeaders() })
            .then(function(res) { return res.data.items; });
        } else {
          var list = getLocalList();
          list.forEach(function(item) {
            if (item._id === itemId) item.isPurchased = !item.isPurchased;
          });
          saveLocalList(list);
          return Promise.resolve(list);
        }
      },

      clearList: function(itemId) {
        if (authService.isLoggedIn()) {
          var url = '/api/shopping-list' + (itemId ? '?itemId=' + itemId : '');
          return $http.delete(url, { headers: authService.getAuthHeaders() })
            .then(function(res) { return res.data.items; });
        } else {
          if (itemId) {
            var list = getLocalList().filter(function(i) { return i._id !== itemId; });
            saveLocalList(list);
            return Promise.resolve(list);
          } else {
            saveLocalList([]);
            return Promise.resolve([]);
          }
        }
      }
    };
  }]);
})();
