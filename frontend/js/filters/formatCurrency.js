/**
 * SpiceSense - formatCurrency Filter
 * Demonstrates: INR Currency Formatting
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .filter('formatCurrency', [function() {
    return function(input) {
      if (input === undefined || input === null) return '₹0';
      return '₹' + Number(input).toLocaleString('en-IN');
    };
  }]);
})();
