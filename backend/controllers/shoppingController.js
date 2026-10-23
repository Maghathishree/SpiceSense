const ShoppingList = require('../models/ShoppingList');

// Helper function to normalize unit names
const normalizeUnit = (unit) => {
  if (!unit) return 'pcs';
  const u = unit.toLowerCase().trim();
  if (['piece', 'pieces', 'pcs', 'nos'].includes(u)) return 'pcs';
  if (['cup', 'cups'].includes(u)) return 'cups';
  if (['tbsp', 'tablespoon', 'tablespoons'].includes(u)) return 'tbsp';
  if (['tsp', 'teaspoon', 'teaspoons'].includes(u)) return 'tsp';
  if (['gram', 'grams', 'g'].includes(u)) return 'grams';
  if (['kg', 'kilogram'].includes(u)) return 'kg';
  return u;
};

// Get Shopping List for user
exports.getShoppingList = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    let list = await ShoppingList.findOne({ userId });

    if (!list) {
      list = await ShoppingList.create({ userId, items: [] });
    }

    return res.json({ success: true, count: list.items.length, items: list.items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch shopping list' });
  }
};

// Smart Add Items with Duplicate Aggregation
exports.addIngredientsToList = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    const { recipeName, ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'No ingredients provided to add' });
    }

    let list = await ShoppingList.findOne({ userId });
    if (!list) {
      list = new ShoppingList({ userId, items: [] });
    }

    // Combine duplicate ingredients intelligently
    ingredients.forEach(newItem => {
      const normName = newItem.name.trim();
      const normUnit = normalizeUnit(newItem.unit);
      const qty = Number(newItem.quantity) || 1;

      // Find existing item in list with matching name (case-insensitive)
      const existingIdx = list.items.findIndex(
        item => item.name.toLowerCase() === normName.toLowerCase() && normalizeUnit(item.unit) === normUnit
      );

      if (existingIdx !== -1) {
        // Aggregate quantity!
        list.items[existingIdx].quantity = Number((list.items[existingIdx].quantity + qty).toFixed(1));
        if (recipeName && !list.items[existingIdx].addedFromRecipe.includes(recipeName)) {
          list.items[existingIdx].addedFromRecipe += `, ${recipeName}`;
        }
      } else {
        // Push new aggregated item
        list.items.push({
          name: normName,
          quantity: qty,
          unit: normUnit,
          category: newItem.category || 'General',
          isPurchased: false,
          addedFromRecipe: recipeName || 'Custom'
        });
      }
    });

    await list.save();
    return res.json({ success: true, message: 'Ingredients added to shopping list!', items: list.items });
  } catch (error) {
    console.error('Shopping list add error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update shopping list' });
  }
};

// Toggle Purchased status
exports.togglePurchased = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    const { itemId } = req.params;

    const list = await ShoppingList.findOne({ userId });
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.isPurchased = !item.isPurchased;
    await list.save();

    return res.json({ success: true, items: list.items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating item status' });
  }
};

// Clear all items or remove specific item
exports.clearList = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest';
    const { itemId } = req.query;

    const list = await ShoppingList.findOne({ userId });
    if (!list) return res.json({ success: true, items: [] });

    if (itemId) {
      list.items.pull({ _id: itemId });
    } else {
      list.items = [];
    }

    await list.save();
    return res.json({ success: true, message: 'Shopping list updated', items: list.items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error clearing shopping list' });
  }
};
