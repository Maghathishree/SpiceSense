const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tamilName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Sweets', 'Fusion', 'Regional']
  },
  region: {
    type: String,
    required: true,
    enum: ['Chettinad', 'Madurai', 'Tirunelveli', 'Kongu Nadu', 'Thanjavur', 'Chennai', 'Coimbatore', 'Nagercoil', 'All Tamil Nadu']
  },
  isTraditional: {
    type: Boolean,
    default: true
  },
  classification: {
    type: String,
    enum: ['Traditional', 'Modern', 'Fusion'],
    default: 'Traditional'
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
    required: true
  },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, default: 'General' },
    isOptional: { type: Boolean, default: false }
  }],
  instructions: [{
    stepNumber: Number,
    instruction: String
  }],
  prepTimeMinutes: { type: Number, required: true, default: 15 },
  cookTimeMinutes: { type: Number, required: true, default: 20 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  servings: { type: Number, default: 4 },
  estimatedCostINR: { type: Number, default: 100 },
  spiceLevel: { type: Number, min: 1, max: 4, default: 2 }, // 1: Mild, 2: Medium, 3: Spicy, 4: Extra Spicy
  nutritionPerServing: {
    calories: { type: Number, default: 280 },
    protein: { type: Number, default: 8 }, // grams
    carbs: { type: Number, default: 42 }, // grams
    fat: { type: Number, default: 8 }, // grams
    fiber: { type: Number, default: 4 } // grams
  },
  dietaryTags: [{ type: String }], // 'Vegetarian', 'Vegan', 'High-Protein', 'Gluten-Free'
  requiredEquipment: [{ type: String }],
  paatiTip: { type: String },
  modernVariation: { type: String },
  substitutions: [{
    originalIngredient: String,
    substituteIngredient: String,
    quantityRatio: String,
    tasteImpact: String,
    whenToAdd: String
  }],
  image: { type: String, default: 'assets/recipes/community-placeholder.jpg' },
  imageUrl: { type: String, default: 'assets/recipes/community-placeholder.jpg' },
  ratings: {
    average: { type: Number, default: 4.8 },
    count: { type: Number, default: 1 }
  },
  // User Recipe Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isUserCreated: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure image and imageUrl are synchronized
recipeSchema.pre('save', function(next) {
  if (this.image && (!this.imageUrl || this.imageUrl === 'assets/images/madurai_idli_sambar_1789921252646.png')) {
    this.imageUrl = this.image;
  } else if (this.imageUrl && (!this.image || this.image === 'assets/images/madurai_idli_sambar_1789921252646.png')) {
    this.image = this.imageUrl;
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);
