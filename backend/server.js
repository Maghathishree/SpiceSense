const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/leftovers', require('./routes/leftoverRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/shopping-list', require('./routes/shoppingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Fallback route for AngularJS SPA client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SpiceSense Server Running on Port http://localhost:${PORT}`);
  console.log(`🌾 Smart South Indian Recipe & Nutrition Assistant`);
  console.log(`=======================================================`);
});

module.exports = app;
