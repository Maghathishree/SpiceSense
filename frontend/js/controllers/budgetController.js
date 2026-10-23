/**
 * SpiceSense - budgetController
 * Demonstrates: Cook Under My Budget Solver Engine
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .controller('budgetController', ['budgetService', function(budgetService) {
    var vm = this;

    vm.budgetLimit = 120;
    vm.peopleCount = 3;
    vm.budgetResults = [];
    vm.isCalculating = false;

    vm.runBudgetCalculation = function() {
      vm.isCalculating = true;
      budgetService.calculateBudgetRecipes(vm.budgetLimit, vm.peopleCount)
        .then(function(data) {
          vm.isCalculating = false;
          if (data.success) {
            vm.budgetResults = data.results;
          }
        })
        .catch(function(err) {
          vm.isCalculating = false;
          console.error('Budget calculation error:', err);
        });
    };

    vm.runBudgetCalculation();
  }]);
})();
