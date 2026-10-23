const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, shoppingController.getShoppingList);
router.post('/add', protect, shoppingController.addIngredientsToList);
router.put('/toggle/:itemId', protect, shoppingController.togglePurchased);
router.delete('/', protect, shoppingController.clearList);

module.exports = router;
