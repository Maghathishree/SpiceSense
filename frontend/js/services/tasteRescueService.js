/**
 * SpiceSense - tasteRescueService
 * Demonstrates: Deterministic Rule-Based Culinary Correction Engine
 * Analyzes dish categories, ingredients, quantities, servings, and taste defects
 */
(function() {
  'use strict';

  angular.module('spiceSenseApp')
  .factory('tasteRescueService', ['nutritionService', 'ingredientService', function(nutritionService, ingredientService) {

    var TASTE_PROBLEMS = [
      { id: 'too_spicy', name: 'Too Spicy', icon: 'fa-fire-flame-curved', color: '#DC2626', desc: 'Overpowering heat from red chillies, black pepper, or masala powder.' },
      { id: 'too_salty', name: 'Too Salty', icon: 'fa-cubes-stacked', color: '#3B82F6', desc: 'Accidentally added too much salt or concentrated after reduction.' },
      { id: 'too_sour', name: 'Too Sour', icon: 'fa-lemon', color: '#F59E0B', desc: 'Excess tamarind pulp, sour country tomatoes, or over-fermented batter/curd.' },
      { id: 'too_bland', name: 'Too Bland', icon: 'fa-droplet', color: '#94A3B8', desc: 'Lacks depth, punch, salt balance, or aromatic tempering.' },
      { id: 'too_watery', name: 'Too Watery', icon: 'fa-water', color: '#06B6D4', desc: 'Gravy is runny, thin, and lacks body or coating consistency.' },
      { id: 'too_thick', name: 'Too Thick', icon: 'fa-layer-group', color: '#8B5CF6', desc: 'Sludgy, overly dense dal or stew that dried out during cooking.' },
      { id: 'too_bitter', name: 'Too Bitter', icon: 'fa-seedling', color: '#15803D', desc: 'Burnt fenugreek (methi), over-roasted spices, or bitter vegetables.' },
      { id: 'too_rich', name: 'Too Rich', icon: 'fa-bowl-rice', color: '#EA580C', desc: 'Overly heavy mouthfeel from excess ghee, butter, or saturated oils.' }
    ];

    return {
      getProblems: function() {
        return TASTE_PROBLEMS;
      },

      /**
       * Diagnose and generate custom culinary correction plan
       * @param {Object} recipe - Current recipe object or custom meal details
       * @param {Number} servings - Current serving size
       * @param {String} problemId - Selected problem ID
       */
      diagnoseAndRescue: function(recipe, servings, problemId) {
        if (!recipe) {
          recipe = {
            name: 'Custom Dish',
            category: 'Lunch',
            servings: 4,
            spiceLevel: 3,
            ingredients: [],
            nutritionPerServing: { calories: 250, protein: 7, carbs: 35, fat: 8, fiber: 4 }
          };
        }

        var currentServings = Number(servings) || Number(recipe.servings) || 4;
        var scale = currentServings / 4;
        var cat = (recipe.category || '').toLowerCase();
        var name = (recipe.name || '').toLowerCase();

        var ingredientsNames = (recipe.ingredients || []).map(function(i) {
          return (i.name || '').toLowerCase();
        });

        var hasCoconut = ingredientsNames.some(function(n) { return n.includes('coconut'); });
        var hasDal = ingredientsNames.some(function(n) { return n.includes('dal') || n.includes('paruppu'); });
        var hasTamarind = ingredientsNames.some(function(n) { return n.includes('tamarind') || n.includes('puli'); });
        var isDry = cat.includes('snack') || name.includes('sukka') || name.includes('poriyal') || name.includes('kothu');

        var recommendation = null;

        switch (problemId) {
          case 'too_spicy':
            if (hasCoconut || name.includes('kurma') || name.includes('sodhi') || name.includes('sukka')) {
              var cocoQty = Number((0.5 * scale).toFixed(1));
              recommendation = {
                title: 'Dilute Heat with Creamy Coconut Milk & Tempering',
                ingredientToAdd: 'Thick Coconut Milk',
                suggestedQuantity: cocoQty,
                unit: 'cups',
                reason: 'Coconut lipids and medium-chain fats naturally encapsulate capsaicin molecules, mitigating burning heat while enriching authentic Tamil flavors.',
                expectedEffect: 'Drops perceived spice level by 2 notches (e.g. Extra Spicy -> Medium) and creates a silky, mellow coastal consistency.',
                beforeSpice: 'Extra Spicy / Spicy (Level 4)',
                afterSpice: 'Comfortable Medium (Level 2)',
                stepInstructions: [
                  'Lower stove flame to low simmer.',
                  'Gently stir in ' + cocoQty + ' cups of fresh coconut milk.',
                  'Simmer softly for 2-3 minutes without boiling rapidly to prevent curdling.',
                  'Taste and adjust salt lightly if needed.'
                ],
                servingsAdjustment: Math.ceil(currentServings + (0.5 * scale)),
                nutritionDelta: { calories: Math.round(120 * scale), protein: 2, carbs: 4, fat: Math.round(12 * scale), fiber: 1 }
              };
            } else if (hasDal || cat.includes('lunch') || name.includes('sambar') || name.includes('kootu')) {
              var dalQty = Number((0.5 * scale).toFixed(1));
              recommendation = {
                title: 'Incorporate Boiled Mashed Toor Dal & Desi Ghee',
                ingredientToAdd: 'Cooked Mashed Dal (Toor / Moong) + Ghee',
                suggestedQuantity: dalQty,
                unit: 'cups dal + 1 tbsp Ghee',
                reason: 'Cooked dal starch absorbs free capsaicin oil, while milk proteins and fats in warm ghee coat oral heat receptors to soothe burning sensations.',
                expectedEffect: 'Restores harmonious spice balance and increases wholesome vegetable sambar/kootu yield.',
                beforeSpice: 'Burning Hot (Level 4)',
                afterSpice: 'Pleasant Medium Heat (Level 2)',
                stepInstructions: [
                  'Mash ' + dalQty + ' cups of freshly cooked plain dal with 2 tbsp warm water.',
                  'Stir thoroughly into the simmering dish on low heat.',
                  'Drizzle 1 tbsp melted warm ghee over the top.',
                  'Simmer for 2 minutes to blend flavors seamlessly.'
                ],
                servingsAdjustment: Math.ceil(currentServings + (1 * scale)),
                nutritionDelta: { calories: Math.round(140 * scale), protein: Math.round(6 * scale), carbs: Math.round(18 * scale), fat: 5, fiber: 4 }
              };
            } else if (isDry) {
              recommendation = {
                title: 'Add Parboiled Diced Potatoes or Grated Carrots',
                ingredientToAdd: 'Boiled Potato Cubes',
                suggestedQuantity: Math.max(1, Math.round(1.5 * scale)),
                unit: 'medium potatoes (diced)',
                reason: 'Potato porous starches act as natural culinary sponges, soaking up surface chilli oils and dispersing heat evenly throughout dry stirs.',
                expectedEffect: 'Lowers sharp pepper bite and adds delightful crispy texture to fry dishes.',
                beforeSpice: 'High Heat (Level 3-4)',
                afterSpice: 'Balanced Spicy (Level 2)',
                stepInstructions: [
                  'Boil and dice potatoes into 1/2-inch uniform cubes.',
                  'Toss directly into the hot pan with your stir fry/sukka on medium heat for 3 minutes.',
                  'Finish with 1 tsp fresh lemon juice.'
                ],
                servingsAdjustment: Math.ceil(currentServings + (1 * scale)),
                nutritionDelta: { calories: Math.round(110 * scale), protein: 2, carbs: 24, fat: 0, fiber: 2 }
              };
            } else {
              recommendation = {
                title: 'Add Whisked Fresh Curd / Yogurt & Cold Pressed Sesame Oil',
                ingredientToAdd: 'Whisked Fresh Curd',
                suggestedQuantity: Number((0.35 * scale).toFixed(1)),
                unit: 'cups',
                reason: 'Dairy casein proteins bind firmly to capsaicin, washing it off oral pain receptors instantly.',
                expectedEffect: 'Cools down fiery gravies into a soothing, tangy, creamy sauce.',
                beforeSpice: 'Fiery Hot (Level 4)',
                afterSpice: 'Mild / Medium (Level 2)',
                stepInstructions: [
                  'Turn off the heat completely to prevent milk proteins from separating.',
                  'Whisk ' + Number((0.35 * scale).toFixed(1)) + ' cups curd until ultra-smooth.',
                  'Gently fold into the warm gravy and stir in 1 tsp sesame oil.'
                ],
                servingsAdjustment: currentServings,
                nutritionDelta: { calories: Math.round(60 * scale), protein: 3, carbs: 4, fat: 3, fiber: 0 }
              };
            }
            break;

          case 'too_salty':
            recommendation = {
              title: 'Paati\'s Osmotic Raw Potato Absorption & Neutral Dal Mash',
              ingredientToAdd: 'Raw Peeled Potato Slices & Water',
              suggestedQuantity: Math.max(2, Math.round(2 * scale)),
              unit: 'thick raw potato halves',
              reason: 'Raw potato slices possess cellular porosity that draws in excess dissolved sodium chloride via natural osmosis during a 10-minute simmer.',
              expectedEffect: 'Extracts 25-35% of excess salt without altering spice aromatics or color.',
              beforeSpice: 'Over-salted / Sharp',
              afterSpice: 'Optimal Salt Level',
              stepInstructions: [
                'Peel raw potato and cut into 2-3 large thick chunks.',
                'Immerse potato chunks into the boiling gravy.',
                'Simmer on medium flame for 8-10 minutes so they absorb the brine.',
                'Discard or eat the cooked potato chunks, then stir in 2 tbsp hot water and a squeeze of fresh lemon.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: 15, protein: 0, carbs: 3, fat: 0, fiber: 0 }
            };
            break;

          case 'too_sour':
            recommendation = {
              title: 'Traditional Jaggery (Vellam) Neutralization & Dal Buffer',
              ingredientToAdd: 'Organic Powdered Jaggery (Paagu Vellam)',
              suggestedQuantity: Math.max(1, Math.round(1.5 * scale)),
              unit: 'tablespoons',
              reason: 'Caramelized molasses in unrefined jaggery counterbalances the harsh acidity of citric and tartaric acids, unlocking Tamil cuisine\'s signature "Arusuvai" balance.',
              expectedEffect: 'Smooths out acidic harshness into a rounded, appetizing, authentic temple-style tamarind profile.',
              beforeSpice: 'Sharply Sour',
              afterSpice: 'Tangy-Sweet Balanced',
              stepInstructions: [
                'Dissolve ' + Math.max(1, Math.round(1.5 * scale)) + ' tbsp powdered jaggery in 2 tbsp warm water.',
                'Pour into simmering gravy on medium heat.',
                'Simmer for 3 minutes until fully integrated.',
                'Optionally add 2 tbsp cooked plain dal if sourness persists.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: Math.round(60 * scale), protein: 0, carbs: 15, fat: 0, fiber: 0 }
            };
            break;

          case 'too_bland':
            recommendation = {
              title: 'Fresh Ghee Tadka Infusion & Roasted Spice Pop',
              ingredientToAdd: 'Ghee Tempering + Fresh Sambar/Kuzhambu Powder',
              suggestedQuantity: Math.max(1, Math.round(1 * scale)),
              unit: 'tbsp Ghee + 1 tsp Spices + 1/2 tsp Salt',
              reason: 'Blooming whole spices and aromatic curry leaves in bubbling pure ghee releases fat-soluble volatile flavor compounds (linalool, piperine, cuminaldehyde).',
              expectedEffect: 'Elevates flat dishes into restaurant-grade aromatic vibrancy with deep savory warmth.',
              beforeSpice: 'Flat / Bland',
              afterSpice: 'Aromatically Rich & Savory',
              stepInstructions: [
                'Heat 1 tbsp ghee in a small tadka pan.',
                'Add 1/2 tsp mustard seeds, 1/2 tsp cumin, 8 curry leaves, and 1 slit green chilli.',
                'Once mustard pops, add 1 tsp fresh spice blend and remove immediately from heat.',
                'Pour sizzling aromatic ghee directly into the pot and stir.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: Math.round(95 * scale), protein: 1, carbs: 2, fat: 10, fiber: 1 }
            };
            break;

          case 'too_watery':
            recommendation = {
              title: 'Velvety Roasted Rice / Gram Flour Slurry Reduction',
              ingredientToAdd: 'Rice Flour (or Roasted Gram Pottukadalai Powder)',
              suggestedQuantity: Math.max(1, Math.round(1.5 * scale)),
              unit: 'tablespoons',
              reason: 'Starch granules in rice flour gelatinize rapidly at 75°C, trapping liquid water molecules into a smooth, glossy, rich gravy suspension.',
              expectedEffect: 'Transforms thin watery broth into a rich, spoon-coating sauce in under 4 minutes.',
              beforeSpice: 'Runny & Thin',
              afterSpice: 'Glossy & Thick Gravy',
              stepInstructions: [
                'Mix ' + Math.max(1, Math.round(1.5 * scale)) + ' tbsp rice flour with 3 tbsp room-temperature water into a lump-free slurry.',
                'Bring watery dish to a bubbling simmer.',
                'Pour slurry in a slow steady stream while stirring continuously.',
                'Boil for 2-3 minutes until thickened to your desired consistency.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: Math.round(55 * scale), protein: 1, carbs: 12, fat: 0, fiber: 1 }
            };
            break;

          case 'too_thick':
            recommendation = {
              title: 'Gradual Boiling Water / Thin Coconut Milk Restoration',
              ingredientToAdd: 'Hot Boiled Water & Ghee Drizzle',
              suggestedQuantity: Number((0.75 * scale).toFixed(1)),
              unit: 'cups boiled water',
              reason: 'Adding boiling water (never cold!) preserves cooking temperature and prevents starch shock, returning overcooked lentils to velvety fluid suspension.',
              expectedEffect: 'Relieves dense sludginess and brings back fresh, pourable consistency.',
              beforeSpice: 'Stiff & Pastelike',
              afterSpice: 'Smooth & Pourable',
              stepInstructions: [
                'Bring ' + Number((0.75 * scale).toFixed(1)) + ' cups water to a boil in a separate kettle.',
                'Gradually stir hot water into the thick dish in 1/4 cup increments.',
                'Simmer on gentle flame for 2 minutes.',
                'Drizzle 1/2 tsp fresh ghee to restore surface sheen.'
              ],
              servingsAdjustment: Math.ceil(currentServings + (0.5 * scale)),
              nutritionDelta: { calories: 20, protein: 0, carbs: 0, fat: 2, fiber: 0 }
            };
            break;

          case 'too_bitter':
            recommendation = {
              title: 'Jaggery-Tamarind Equilibrium & Caramelized Shallots',
              ingredientToAdd: 'Jaggery + Sautéed Shallots',
              suggestedQuantity: Math.max(1, Math.round(1 * scale)),
              unit: 'tbsp Jaggery + 6 Sliced Shallots',
              reason: 'Natural allium sugars in caramelizing shallots and sweetness of jaggery block bitter alkaloid sensation on taste buds.',
              expectedEffect: 'Suppresses harsh bitterness from burnt spices and restores comforting savoriness.',
              beforeSpice: 'Astringent & Bitter',
              afterSpice: 'Rich, Balanced & Sweet-Spicy',
              stepInstructions: [
                'Sauté 6 thinly sliced shallots in 1 tsp oil until deep golden caramelized.',
                'Dissolve 1 tbsp jaggery in 2 tbsp warm water.',
                'Add both caramelized shallots and jaggery syrup into the dish.',
                'Stir and simmer for 3 minutes.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: Math.round(75 * scale), protein: 1, carbs: 16, fat: 2, fiber: 1 }
            };
            break;

          case 'too_rich':
            recommendation = {
              title: 'Fresh Citrus Lift & Crisp Herb Balancing',
              ingredientToAdd: 'Fresh Lemon Juice & Chopped Coriander / Mint',
              suggestedQuantity: Math.max(1.5, Number((1.5 * scale).toFixed(1))),
              unit: 'tablespoons lemon juice',
              reason: 'Citric acid emulsifies and cuts through lipophilic surface grease, cleansing the palate and imparting a refreshing lightness.',
              expectedEffect: 'Cuts heavy greasy mouthfeel, reviving vibrant herbaceous freshness.',
              beforeSpice: 'Heavy & Oily',
              afterSpice: 'Zesty, Clean & Refreshing',
              stepInstructions: [
                'Turn off the heat.',
                'Squeeze ' + Math.max(1.5, Number((1.5 * scale).toFixed(1))) + ' tbsp fresh lemon juice directly into the warm dish.',
                'Fold in 1/2 cup finely chopped fresh coriander leaves.',
                'Do not boil after adding lemon to avoid bitterness.'
              ],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: 15, protein: 0, carbs: 3, fat: 0, fiber: 1 }
            };
            break;

          default:
            recommendation = {
              title: 'General Seasoning & Fresh Herb Balance',
              ingredientToAdd: 'Lemon Juice & Coriander',
              suggestedQuantity: 1,
              unit: 'tablespoon',
              reason: 'Acid and fresh herbs restore harmony to unbalanced flavors.',
              expectedEffect: 'Fresh balanced taste.',
              beforeSpice: 'Off Balance',
              afterSpice: 'Balanced Flavor',
              stepInstructions: ['Stir in 1 tbsp lemon juice and fresh herbs.'],
              servingsAdjustment: currentServings,
              nutritionDelta: { calories: 10, protein: 0, carbs: 2, fat: 0, fiber: 0 }
            };
            break;
        }

        // Build Updated Recipe Object for seamless integration with other features
        var updatedRecipe = angular.copy(recipe);
        updatedRecipe.name = (recipe.name || 'Custom Meal') + ' (Rescued)';
        updatedRecipe.servings = recommendation.servingsAdjustment || currentServings;
        if (recommendation.afterSpice && recommendation.afterSpice.includes('Medium')) {
          updatedRecipe.spiceLevel = 2;
        }

        // Append rescue ingredient to ingredients list
        if (!updatedRecipe.ingredients) updatedRecipe.ingredients = [];
        var numQty = parseFloat(recommendation.suggestedQuantity) || 1;
        updatedRecipe.ingredients.push({
          name: recommendation.ingredientToAdd,
          quantity: numQty,
          unit: recommendation.unit,
          category: 'Taste Rescue Fix',
          isOptional: false
        });

        // Add rescue step to instructions
        if (!updatedRecipe.instructions) updatedRecipe.instructions = [];
        recommendation.stepInstructions.forEach(function(inst) {
          updatedRecipe.instructions.push({
            stepNumber: updatedRecipe.instructions.length + 1,
            instruction: 'Taste Rescue: ' + inst
          });
        });

        // Recalculate dynamic nutrition
        var baseNut = recipe.nutritionPerServing || { calories: 250, protein: 7, carbs: 35, fat: 8, fiber: 4 };
        var scaled = nutritionService.scaleNutrition(baseNut, recipe.servings || 4, updatedRecipe.servings);
        var totalNut = scaled.total;
        if (recommendation.nutritionDelta) {
          totalNut.calories += (recommendation.nutritionDelta.calories || 0);
          totalNut.protein = Number((totalNut.protein + (recommendation.nutritionDelta.protein || 0)).toFixed(1));
          totalNut.carbs = Number((totalNut.carbs + (recommendation.nutritionDelta.carbs || 0)).toFixed(1));
          totalNut.fat = Number((totalNut.fat + (recommendation.nutritionDelta.fat || 0)).toFixed(1));
          totalNut.fiber = Number((totalNut.fiber + (recommendation.nutritionDelta.fiber || 0)).toFixed(1));
        }

        var perServingNut = {
          calories: Math.round(totalNut.calories / updatedRecipe.servings),
          protein: Number((totalNut.protein / updatedRecipe.servings).toFixed(1)),
          carbs: Number((totalNut.carbs / updatedRecipe.servings).toFixed(1)),
          fat: Number((totalNut.fat / updatedRecipe.servings).toFixed(1)),
          fiber: Number((totalNut.fiber / updatedRecipe.servings).toFixed(1))
        };

        updatedRecipe.nutritionPerServing = perServingNut;

        return {
          problem: TASTE_PROBLEMS.find(function(p) { return p.id === problemId; }) || { name: problemId },
          recommendation: recommendation,
          currentServings: currentServings,
          updatedServings: updatedRecipe.servings,
          updatedRecipe: updatedRecipe,
          calculatedNutrition: {
            total: totalNut,
            perServing: perServingNut
          }
        };
      }
    };
  }]);
})();
