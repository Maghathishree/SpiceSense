const mongoose = require('mongoose');

const leftoverSchema = new mongoose.Schema({
  leftoverItem: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Tiffin', 'Rice', 'Curry/Sambar', 'Bread/Parotta', 'Cooked Veggies'],
    default: 'Tiffin'
  },
  suggestedRecipes: [{
    recipeName: String,
    category: String,
    requiredAdditionalIngredients: [String],
    cookingTimeMinutes: Number,
    difficulty: String,
    calories: Number,
    isSufficientWithPantry: Boolean,
    transformationSteps: [String],
    paatiSecret: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Leftover', leftoverSchema);
