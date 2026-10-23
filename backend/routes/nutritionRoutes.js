const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

router.post('/calculate', nutritionController.calculateNutrition);

module.exports = router;
