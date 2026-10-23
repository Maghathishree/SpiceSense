const Recipe = require('../models/Recipe');

// Helper to sanitize and validate input
const isValidString = (str) => typeof str === 'string' && str.trim().length > 0;

// Reliable recipe image resolver by dish name
function resolveRecipeImage(name, providedImage) {
  if (isValidString(providedImage) && !providedImage.includes('madurai_idli_sambar_1789921252646.png')) {
    return providedImage.trim();
  }
  const lower = (name || '').toLowerCase();
  if (lower.includes('ellu') || lower.includes('sesame')) return 'assets/recipes/ellu-sadam.jpg';
  if (lower.includes('poondu') || lower.includes('garlic')) return 'assets/recipes/poondu-kuzhambu.jpg';
  if (lower.includes('idiyappam') || lower.includes('string hopper')) return 'assets/recipes/idiyappam.jpg';
  if (lower.includes('idli upma')) return 'assets/recipes/idli-upma.jpg';
  if (lower.includes('idli')) return 'assets/recipes/idli.jpg';
  if (lower.includes('rava dosa')) return 'assets/recipes/rava-dosa.jpg';
  if (lower.includes('millet dosa') || lower.includes('dosa wrap')) return 'assets/recipes/millet-dosa-wrap.jpg';
  if (lower.includes('dosa')) return 'assets/recipes/dosa.jpg';
  if (lower.includes('sakkarai pongal') || lower.includes('sweet pongal')) return 'assets/recipes/sakkarai-pongal.jpg';
  if (lower.includes('pongal')) return 'assets/recipes/pongal.jpg';
  if (lower.includes('paniyaram')) return 'assets/recipes/paniyaram.jpg';
  if (lower.includes('chapati kothu')) return 'assets/recipes/chapati-kothu.jpg';
  if (lower.includes('kothu')) return 'assets/recipes/kothu-parotta.jpg';
  if (lower.includes('sodhi')) return 'assets/recipes/tirunelveli-sodhi.jpg';
  if (lower.includes('vatha')) return 'assets/recipes/vatha-kuzhambu.jpg';
  if (lower.includes('arisi paruppu')) return 'assets/recipes/arisi-paruppu-sadam.jpg';
  if (lower.includes('keerai') || lower.includes('kootu')) return 'assets/recipes/keerai-kootu.jpg';
  if (lower.includes('sukka')) return 'assets/recipes/chettinad-sukka.jpg';
  if (lower.includes('pasta')) return 'assets/recipes/chettinad-pasta.jpg';
  if (lower.includes('sambar rice')) return 'assets/recipes/sambar-rice.jpg';
  if (lower.includes('sambar')) return 'assets/recipes/sambar.jpg';
  if (lower.includes('rasam')) return 'assets/recipes/rasam.jpg';
  if (lower.includes('nagercoil')) return 'assets/recipes/nagercoil-kuzhambu.jpg';
  return 'assets/recipes/community-placeholder.jpg';
}

// Get all recipes with multi-filter & search support
exports.getAllRecipes = async (req, res) => {
  try {
    const { category, region, mealType, isTraditional, classification, spiceLevel, diet, search, sortBy, communityOnly } = req.query;

    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (region && region !== 'All') filter.region = region;
    if (mealType && mealType !== 'All') filter.mealType = mealType;
    if (classification && classification !== 'All') filter.classification = classification;
    if (isTraditional !== undefined && isTraditional !== 'All') filter.isTraditional = isTraditional === 'true';
    if (spiceLevel && spiceLevel !== 'All') filter.spiceLevel = Number(spiceLevel);
    if (diet && diet !== 'All') filter.dietaryTags = { $in: [diet] };
    if (communityOnly === 'true') filter.isUserCreated = true;

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tamilName: { $regex: search.trim(), $options: 'i' } },
        { 'ingredients.name': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    let query = Recipe.find(filter).populate('createdBy', 'username');

    // Sorting
    if (sortBy === 'time') {
      query = query.sort({ cookTimeMinutes: 1 });
    } else if (sortBy === 'calories') {
      query = query.sort({ 'nutritionPerServing.calories': 1 });
    } else if (sortBy === 'cost') {
      query = query.sort({ estimatedCostINR: 1 });
    } else if (sortBy === 'rating') {
      query = query.sort({ 'ratings.average': -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const recipes = await query.exec();
    return res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recipes' });
  }
};

// Get single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    return res.json({ success: true, recipe });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Invalid recipe ID or server error' });
  }
};

// Get Community Recipes (User created)
exports.getCommunityRecipes = async (req, res) => {
  try {
    const { category, region, mealType, classification, spiceLevel, search, sortBy } = req.query;

    let filter = { isUserCreated: true };

    if (category && category !== 'All') filter.category = category;
    if (region && region !== 'All') filter.region = region;
    if (mealType && mealType !== 'All') filter.mealType = mealType;
    if (classification && classification !== 'All') filter.classification = classification;
    if (spiceLevel && spiceLevel !== 'All') filter.spiceLevel = Number(spiceLevel);

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { 'ingredients.name': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    let query = Recipe.find(filter).populate('createdBy', 'username');

    if (sortBy === 'time') {
      query = query.sort({ cookTimeMinutes: 1 });
    } else if (sortBy === 'rating') {
      query = query.sort({ 'ratings.average': -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const recipes = await query.exec();
    return res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    console.error('Error fetching community recipes:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve community recipes' });
  }
};

// Get recipes created by the authenticated user
exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipes = await Recipe.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve your recipes' });
  }
};

// Create a new recipe (Authenticated)
exports.createRecipe = async (req, res) => {
  try {
    const {
      name,
      tamilName,
      description,
      category,
      region,
      isTraditional,
      classification,
      mealType,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      difficulty,
      servings,
      estimatedCostINR,
      spiceLevel,
      nutritionPerServing,
      dietaryTags,
      requiredEquipment,
      paatiTip,
      modernVariation,
      substitutions,
      imageUrl,
      image
    } = req.body;

    // --- Validation ---
    if (!isValidString(name)) {
      return res.status(400).json({ success: false, message: 'Recipe name is required' });
    }

    if (!isValidString(description)) {
      return res.status(400).json({ success: false, message: 'Recipe description is required' });
    }

    if (!isValidString(category)) {
      return res.status(400).json({ success: false, message: 'Recipe category is required' });
    }

    if (!isValidString(region)) {
      return res.status(400).json({ success: false, message: 'Recipe region is required' });
    }

    if (!isValidString(mealType)) {
      return res.status(400).json({ success: false, message: 'Meal type is required' });
    }

    const parsedServings = Number(servings);
    if (isNaN(parsedServings) || parsedServings <= 0) {
      return res.status(400).json({ success: false, message: 'Servings must be a positive number greater than 0' });
    }

    const parsedPrepTime = Number(prepTimeMinutes);
    const parsedCookTime = Number(cookTimeMinutes);
    if (isNaN(parsedPrepTime) || parsedPrepTime < 0 || isNaN(parsedCookTime) || parsedCookTime < 0) {
      return res.status(400).json({ success: false, message: 'Preparation and cooking times must be valid numbers' });
    }

    // Validate Ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one ingredient is required' });
    }

    const cleanedIngredients = [];
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      if (!ing || !isValidString(ing.name)) {
        return res.status(400).json({ success: false, message: `Ingredient #${i + 1} must have a valid name` });
      }
      const qty = Number(ing.quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: `Ingredient "${ing.name}" must have a quantity greater than 0` });
      }
      cleanedIngredients.push({
        name: ing.name.trim(),
        quantity: qty,
        unit: isValidString(ing.unit) ? ing.unit.trim() : 'pcs',
        category: isValidString(ing.category) ? ing.category.trim() : 'General',
        isOptional: !!ing.isOptional
      });
    }

    // Validate Instructions
    if (!Array.isArray(instructions) || instructions.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one cooking instruction step is required' });
    }

    const cleanedInstructions = [];
    for (let i = 0; i < instructions.length; i++) {
      const step = instructions[i];
      const stepText = typeof step === 'string' ? step.trim() : (step && step.instruction ? step.instruction.trim() : '');
      if (!stepText) {
        return res.status(400).json({ success: false, message: `Instruction step #${i + 1} cannot be empty` });
      }
      cleanedInstructions.push({
        stepNumber: i + 1,
        instruction: stepText
      });
    }

    // Classification fallback
    const resolvedClassification = classification || (isTraditional ? 'Traditional' : 'Modern');
    const resolvedIsTraditional = resolvedClassification === 'Traditional';

    // Safe nutrition defaults if not provided
    const safeNutrition = {
      calories: Number(nutritionPerServing?.calories) || Math.round(200 + cleanedIngredients.length * 30),
      protein: Number(nutritionPerServing?.protein) || Math.round(5 + cleanedIngredients.length * 1.5),
      carbs: Number(nutritionPerServing?.carbs) || Math.round(25 + cleanedIngredients.length * 4),
      fat: Number(nutritionPerServing?.fat) || Math.round(4 + cleanedIngredients.length * 1),
      fiber: Number(nutritionPerServing?.fiber) || Math.round(2 + cleanedIngredients.length * 0.8)
    };

    // NEVER trust createdBy from frontend body: ALWAYS use req.user.id
    const newRecipe = new Recipe({
      name: name.trim(),
      tamilName: tamilName ? tamilName.trim() : '',
      description: description.trim(),
      category: category.trim(),
      region: region.trim(),
      isTraditional: resolvedIsTraditional,
      classification: resolvedClassification,
      mealType: mealType.trim(),
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      prepTimeMinutes: parsedPrepTime,
      cookTimeMinutes: parsedCookTime,
      difficulty: difficulty || 'Medium',
      servings: parsedServings,
      estimatedCostINR: Number(estimatedCostINR) || Math.round(parsedServings * 25),
      spiceLevel: Number(spiceLevel) || 2,
      nutritionPerServing: safeNutrition,
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : ['Vegetarian'],
      requiredEquipment: Array.isArray(requiredEquipment) ? requiredEquipment : ['Standard Pan'],
      paatiTip: paatiTip ? paatiTip.trim() : '',
      modernVariation: modernVariation ? modernVariation.trim() : '',
      substitutions: Array.isArray(substitutions) ? substitutions : [],
      image: resolveRecipeImage(name, image || imageUrl),
      imageUrl: resolveRecipeImage(name, image || imageUrl),
      createdBy: req.user.id,
      isUserCreated: true
    });

    const savedRecipe = await newRecipe.save();
    return res.status(201).json({
      success: true,
      message: 'Recipe created successfully!',
      recipe: savedRecipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating recipe: ' + error.message });
  }
};

// Update an existing recipe (Only owner can edit)
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Ownership check: only owner can edit
    if (!recipe.createdBy || String(recipe.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit recipes you created' });
    }

    const {
      name,
      tamilName,
      description,
      category,
      region,
      isTraditional,
      classification,
      mealType,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      difficulty,
      servings,
      estimatedCostINR,
      spiceLevel,
      nutritionPerServing,
      dietaryTags,
      requiredEquipment,
      paatiTip,
      modernVariation,
      substitutions,
      imageUrl,
      image
    } = req.body;

    if (name) {
      if (!isValidString(name)) return res.status(400).json({ success: false, message: 'Recipe name cannot be empty' });
      recipe.name = name.trim();
    }
    if (tamilName !== undefined) recipe.tamilName = tamilName ? tamilName.trim() : '';
    if (description) recipe.description = description.trim();
    if (category) recipe.category = category;
    if (region) recipe.region = region;
    if (classification) {
      recipe.classification = classification;
      recipe.isTraditional = classification === 'Traditional';
    } else if (isTraditional !== undefined) {
      recipe.isTraditional = isTraditional;
    }
    if (mealType) recipe.mealType = mealType;

    if (servings !== undefined) {
      const s = Number(servings);
      if (isNaN(s) || s <= 0) return res.status(400).json({ success: false, message: 'Servings must be greater than 0' });
      recipe.servings = s;
    }

    if (prepTimeMinutes !== undefined) recipe.prepTimeMinutes = Number(prepTimeMinutes);
    if (cookTimeMinutes !== undefined) recipe.cookTimeMinutes = Number(cookTimeMinutes);
    if (difficulty) recipe.difficulty = difficulty;
    if (estimatedCostINR !== undefined) recipe.estimatedCostINR = Number(estimatedCostINR);
    if (spiceLevel !== undefined) recipe.spiceLevel = Number(spiceLevel);

    // Validate ingredients if passed
    if (ingredients !== undefined) {
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one ingredient is required' });
      }
      const cleaned = [];
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        if (!ing || !isValidString(ing.name)) {
          return res.status(400).json({ success: false, message: `Ingredient #${i + 1} must have a valid name` });
        }
        const qty = Number(ing.quantity);
        if (isNaN(qty) || qty <= 0) {
          return res.status(400).json({ success: false, message: `Ingredient "${ing.name}" must have a quantity greater than 0` });
        }
        cleaned.push({
          name: ing.name.trim(),
          quantity: qty,
          unit: ing.unit || 'pcs',
          category: ing.category || 'General',
          isOptional: !!ing.isOptional
        });
      }
      recipe.ingredients = cleaned;
    }

    // Validate instructions if passed
    if (instructions !== undefined) {
      if (!Array.isArray(instructions) || instructions.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one instruction step is required' });
      }
      const cleanedSteps = [];
      for (let i = 0; i < instructions.length; i++) {
        const step = instructions[i];
        const stepText = typeof step === 'string' ? step.trim() : (step && step.instruction ? step.instruction.trim() : '');
        if (!stepText) {
          return res.status(400).json({ success: false, message: `Instruction step #${i + 1} cannot be empty` });
        }
        cleanedSteps.push({ stepNumber: i + 1, instruction: stepText });
      }
      recipe.instructions = cleanedSteps;
    }

    if (nutritionPerServing) {
      recipe.nutritionPerServing = {
        calories: Number(nutritionPerServing.calories) || recipe.nutritionPerServing.calories,
        protein: Number(nutritionPerServing.protein) || recipe.nutritionPerServing.protein,
        carbs: Number(nutritionPerServing.carbs) || recipe.nutritionPerServing.carbs,
        fat: Number(nutritionPerServing.fat) || recipe.nutritionPerServing.fat,
        fiber: Number(nutritionPerServing.fiber) || recipe.nutritionPerServing.fiber
      };
    }

    if (dietaryTags) recipe.dietaryTags = dietaryTags;
    if (requiredEquipment) recipe.requiredEquipment = requiredEquipment;
    if (paatiTip !== undefined) recipe.paatiTip = paatiTip ? paatiTip.trim() : '';
    if (modernVariation !== undefined) recipe.modernVariation = modernVariation ? modernVariation.trim() : '';
    if (substitutions) recipe.substitutions = substitutions;
    if (image || imageUrl || (name && name !== recipe.name)) {
      const resolved = resolveRecipeImage(recipe.name, image || imageUrl || recipe.image || recipe.imageUrl);
      recipe.image = resolved;
      recipe.imageUrl = resolved;
    }

    const updated = await recipe.save();
    return res.json({ success: true, message: 'Recipe updated successfully', recipe: updated });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating recipe' });
  }
};

// Delete a recipe (Only owner can delete)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Ownership check: only owner can delete
    if (!recipe.createdBy || String(recipe.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete recipes you created' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({ success: false, message: 'Server error while deleting recipe' });
  }
};

// "What Can I Cook?" Ingredient matching engine
exports.searchByAvailableIngredients = async (req, res) => {
  try {
    const { availableIngredients } = req.body;

    if (!availableIngredients || !Array.isArray(availableIngredients) || availableIngredients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one available ingredient' });
    }

    const userIngsLower = availableIngredients.map(ing => ing.trim().toLowerCase());

    const allRecipes = await Recipe.find({}).populate('createdBy', 'username');

    const scoredRecipes = allRecipes.map(recipe => {
      const totalIngs = recipe.ingredients.length;
      let matchedIngs = [];
      let missingIngs = [];

      recipe.ingredients.forEach(ing => {
        const ingNameLower = ing.name.toLowerCase();
        const isMatched = userIngsLower.some(uIng => ingNameLower.includes(uIng) || uIng.includes(ingNameLower));

        if (isMatched) {
          matchedIngs.push(ing.name);
        } else {
          missingIngs.push(ing.name);
        }
      });

      const matchPercentage = Math.round((matchedIngs.length / (totalIngs || 1)) * 100);

      return {
        recipe,
        matchPercentage,
        matchedCount: matchedIngs.length,
        totalIngredients: totalIngs,
        matchedIngredients: matchedIngs,
        missingIngredients: missingIngs,
        isSufficient: missingIngs.length <= 2
      };
    });

    const filteredAndSorted = scoredRecipes
      .filter(item => item.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.json({
      success: true,
      userIngredients: availableIngredients,
      matchedCount: filteredAndSorted.length,
      results: filteredAndSorted
    });
  } catch (error) {
    console.error('Ingredient matching error:', error);
    return res.status(500).json({ success: false, message: 'Error performing ingredient search' });
  }
};

// Budget Mode solver
exports.getBudgetRecipes = async (req, res) => {
  try {
    const budget = Number(req.query.budget) || 100;
    const people = Number(req.query.people) || 2;

    const allRecipes = await Recipe.find({}).populate('createdBy', 'username');

    const budgetMatched = allRecipes.map(recipe => {
      const costPerPerson = Math.round(recipe.estimatedCostINR / (recipe.servings || 4));
      const totalCostForPeople = costPerPerson * people;
      const isWithinBudget = totalCostForPeople <= budget;

      return {
        recipe,
        totalCostForPeople,
        costPerPerson,
        isWithinBudget,
        savings: budget - totalCostForPeople
      };
    }).filter(item => item.isWithinBudget)
      .sort((a, b) => a.totalCostForPeople - b.totalCostForPeople);

    return res.json({
      success: true,
      budget,
      people,
      count: budgetMatched.length,
      results: budgetMatched
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Budget calculation failed' });
  }
};
