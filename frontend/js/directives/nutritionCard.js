/**
 * SpiceSense - nutritionCard Directive (<nutrition-card>)
 * Demonstrates: Custom Directives, Two-way Binding (`=servings`, `=nutrition`), Dynamic Progress Bars
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('nutritionCard', ['nutritionService', function(nutritionService) {
    return {
      restrict: 'E',
      scope: {
        nutrition: '=',
        servings: '=',
        baseServings: '='
      },
      template: [
        '<div class="nutrition-card-box">',
        '  <div class="nutrition-card-header">',
        '    <div>',
        '      <h4 style="color: #FFFFFF; font-size: 1.2rem;"><i class="fa-solid fa-chart-pie" style="color: var(--primary);"></i> Nutrition Breakdown</h4>',
        '      <span style="font-size: 0.82rem; color: #94A3B8;">Scaled for {{servings || 4}} serving(s)</span>',
        '    </div>',
        '    <div class="calories-large-badge">',
        '      <div class="num scale-pop">{{scaledNutrition.calories}}</div>',
        '      <div class="unit">Total Calories</div>',
        '    </div>',
        '  </div>',
        '  <div class="macro-bars-grid">',
        '    <div class="macro-item">',
        '      <div style="font-size: 0.78rem; color: #93C5FD; font-weight: 600;">PROTEIN</div>',
        '      <div class="macro-val">{{scaledNutrition.protein}}g</div>',
        '      <div class="macro-bar-fill"><div class="macro-bar-inner macro-protein" ng-style="{\'width\': getPercent(scaledNutrition.protein, 50) + \'%\'}"></div></div>',
        '    </div>',
        '    <div class="macro-item">',
        '      <div style="font-size: 0.78rem; color: #FDE68A; font-weight: 600;">CARBS</div>',
        '      <div class="macro-val">{{scaledNutrition.carbs}}g</div>',
        '      <div class="macro-bar-fill"><div class="macro-bar-inner macro-carbs" ng-style="{\'width\': getPercent(scaledNutrition.carbs, 100) + \'%\'}"></div></div>',
        '    </div>',
        '    <div class="macro-item">',
        '      <div style="font-size: 0.78rem; color: #FCA5A5; font-weight: 600;">FAT</div>',
        '      <div class="macro-val">{{scaledNutrition.fat}}g</div>',
        '      <div class="macro-bar-fill"><div class="macro-bar-inner macro-fat" ng-style="{\'width\': getPercent(scaledNutrition.fat, 40) + \'%\'}"></div></div>',
        '    </div>',
        '    <div class="macro-item">',
        '      <div style="font-size: 0.78rem; color: #6EE7B7; font-weight: 600;">FIBER</div>',
        '      <div class="macro-val">{{scaledNutrition.fiber}}g</div>',
        '      <div class="macro-bar-fill"><div class="macro-bar-inner macro-fiber" ng-style="{\'width\': getPercent(scaledNutrition.fiber, 25) + \'%\'}"></div></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope) {
        scope.getPercent = function(val, max) {
          if (!val) return 0;
          return Math.min(Math.round((val / max) * 100), 100);
        };

        scope.$watchGroup(['nutrition', 'servings', 'baseServings'], function() {
          if (scope.nutrition) {
            var scaled = nutritionService.scaleNutrition(scope.nutrition, scope.baseServings || 4, scope.servings || 4);
            scope.scaledNutrition = scaled.total;
          }
        }, true);
      }
    };
  }]);
})();
