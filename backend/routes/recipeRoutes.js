const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public listing & search routes
router.get('/', recipeController.getAllRecipes);
router.get('/community', recipeController.getCommunityRecipes);
router.get('/budget', recipeController.getBudgetRecipes);
router.post('/search-ingredients', recipeController.searchByAvailableIngredients);

// Authenticated user recipe routes
router.get('/my', requireAuth, recipeController.getMyRecipes);
router.post('/', requireAuth, recipeController.createRecipe);
router.put('/:id', requireAuth, recipeController.updateRecipe);
router.delete('/:id', requireAuth, recipeController.deleteRecipe);

// Single recipe by ID
router.get('/:id', recipeController.getRecipeById);

module.exports = router;
