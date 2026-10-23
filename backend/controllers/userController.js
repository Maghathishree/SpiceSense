const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Toggle Favorite Recipe
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    if (!recipeId) return res.status(400).json({ success: false, message: 'Recipe ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isFav = user.favorites.includes(recipeId);
    if (isFav) {
      user.favorites.pull(recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    return res.json({ success: true, isFavorite: !isFav, favorites: user.favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating favorites' });
  }
};

// Add Cooking History entry
exports.addCookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId, recipeName, servings, caloriesConsumed, notes } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.cookingHistory.push({
      recipe: recipeId,
      recipeName: recipeName || 'Tamil Recipe',
      servings: Number(servings) || 4,
      caloriesConsumed: Number(caloriesConsumed) || 300,
      notes: notes || ''
    });

    await user.save();
    return res.json({ success: true, message: 'Recipe added to cooking history!', cookingHistory: user.cookingHistory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error logging cooking history' });
  }
};
