/**
 * SpiceSense - ingredientSelector Directive (<ingredient-selector>)
 * Demonstrates: Interactive Multi-Select Chip Tags, Custom Search Filtering, Scope Binding
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('ingredientSelector', ['ingredientService', function(ingredientService) {
    return {
      restrict: 'E',
      scope: {
        selectedIngredients: '=',
        onChange: '&'
      },
      template: [
        '<div>',
        '  <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">',
        '    <input type="text" ng-model="searchQuery" class="form-control" placeholder="Search or type custom ingredient (e.g., Idli, Sambar, Onion)..." style="flex: 1; padding: 0.6rem 1rem; border-radius: var(--radius-pill); border: 1px solid var(--border); outline: none;">',
        '    <button class="btn btn-sm btn-primary" ng-click="addCustomIngredient()" ng-disabled="!searchQuery">Add Ingredient</button>',
        '  </div>',
        '  <div class="ingredient-chip-group">',
        '    <div class="chip-item" ng-repeat="ing in pantryList | filter:searchQuery" ng-class="{\'selected\': isSelected(ing)}" ng-click="toggleIng(ing)">',
        '      <i class="fa-solid" ng-class="isSelected(ing) ? \'fa-circle-check\' : \'fa-plus\'"></i> {{ing}}',
        '    </div>',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope) {
        scope.pantryList = ingredientService.getCommonPantryIngredients();
        if (!scope.selectedIngredients) scope.selectedIngredients = [];

        scope.isSelected = function(ing) {
          return scope.selectedIngredients.indexOf(ing) !== -1;
        };

        scope.toggleIng = function(ing) {
          var idx = scope.selectedIngredients.indexOf(ing);
          if (idx !== -1) {
            scope.selectedIngredients.splice(idx, 1);
          } else {
            scope.selectedIngredients.push(ing);
          }
          if (scope.onChange) scope.onChange();
        };

        scope.addCustomIngredient = function() {
          if (!scope.searchQuery) return;
          var trimmed = scope.searchQuery.trim();
          if (trimmed && scope.selectedIngredients.indexOf(trimmed) === -1) {
            scope.selectedIngredients.push(trimmed);
            if (scope.pantryList.indexOf(trimmed) === -1) {
              scope.pantryList.unshift(trimmed);
            }
            scope.searchQuery = '';
            if (scope.onChange) scope.onChange();
          }
        };
      }
    };
  }]);
})();
