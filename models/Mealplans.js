const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { // Add this line to include meal type
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true,
  },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
