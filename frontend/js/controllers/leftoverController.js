/**
 * SpiceSense - leftoverController
 * Demonstrates: Leftover Lab Transformation Flow Engine & Matching Logic
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('leftoverController', ['leftoverService', 'ingredientService', '$location', function(leftoverService, ingredientService, $location) {
    var vm = this;

    vm.leftoverOptions = [];
    vm.selectedLeftover = 'Leftover Idli';
    vm.customLeftoverInput = '';
    vm.pantryIngredients = ['Onion', 'Tomato', 'Curry Leaves', 'Green Chillies', 'Garlic', 'Capsicum', 'Soy Sauce', 'Chilli Powder', 'Eggs', 'Paneer'];
    vm.selectedPantry = ['Onion', 'Curry Leaves', 'Green Chillies'];

    vm.suggestions = [];
    vm.isMatching = false;
    vm.hasSearched = false;

    // Load available leftover options
    vm.init = function() {
      var searchParams = $location.search();
      if (searchParams.item) {
        vm.selectedLeftover = searchParams.item;
      } else if (searchParams.query) {
        vm.selectedLeftover = searchParams.query;
        vm.customLeftoverInput = searchParams.query;
      }

      leftoverService.getOptions()
        .then(function(data) {
          if (data.success && data.leftovers.length) {
            vm.leftoverOptions = data.leftovers;
          } else {
            vm.leftoverOptions = [
              { leftoverItem: 'Leftover Idli' },
              { leftoverItem: 'Leftover Sambar' },
              { leftoverItem: 'Leftover Rasam' },
              { leftoverItem: 'Leftover Chapati' },
              { leftoverItem: 'Leftover Cooked Rice' }
            ];
          }
          vm.runMatch();
        })
        .catch(function(err) {
          console.error('Error fetching leftover options:', err);
          vm.runMatch();
        });
    };

    vm.selectLeftoverPreset = function(item) {
      vm.selectedLeftover = item;
      vm.customLeftoverInput = '';
      vm.runMatch();
    };

    vm.togglePantryItem = function(item) {
      var idx = vm.selectedPantry.indexOf(item);
      if (idx !== -1) {
        vm.selectedPantry.splice(idx, 1);
      } else {
        vm.selectedPantry.push(item);
      }
      vm.runMatch();
    };

    vm.runMatch = function() {
      var targetItem = vm.customLeftoverInput.trim() || vm.selectedLeftover;
      if (!targetItem) return;

      vm.isMatching = true;
      vm.hasSearched = true;

      leftoverService.matchLeftover(targetItem, vm.selectedPantry)
        .then(function(data) {
          vm.isMatching = false;
          if (data.success) {
            vm.suggestions = data.suggestions;
          }
        })
        .catch(function(err) {
          vm.isMatching = false;
          console.error('Leftover match error:', err);
        });
    };

    vm.init();
  }]);
})();
