const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  cookingHistory: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    recipeName: String,
    cookedAt: { type: Date, default: Date.now },
    servings: Number,
    caloriesConsumed: Number,
    notes: String
  }],
  preferences: {
    spicePreference: { type: String, default: 'Medium' },
    dietaryPreference: { type: String, default: 'All' },
    budgetLimit: { type: Number, default: 200 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
