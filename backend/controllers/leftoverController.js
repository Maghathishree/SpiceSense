const Leftover = require('../models/Leftover');
const Recipe = require('../models/Recipe');

// Get all Leftover Lab options
exports.getLeftoverOptions = async (req, res) => {
  try {
    const leftovers = await Leftover.find({});
    return res.json({ success: true, leftovers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch leftover options' });
  }
};

// Match Leftover Transformation Flow (includes Official & Community Recipes)
exports.matchLeftover = async (req, res) => {
  try {
    const { leftoverItem, extraAvailableIngredients } = req.body;

    if (!leftoverItem) {
      return res.status(400).json({ success: false, message: 'Please select or enter a leftover food item' });
    }

    const leftoverRecord = await Leftover.findOne({
      leftoverItem: { $regex: new RegExp(leftoverItem, 'i') }
    });

    const userPantry = (extraAvailableIngredients || []).map(i => i.toLowerCase().trim());
    const leftoverItemLower = leftoverItem.toLowerCase().trim();

    let processedSuggestions = [];

    // 1. Process Official Leftover Record Suggestions
    if (leftoverRecord && leftoverRecord.suggestedRecipes) {
      processedSuggestions = leftoverRecord.suggestedRecipes.map(recipe => {
        const required = recipe.requiredAdditionalIngredients || [];
        let missing = [];
        let matched = [];

        required.forEach(reqIng => {
          const reqLower = reqIng.toLowerCase();
          const found = userPantry.some(p => p.includes(reqLower) || reqLower.includes(p));
          if (found) {
            matched.push(reqIng);
          } else {
            missing.push(reqIng);
          }
        });

        const isSufficient = missing.length <= 1;

        return {
          ...recipe.toObject(),
          sourceType: 'Official Recipe',
          matchedExtraIngredients: matched,
          missingIngredients: missing,
          isSufficientWithPantry: isSufficient,
          matchPercentage: Math.round((matched.length / (required.length || 1)) * 100)
        };
      });
    } else {
      // Dynamic fallback for custom leftover names
      processedSuggestions = [
        {
          recipeName: `${leftoverItem} Stir-Fry Upma`,
          category: "Quick Snack",
          sourceType: 'Official Recipe',
          requiredAdditionalIngredients: ["Onion", "Mustard Seeds", "Curry Leaves", "Chillies"],
          cookingTimeMinutes: 10,
          difficulty: "Easy",
          calories: 220,
          isSufficientWithPantry: true,
          transformationSteps: [
            `Shred or dice the leftover ${leftoverItem} into uniform bite-sized pieces.`,
            "Heat oil in a wok and splutter mustard seeds, curry leaves, and green chillies.",
            "Add finely chopped onions and sauté until translucent.",
            `Toss in the chopped ${leftoverItem}, sprinkle salt and turmeric, cover and steam for 3 minutes.`
          ],
          paatiSecret: "Sprinkle lemon juice and fresh coriander at the end for vibrant flavor.",
          matchedExtraIngredients: userPantry.filter(p => ["onion", "mustard seeds", "curry leaves", "chillies"].some(r => r.includes(p))),
          missingIngredients: ["Onion", "Mustard Seeds", "Curry Leaves"].filter(r => !userPantry.some(p => r.toLowerCase().includes(p))),
          matchPercentage: 75
        }
      ];
    }

    // 2. Search Community Recipes matching leftover item or pantry
    try {
      // Look for user-created recipes that mention leftoverItem (e.g., idli, sambar, rice, chapati) or match ingredients
      const communityRecipes = await Recipe.find({
        isUserCreated: true,
        $or: [
          { name: { $regex: leftoverItemLower.replace(/leftover\s*/i, ''), $options: 'i' } },
          { description: { $regex: leftoverItemLower.replace(/leftover\s*/i, ''), $options: 'i' } },
          { 'ingredients.name': { $regex: leftoverItemLower.replace(/leftover\s*/i, ''), $options: 'i' } }
        ]
      }).populate('createdBy', 'username');

      communityRecipes.forEach(cRecipe => {
        const ingNames = cRecipe.ingredients.map(i => i.name);
        let matched = [];
        let missing = [];

        ingNames.forEach(name => {
          const lower = name.toLowerCase();
          if (userPantry.some(p => lower.includes(p) || p.includes(lower)) || lower.includes(leftoverItemLower.replace(/leftover\s*/i, ''))) {
            matched.push(name);
          } else {
            missing.push(name);
          }
        });

        const matchPct = Math.round((matched.length / (ingNames.length || 1)) * 100);

        processedSuggestions.push({
          _id: cRecipe._id,
          recipeName: cRecipe.name,
          category: cRecipe.category + ' (Community)',
          sourceType: 'Community Recipe',
          creatorName: cRecipe.createdBy?.username || 'Community Chef',
          cookingTimeMinutes: cRecipe.cookTimeMinutes,
          difficulty: cRecipe.difficulty,
          calories: cRecipe.nutritionPerServing?.calories || 280,
          requiredAdditionalIngredients: ingNames,
          matchedExtraIngredients: matched,
          missingIngredients: missing,
          isSufficientWithPantry: missing.length <= 2,
          matchPercentage: matchPct,
          transformationSteps: cRecipe.instructions.map(inst => inst.instruction),
          paatiSecret: cRecipe.paatiTip || 'Shared with love by ' + (cRecipe.createdBy?.username || 'a community chef') + '!'
        });
      });
    } catch (commErr) {
      console.error('Community recipe search in Leftover Lab error:', commErr);
    }

    return res.json({
      success: true,
      leftoverItem: leftoverRecord ? leftoverRecord.leftoverItem : leftoverItem,
      category: leftoverRecord ? leftoverRecord.category : 'Custom',
      matchedCount: processedSuggestions.length,
      suggestions: processedSuggestions
    });
  } catch (error) {
    console.error('Leftover matching error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing Leftover Lab' });
  }
};
