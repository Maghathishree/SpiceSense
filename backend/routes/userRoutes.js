const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/favorites', protect, userController.toggleFavorite);
router.post('/history', protect, userController.addCookingHistory);

module.exports = router;
