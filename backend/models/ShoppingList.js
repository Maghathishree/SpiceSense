const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest'
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, default: 'General' },
    isPurchased: { type: Boolean, default: false },
    addedFromRecipe: { type: String, default: '' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
