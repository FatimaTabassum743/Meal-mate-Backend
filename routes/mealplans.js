const express = require('express');
const router = express.Router();
const MealPlan = require('../models/mealPlans');
const authMiddleware = require('../middleware/authMiddleware');

// GET /meal-plans - Fetch meal plans for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.id }).populate('recipe');
    res.json(mealPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching meal plans.' });
  }
});

// POST /meal-plans - Create meal plans for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { meals } = req.body; // Expecting an array of meal objects

    // Validate that at least one meal is selected
    if (!meals || meals.length === 0 || !meals.some(meal => meal.recipe)) {
      return res.status(400).json({ message: 'At least one meal must be selected.' });
    }

    const userId = req.user.id; // Get the user ID from the authenticated request

    // Create meal plans including meal type
    const mealPlans = meals.map(meal => ({
      day: new Date(), // You can customize this to a specific day if needed
      recipe: meal.recipe, // This should be the recipe ID
      userId: userId,
      type: meal.type, // Include the meal type (breakfast, lunch, dinner)
    }));

    // Save the meal plans to the database
    await MealPlan.insertMany(mealPlans);

    return res.status(201).json({ message: 'Meal plans created successfully!', mealPlans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error saving meal plans.' });
  }
});

module.exports = router;
