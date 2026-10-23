/**
 * SpiceSense - nutritionService
 * Demonstrates: Core Flexible Cooking Engine logic & Dynamic Calorie Calculator
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('nutritionService', ['$http', function($http) {
    return {
      // Calculate scaled ingredient quantities based on original vs target servings
      scaleIngredients: function(ingredientsList, baseServings, targetServings) {
        if (!ingredientsList || !baseServings || !targetServings || baseServings === targetServings) {
          return ingredientsList;
        }

        var ratio = targetServings / baseServings;

        return ingredientsList.map(function(item) {
          var scaledQty = Number((item.quantity * ratio).toFixed(2));
          return {
            name: item.name,
            quantity: scaledQty,
            unit: item.unit,
            category: item.category,
            isOptional: item.isOptional
          };
        });
      },

      // Calculate scaled nutrition macros per serving and total meal
      scaleNutrition: function(baseNutrition, baseServings, targetServings) {
        if (!baseNutrition) {
          return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        }

        var ratio = (targetServings || baseServings) / (baseServings || 4);

        var totalCal = Math.round(baseNutrition.calories * ratio);
        var totalProt = Number((baseNutrition.protein * ratio).toFixed(1));
        var totalCarb = Number((baseNutrition.carbs * ratio).toFixed(1));
        var totalFat = Number((baseNutrition.fat * ratio).toFixed(1));
        var totalFiber = Number((baseNutrition.fiber * ratio).toFixed(1));

        return {
          total: {
            calories: totalCal,
            protein: totalProt,
            carbs: totalCarb,
            fat: totalFat,
            fiber: totalFiber
          },
          perServing: {
            calories: baseNutrition.calories,
            protein: baseNutrition.protein,
            carbs: baseNutrition.carbs,
            fat: baseNutrition.fat,
            fiber: baseNutrition.fiber
          }
        };
      },

      calculateNutritionAPI: function(data) {
        return $http.post('/api/nutrition/calculate', data)
          .then(function(res) { return res.data; });
      }
    };
  }]);
})();
