const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const Recipe = require('../../backend/models/Recipe');
const Leftover = require('../../backend/models/Leftover');
const User = require('../../backend/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spicesense';

const leftoversSeedData = [
  {
    leftoverItem: "Leftover Idli",
    category: "Tiffin",
    suggestedRecipes: [
      {
        recipeName: "Idli Upma",
        category: "Breakfast / Snack",
        requiredAdditionalIngredients: ["Onion", "Green Chillies", "Mustard Seeds", "Curry Leaves", "Turmeric Powder"],
        cookingTimeMinutes: 8,
        difficulty: "Easy",
        calories: 210,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Crumble cold leftover idlis evenly using hands.",
          "Temper mustard seeds, chana dal, curry leaves, and sliced chillies in oil.",
          "Add chopped onions and turmeric; sauté until soft.",
          "Toss crumbled idli, sprinkle water, steam for 2 minutes with lemon juice."
        ],
        paatiSecret: "Sprinkle 1 tsp Idli Milagai Podi while tossing for spiced gunpowder flavor."
      },
      {
        recipeName: "Chili Idli Fry",
        category: "Indo-Chinese Fusion",
        requiredAdditionalIngredients: ["Capsicum", "Onion", "Soy Sauce", "Chilli Sauce", "Garlic"],
        cookingTimeMinutes: 12,
        difficulty: "Medium",
        calories: 260,
        isSufficientWithPantry: false,
        transformationSteps: [
          "Cut cold idlis into bite-sized cubes.",
          "Shallow fry idli cubes in oil until outer crust is golden and crisp.",
          "In a wok, toss garlic, onions, bell peppers, soy sauce, and chilli sauce on high heat.",
          "Toss fried idlis into sauce and garnish with spring onions."
        ],
        paatiSecret: "Dust idli cubes with cornflour before frying for extra crunchiness."
      },
      {
        recipeName: "Masala Idli Bowl",
        category: "Snacks",
        requiredAdditionalIngredients: ["Tomato", "Onion", "Garam Masala", "Coriander Leaves", "Butter"],
        cookingTimeMinutes: 10,
        difficulty: "Easy",
        calories: 230,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Cube leftover idlis into small squares.",
          "Melt butter in a pan, sauté onions and tomato puree with pav bhaji masala or garam masala.",
          "Add idli cubes and toss until coated in rich tangy masala.",
          "Garnish with coriander and lemon juice."
        ],
        paatiSecret: "Use melted ghee instead of butter for Southern aroma."
      }
    ]
  },
  {
    leftoverItem: "Leftover Sambar",
    category: "Curry/Sambar",
    suggestedRecipes: [
      {
        recipeName: "Sambar Rice (Bisibelebath style)",
        category: "Lunch",
        requiredAdditionalIngredients: ["Cooked Rice", "Ghee", "Cashews", "Curry Leaves"],
        cookingTimeMinutes: 10,
        difficulty: "Easy",
        calories: 330,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Mix 1 cup cooked rice into 1.5 cups leftover sambar in a saucepan.",
          "Add 2 tbsp water or tamarind extract if thick and bring to a gentle boil.",
          "Temper mustard seeds, cashews, and curry leaves in hot ghee.",
          "Pour ghee tempering into sambar rice and mix thoroughly."
        ],
        paatiSecret: "A pinch of roasted cumin-coriander powder brings fresh life to day-old sambar."
      },
      {
        recipeName: "Sambar Vada Bowl",
        category: "Snack",
        requiredAdditionalIngredients: ["Medu Vada / Frozen Vada", "Onion", "Coriander"],
        cookingTimeMinutes: 8,
        difficulty: "Easy",
        calories: 290,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Reheat leftover sambar until steaming hot.",
          "Soak crisp medu vadas into hot sambar for 5 minutes.",
          "Top with raw chopped shallots, coriander, and ghee."
        ],
        paatiSecret: "Pierce vadas lightly with a fork so they soak up the sambar quickly."
      }
    ]
  },
  {
    leftoverItem: "Leftover Rasam",
    category: "Curry/Sambar",
    suggestedRecipes: [
      {
        recipeName: "Rasam Sadam (Comforting Rasam Rice)",
        category: "Lunch",
        requiredAdditionalIngredients: ["Cooked Rice", "Ghee", "Mustard Seeds", "Curry Leaves"],
        cookingTimeMinutes: 5,
        difficulty: "Easy",
        calories: 240,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Reheat leftover rasam in a saucepan.",
          "Mash soft cooked rice and pour boiling rasam over it.",
          "Mix well until mushy and temper with ghee and mustard seeds.",
          "Serve warm with potato fry or appalam."
        ],
        paatiSecret: "Add a spoonful of fresh ghee and crushed black pepper for instant immunity boost."
      },
      {
        recipeName: "Rasam Soup with Roasted Garlic Croutons",
        category: "Appetizer / Soup",
        requiredAdditionalIngredients: ["Garlic", "Bread Slices / Croutons", "Butter"],
        cookingTimeMinutes: 7,
        difficulty: "Easy",
        calories: 180,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Strain clear leftover rasam broth and bring to boil.",
          "Toast bread cubes in garlic butter until crispy croutons.",
          "Serve piping hot rasam broth in a mug garnished with croutons and fresh cilantro."
        ],
        paatiSecret: "Add a squeeze of fresh lemon juice just before drinking."
      }
    ]
  },
  {
    leftoverItem: "Leftover Chapati",
    category: "Bread/Parotta",
    suggestedRecipes: [
      {
        recipeName: "Chapati Kothu",
        category: "Snack / Dinner",
        requiredAdditionalIngredients: ["Onion", "Tomato", "Eggs or Paneer", "Capsicum", "Garam Masala"],
        cookingTimeMinutes: 10,
        difficulty: "Easy",
        calories: 310,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Shred chapatis into thin ribbon strips.",
          "Sauté onions, chillies, tomatoes, and garam masala in oil.",
          "Scramble eggs or paneer into vegetables.",
          "Add chapati ribbons, toss on high heat with a splash of water for 3 mins."
        ],
        paatiSecret: "Toss with 2 tbsp leftover curry gravy for moist flavor."
      }
    ]
  },
  {
    leftoverItem: "Leftover Cooked Rice",
    category: "Rice",
    suggestedRecipes: [
      {
        recipeName: "Tempered Lemon Rice (Elumichai Sadam)",
        category: "Lunch",
        requiredAdditionalIngredients: ["Lemon Juice", "Turmeric", "Mustard Seeds", "Peanuts", "Green Chillies"],
        cookingTimeMinutes: 8,
        difficulty: "Easy",
        calories: 270,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Fluff leftover cooked rice gently to separate grains.",
          "Heat sesame oil, roast peanuts, chana dal, mustard seeds, green chillies, curry leaves, and turmeric.",
          "Mix tempered spices into rice with salt.",
          "Turn off heat and stir in fresh lemon juice."
        ],
        paatiSecret: "Never add lemon juice to hot boiling oil as it creates bitter taste."
      },
      {
        recipeName: "Curd Rice (Thayir Sadam)",
        category: "Lunch",
        requiredAdditionalIngredients: ["Fresh Curd", "Milk", "Mustard Seeds", "Pomegranate / Grapes", "Ginger"],
        cookingTimeMinutes: 5,
        difficulty: "Easy",
        calories: 220,
        isSufficientWithPantry: true,
        transformationSteps: [
          "Mash leftover rice slightly with warm milk.",
          "Mix fresh curd, grated ginger, and salt into rice.",
          "Temper mustard seeds, urad dal, and curry leaves in oil and pour over curd rice.",
          "Garnish with pomegranate seeds."
        ],
        paatiSecret: "Mixing a dash of milk keeps curd rice sweet without souring even after hours."
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await Recipe.deleteMany({});
    await Leftover.deleteMany({});

    // Read recipes JSON
    const recipesFilePath = path.join(__dirname, 'recipesData.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));

    const insertedRecipes = await Recipe.insertMany(recipesData);
    console.log(`Successfully seeded ${insertedRecipes.length} Tamil Nadu recipes!`);

    const insertedLeftovers = await Leftover.insertMany(leftoversSeedData);
    console.log(`Successfully seeded ${insertedLeftovers.length} Leftover Lab mappings!`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error Seeding Database:', err);
    process.exit(1);
  }
}

seedDatabase();
