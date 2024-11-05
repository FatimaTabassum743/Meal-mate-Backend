const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

// GET route to fetch all recipes for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes', error });
  }
});

// GET route to fetch a recipe by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipe', error });
  }
});

// POST route to add a new recipe
router.post('/', authMiddleware, async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      image,
      userId: req.user.id
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create recipe', error });
  }
});

// PUT route to update a recipe by ID
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, ingredients, instructions, image },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe', error });
  }
});

// DELETE route to delete a recipe by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recipe', error });
  }
});

module.exports = router;
