/**
 * SpiceSense - shoppingController
 * Demonstrates: Smart Shopping List with Duplicate Aggregation & LocalStorage / MongoDB Sync
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('shoppingController', ['shoppingService', function(shoppingService) {
    var vm = this;

    vm.items = [];
    vm.isLoading = true;
    vm.newItemName = '';
    vm.newItemQty = 1;
    vm.newItemUnit = 'pcs';

    vm.loadList = function() {
      vm.isLoading = true;
      shoppingService.getList()
        .then(function(items) {
          vm.isLoading = false;
          vm.items = items || [];
        })
        .catch(function(err) {
          vm.isLoading = false;
          console.error('Error fetching shopping list:', err);
        });
    };

    vm.addCustomItem = function() {
      if (!vm.newItemName) return;
      shoppingService.addIngredients('Custom Item', [{
        name: vm.newItemName,
        quantity: vm.newItemQty,
        unit: vm.newItemUnit,
        category: 'General'
      }]).then(function(items) {
        vm.items = items;
        vm.newItemName = '';
        vm.newItemQty = 1;
      });
    };

    vm.toggleItemPurchased = function(itemId) {
      shoppingService.togglePurchased(itemId)
        .then(function(items) {
          vm.items = items;
        });
    };

    vm.removeItem = function(itemId) {
      shoppingService.clearList(itemId)
        .then(function(items) {
          vm.items = items;
        });
    };

    vm.clearAll = function() {
      shoppingService.clearList()
        .then(function(items) {
          vm.items = items;
        });
    };

    vm.loadList();
  }]);
})();
