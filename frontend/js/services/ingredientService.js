/**
 * SpiceSense - ingredientService
 * Demonstrates: Ingredient Master Catalog & Smart Substitution Engine
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('ingredientService', [function() {
    var commonPantryIngredients = [
      'Rice', 'Idli Rice', 'Toor Dal', 'Urad Dal', 'Yellow Moong Dal',
      'Tomato', 'Onion', 'Small Onions (Shallots)', 'Curry Leaves', 'Garlic',
      'Ginger', 'Green Chillies', 'Dry Red Chillies', 'Mustard Seeds', 'Cumin Seeds',
      'Coconut', 'Ghee', 'Gingelly Oil', 'Tamarind', 'Sambar Powder', 'Cardamom',
      'Curd', 'Paneer', 'Eggs', 'Chicken', 'Mushroom', 'Drumstick', 'Spinach',
      'Capsicum', 'Rava', 'Millet'
    ];

    var substitutionMap = {
      'Tamarind Extract': [
        { substituteIngredient: 'Lemon Juice', quantityRatio: '1 tbsp per 2 tbsp Tamarind', tasteImpact: 'Fresh tangy citrus profile', whenToAdd: 'Add right after turning off flame' },
        { substituteIngredient: 'Raw Mango Pulp', quantityRatio: '1.5 tbsp per 2 tbsp Tamarind', tasteImpact: 'Fruity sourness with mild sweetness', whenToAdd: 'Boil along with curries' },
        { substituteIngredient: 'Tomato Puree', quantityRatio: '3 tbsp per 2 tbsp Tamarind', tasteImpact: 'Mildly sweet tangy body', whenToAdd: 'Sauté initially with onions' }
      ],
      'Grated Coconut': [
        { substituteIngredient: 'Cashew Paste', quantityRatio: '2 tbsp Cashew Paste per 0.5 cup Coconut', tasteImpact: 'Luxurious creaminess without coconut fibers', whenToAdd: 'Add 5 minutes before finishing dish' },
        { substituteIngredient: 'Coconut Milk', quantityRatio: '0.5 cup per 0.5 cup Grated Coconut', tasteImpact: 'Smooth velvety liquid texture', whenToAdd: 'Simmer gently on low heat' },
        { substituteIngredient: 'Roasted Poppy Seeds (Kasa Kasa)', quantityRatio: '1 tbsp Paste', tasteImpact: 'Nutty thick Chettinad style gravy', whenToAdd: 'Grind into spice masala' }
      ],
      'Curd / Yogurt': [
        { substituteIngredient: 'Lemon Juice + Fresh Milk', quantityRatio: '1 cup milk + 1 tbsp lemon', tasteImpact: 'Creamy sour buttermilk substitute', whenToAdd: 'Rest 10 minutes then add' },
        { substituteIngredient: 'Cashew Curd', quantityRatio: '1:1 ratio', tasteImpact: 'Rich vegan plant-based curd', whenToAdd: 'Mix directly into dish' }
      ],
      'Desi Ghee': [
        { substituteIngredient: 'Cold Pressed Gingelly Oil (Sesame)', quantityRatio: '1:1 ratio', tasteImpact: 'Authentic Southern nutty sesame aroma', whenToAdd: 'Use for frying or tempering' },
        { substituteIngredient: 'Coconut Oil', quantityRatio: '1:1 ratio', tasteImpact: 'Tropical fragrance characteristic of Nagercoil cuisine', whenToAdd: 'Drizzle over warm dish' }
      ]
    };

    return {
      getCommonPantryIngredients: function() {
        return commonPantryIngredients;
      },

      getSubstitutesFor: function(ingredientName) {
        if (!ingredientName) return [];
        for (var key in substitutionMap) {
          if (key.toLowerCase().includes(ingredientName.toLowerCase()) || ingredientName.toLowerCase().includes(key.toLowerCase())) {
            return substitutionMap[key];
          }
        }
        // Default universal fallback
        return [
          { substituteIngredient: 'Seasonal Local Herb / Vegetable', quantityRatio: 'Equal quantity', tasteImpact: 'Earthy fresh adaptation', whenToAdd: 'Sauté during tempering' }
        ];
      }
    };
  }]);
})();
