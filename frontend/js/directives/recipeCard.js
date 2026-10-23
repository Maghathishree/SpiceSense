/**
 * SpiceSense - recipeCard Directive (<recipe-card>)
 * Demonstrates: Custom AngularJS Directives, Isolated Scope (`=recipe`, `&onFavorite`), Element Component Restriction ('E')
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('recipeCard', [function() {
    return {
      restrict: 'E',
      scope: {
        recipe: '=',
        onFavorite: '&'
      },
      template: [
        '<div class="recipe-card-container">',
        '  <div class="recipe-card-img-wrapper">',
        '    <img ng-src="{{recipe.image || recipe.imageUrl || \'assets/recipes/community-placeholder.jpg\'}}" alt="{{recipe.name}}" style="object-fit: cover;">',
        '    <div class="recipe-card-overlay-badges">',
        '      <span class="badge" ng-class="recipe.isTraditional ? \'badge-traditional\' : \'badge-fusion\'">',
        '        <i class="fa-solid" ng-class="recipe.isTraditional ? \'fa-scroll\' : \'fa-wand-magic-sparkles\'"></i>',
        '        {{recipe.isTraditional ? \'Traditional\' : \'Fusion\'}}',
        '      </span>',
        '      <button class="fav-btn-icon" ng-click="toggleFav($event)" title="Add to Favorites">',
        '        <i class="fa-solid fa-heart"></i>',
        '      </button>',
        '    </div>',
        '  </div>',
        '  <div class="recipe-card-body">',
        '    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.4rem;">',
        '      <span class="badge badge-region"><i class="fa-solid fa-location-dot"></i> {{recipe.region}}</span>',
        '      <span class="badge badge-diet" ng-if="recipe.dietaryTags.length"><i class="fa-solid fa-leaf"></i> {{recipe.dietaryTags[0]}}</span>',
        '    </div>',
        '    <h3 class="recipe-card-title">{{recipe.name}}</h3>',
        '    <div class="recipe-card-tamil-title" ng-if="recipe.tamilName">{{recipe.tamilName}}</div>',
        '    <p class="recipe-card-desc">{{recipe.description}}</p>',
        '    <div class="recipe-card-meta">',
        '      <div class="recipe-card-meta-item"><i class="fa-regular fa-clock" style="color: var(--primary);"></i> {{recipe.cookTimeMinutes}} mins</div>',
        '      <div class="recipe-card-meta-item"><i class="fa-solid fa-fire-flame-curved" style="color: var(--secondary);"></i> {{recipe.nutritionPerServing.calories}} kcal</div>',
        '      <div class="recipe-card-meta-item">',
        '        <spice-meter level="recipe.spiceLevel"></spice-meter>',
        '      </div>',
        '    </div>',
        '    <div class="recipe-card-footer">',
        '      <div class="recipe-cost-tag">&#8377;{{recipe.estimatedCostINR}} <span style="font-size: 0.75rem; color: #64748B; font-weight: normal;">/ batch</span></div>',
        '      <a ng-href="#!/recipes/{{recipe._id}}" class="btn btn-sm btn-primary">',
        '        Cook Now <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem;"></i>',
        '      </a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join(''),
      link: function(scope) {
        scope.toggleFav = function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (scope.onFavorite) {
            scope.onFavorite({ recipe: scope.recipe });
          }
        };
      }
    };
  }]);
})();
