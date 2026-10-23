/**
 * SpiceSense - leftoverCard Directive (<leftover-card>)
 * Demonstrates: Leftover Transformation Flow component
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('leftoverCard', [function() {
    return {
      restrict: 'E',
      scope: {
        recipe: '=',
        leftoverName: '='
      },
      template: [
        '<div class="leftover-card">',
        '  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">',
        '    <div>',
        '      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap;">',
        '        <span class="badge" ng-class="recipe.sourceType === \'Community Recipe\' ? \'badge-fusion\' : \'badge-traditional\'">',
        '          <i class="fa-solid" ng-class="recipe.sourceType === \'Community Recipe\' ? \'fa-users\' : \'fa-certificate\'"></i>',
        '          {{recipe.sourceType || \'Official Recipe\'}}',
        '        </span>',
        '        <span class="badge badge-region" ng-if="recipe.author"><i class="fa-solid fa-user"></i> @{{recipe.author}}</span>',
        '        <span class="badge" ng-class="recipe.isSufficientWithPantry ? \'badge-diet\' : \'badge-spice\'">',
        '          <i class="fa-solid" ng-class="recipe.isSufficientWithPantry ? \'fa-circle-check\' : \'fa-basket-shopping\'"></i>',
        '          {{recipe.isSufficientWithPantry ? \'Pantry Ready (\' + (recipe.matchPercentage || 100) + \'%)\' : \'Missing \' + recipe.missingIngredients.length + \' items\'}}',
        '        </span>',
        '      </div>',
        '      <h3 style="font-size: 1.3rem; margin-top: 0.2rem; color: var(--text-main);">',
        '        <a ng-if="recipe.recipeId" ng-href="#!/recipes/{{recipe.recipeId}}" style="color: inherit; text-decoration: none;">{{recipe.recipeName}} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem; color: var(--primary);"></i></a>',
        '        <span ng-if="!recipe.recipeId">{{recipe.recipeName}}</span>',
        '      </h3>',
        '      <span style="font-size: 0.85rem; color: var(--text-muted);">Category: {{recipe.category}}</span>',
        '    </div>',
        '    <div style="text-align: right;">',
        '      <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">~{{recipe.calories}} kcal</div>',
        '      <div style="font-size: 0.82rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> {{recipe.cookingTimeMinutes}} mins</div>',
        '    </div>',
        '  </div>',

        '  <!-- Visually Attractive Leftover Transformation Flow -->',
        '  <div class="leftover-flow-diagram">',
        '    <div class="leftover-flow-step">',
        '      <div class="step-icon"><i class="fa-solid fa-box"></i></div>',
        '      <span style="font-size: 0.8rem; font-weight: 700;">{{leftoverName || \'Leftover Item\'}}</span>',
        '    </div>',
        '    <div class="leftover-flow-arrow"><i class="fa-solid fa-right-long"></i></div>',
        '    <div class="leftover-flow-step">',
        '      <div class="step-icon" style="background: var(--accent-light); color: var(--accent);"><i class="fa-solid fa-kitchen-set"></i></div>',
        '      <span style="font-size: 0.8rem; font-weight: 700;">Matching Engine</span>',
        '    </div>',
        '    <div class="leftover-flow-arrow"><i class="fa-solid fa-right-long"></i></div>',
        '    <div class="leftover-flow-step">',
        '      <div class="step-icon" style="background: #FEF3C7; color: #D97706;"><i class="fa-solid fa-bowl-food"></i></div>',
        '      <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">{{recipe.recipeName}}</span>',
        '    </div>',
        '  </div>',

        '  <div style="margin: 0.85rem 0;" ng-if="recipe.missingIngredients && recipe.missingIngredients.length">',
        '    <strong style="font-size: 0.85rem; color: #991B1B;">Missing Ingredients:</strong>',
        '    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.3rem;">',
        '      <span class="badge badge-spice" ng-repeat="m in recipe.missingIngredients">{{m}}</span>',
        '    </div>',
        '  </div>',

        '  <div style="background: var(--bg-alt); padding: 0.85rem; border-radius: var(--radius-sm); margin-top: 0.75rem;">',
        '    <strong style="font-size: 0.85rem; color: var(--text-main); display: block; margin-bottom: 0.4rem;"><i class="fa-solid fa-list-check" style="color: var(--primary);"></i> Transformation Steps:</strong>',
        '    <ol style="padding-left: 1.2rem; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">',
        '      <li ng-repeat="step in recipe.transformationSteps track by $index">{{step}}</li>',
        '    </ol>',
        '  </div>',

        '  <div ng-if="recipe.paatiSecret" style="margin-top: 0.75rem;">',
        '    <paati-tip tip="recipe.paatiSecret"></paati-tip>',
        '  </div>',
        '</div>'
      ].join('')
    };
  }]);
})();
