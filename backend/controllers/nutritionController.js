const Recipe = require('../models/Recipe');

// Calculate dynamic nutrition based on custom serving size or ingredient adjustments
exports.calculateNutrition = async (req, res) => {
  try {
    const { recipeId, servings, customIngredients } = req.body;

    let baseRecipe = null;
    let baseServings = 4;
    let baseNutrition = { calories: 300, protein: 10, carbs: 45, fat: 8, fiber: 5 };

    if (recipeId) {
      baseRecipe = await Recipe.findById(recipeId);
      if (baseRecipe) {
        baseServings = baseRecipe.servings || 4;
        baseNutrition = baseRecipe.nutritionPerServing;
      }
    }

    const targetServings = Number(servings) || baseServings;
    const servingRatio = targetServings / baseServings;

    // Recalculate macro numbers based on serving ratio
    let totalCalories = Math.round(baseNutrition.calories * servingRatio);
    let totalProtein = Number((baseNutrition.protein * servingRatio).toFixed(1));
    let totalCarbs = Number((baseNutrition.carbs * servingRatio).toFixed(1));
    let totalFat = Number((baseNutrition.fat * servingRatio).toFixed(1));
    let totalFiber = Number((baseNutrition.fiber * servingRatio).toFixed(1));

    // Handle custom added/modified ingredients
    if (customIngredients && Array.isArray(customIngredients)) {
      customIngredients.forEach(item => {
        const factor = (item.quantityMultiplier || 1);
        totalCalories += Math.round((item.caloriesPerUnit || 20) * factor);
        totalProtein += Number(((item.proteinPerUnit || 0.5) * factor).toFixed(1));
        totalCarbs += Number(((item.carbsPerUnit || 3.0) * factor).toFixed(1));
        totalFat += Number(((item.fatPerUnit || 0.5) * factor).toFixed(1));
      });
    }

    return res.json({
      success: true,
      recipeName: baseRecipe ? baseRecipe.name : 'Custom Meal',
      servings: targetServings,
      baseServings,
      servingRatio,
      nutrition: {
        totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber
      },
      perServingNutrition: {
        calories: Math.round(totalCalories / targetServings),
        protein: Number((totalProtein / targetServings).toFixed(1)),
        carbs: Number((totalCarbs / targetServings).toFixed(1)),
        fat: Number((totalFat / targetServings).toFixed(1)),
        fiber: Number((totalFiber / targetServings).toFixed(1))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Nutrition calculation failed' });
  }
};
