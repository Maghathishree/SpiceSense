/**
 * SpiceSense - ingredientInput Directive (<ingredient-input>)
 * Demonstrates: Custom AngularJS Directive, Isolated Scope (`=ingredients`), Dynamic ng-repeat, Row Validation & Two-Way Binding
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('ingredientInput', [function() {
    return {
      restrict: 'E',
      scope: {
        ingredients: '=',
        required: '=?'
      },
      template: [
        '<div class="ingredient-input-directive">',
        '  <div class="form-section-header">',
        '    <div>',
        '      <h2 class="form-section-title">',
        '        <i class="fa-solid fa-mortar-pestle"></i> 3. Recipe Ingredients',
        '      </h2>',
        '      <div class="form-section-subtitle">Specify Tamil & South Indian ingredients with accurate quantities and units</div>',
        '    </div>',
        '    <button type="button" class="btn btn-sm btn-outline-primary" ng-click="addIngredient()" style="height: 38px;">',
        '      <i class="fa-solid fa-plus"></i> Add Ingredient',
        '    </button>',
        '  </div>',
        '  <div class="ingredient-rows">',
        '    <div ng-repeat="item in ingredients track by $index" class="instruction-step-card" style="margin-bottom: 1rem;">',
        '      <div style="display: grid; grid-template-columns: 2.2fr 1fr 1.2fr 1.4fr auto; gap: 1rem; align-items: flex-end;">',
        '        <div>',
        '          <label class="field-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Ingredient Name <span class="req">*</span></label>',
        '          <input type="text" class="studio-input" ng-model="item.name" placeholder="e.g. Sambar Powder, Toor Dal, Curry Leaves" required>',
        '        </div>',
        '        <div>',
        '          <label class="field-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Qty <span class="req">*</span></label>',
        '          <input type="number" min="0.1" step="any" class="studio-input" ng-model="item.quantity" placeholder="1" required>',
        '        </div>',
        '        <div>',
        '          <label class="field-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Unit <span class="req">*</span></label>',
        '          <select class="studio-input" ng-model="item.unit">',
        '            <option value="g">g (grams)</option>',
        '            <option value="kg">kg</option>',
        '            <option value="ml">ml</option>',
        '            <option value="litres">litres</option>',
        '            <option value="tsp">tsp</option>',
        '            <option value="tbsp">tbsp</option>',
        '            <option value="cups">cups</option>',
        '            <option value="pcs">pieces</option>',
        '            <option value="sprig">sprigs</option>',
        '            <option value="pinch">pinch</option>',
        '            <option value="to taste">to taste</option>',
        '          </select>',
        '        </div>',
        '        <div>',
        '          <label class="field-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Category</label>',
        '          <select class="studio-input" ng-model="item.category">',
        '            <option value="Spices">Spices</option>',
        '            <option value="Lentils & Pulses">Lentils & Pulses</option>',
        '            <option value="Grains & Flours">Grains & Flours</option>',
        '            <option value="Vegetables">Vegetables</option>',
        '            <option value="Dairy & Oils">Dairy & Oils</option>',
        '            <option value="Seasonings">Seasonings</option>',
        '            <option value="General">General</option>',
        '          </select>',
        '        </div>',
        '        <div>',
        '          <button type="button" class="btn btn-sm btn-outline-danger" ng-click="removeIngredient($index)" ng-disabled="ingredients.length <= 1" title="Remove ingredient" style="height: 46px; width: 46px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px;">',
        '            <i class="fa-solid fa-trash-can"></i>',
        '          </button>',
        '        </div>',
        '      </div>',
        '      <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #64748B;">',
        '        <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer; margin: 0; user-select: none;">',
        '          <input type="checkbox" ng-model="item.isOptional" style="width: 16px; height: 16px; cursor: pointer;"> Optional / Garnish item',
        '        </label>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="mt-3 text-right">',
        '    <button type="button" class="btn btn-sm btn-outline-primary" ng-click="addIngredient()" style="height: 38px;">',
        '      <i class="fa-solid fa-plus"></i> Add Another Ingredient',
        '    </button>',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope) {
        if (!scope.ingredients || !Array.isArray(scope.ingredients) || scope.ingredients.length === 0) {
          scope.ingredients = [
            { name: '', quantity: 1, unit: 'tbsp', category: 'Spices', isOptional: false }
          ];
        }

        scope.addIngredient = function() {
          scope.ingredients.push({
            name: '',
            quantity: 1,
            unit: 'tsp',
            category: 'Spices',
            isOptional: false
          });
        };

        scope.removeIngredient = function(index) {
          if (scope.ingredients.length > 1) {
            scope.ingredients.splice(index, 1);
          }
        };
      }
    };
  }]);
})();
