/**
 * SpiceSense - paatiTip Directive (<paati-tip>)
 * Demonstrates: Grandmother Traditional Tip Component
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .directive('paatiTip', [function() {
    return {
      restrict: 'E',
      scope: {
        tip: '='
      },
      template: [
        '<div class="paati-tip-box" ng-if="tip">',
        '  <div class="paati-avatar">👵</div>',
        '  <div class="paati-tip-content">',
        '    <h5><i class="fa-solid fa-mortar-pestle"></i> Paati\'s Secret Tip</h5>',
        '    <p>"{{tip}}"</p>',
        '  </div>',
        '</div>'
      ].join('')
    };
  }]);
})();
