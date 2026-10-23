/**
 * SpiceSense - spiceMeter Directive (<spice-meter>)
 * Demonstrates: Visual Component Directive, Flame Level Renderer
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('spiceMeter', [function() {
    return {
      restrict: 'E',
      scope: {
        level: '='
      },
      template: [
        '<div class="spice-meter-bar" title="Spice Level: {{getSpiceName(level)}}">',
        '  <i class="fa-solid fa-fire spice-flame" ng-class="{\'active\': level >= 1}" style="color: #F59E0B;"></i>',
        '  <i class="fa-solid fa-fire spice-flame" ng-class="{\'active\': level >= 2}" style="color: #EA580C;"></i>',
        '  <i class="fa-solid fa-fire spice-flame" ng-class="{\'active\': level >= 3}" style="color: #DC2626;"></i>',
        '  <i class="fa-solid fa-fire spice-flame" ng-class="{\'active\': level >= 4}" style="color: #991B1B;"></i>',
        '  <span style="font-size: 0.75rem; font-weight: 700; margin-left: 0.2rem; color: var(--secondary);">{{getSpiceName(level)}}</span>',
        '</div>'
      ].join(''),
      link: function(scope) {
        scope.getSpiceName = function(lvl) {
          switch (Number(lvl)) {
            case 1: return 'Mild';
            case 2: return 'Medium';
            case 3: return 'Spicy';
            case 4: return 'Extra Spicy';
            default: return 'Medium';
          }
        };
      }
    };
  }]);
})();
