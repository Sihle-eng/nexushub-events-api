const express = require('express');
const Category = require('../models/Category');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');
const router = express.Router();

// GET all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Invalid ID' });
    res.status(500).json({ message: err.message });
  }
});

// POST create category (only organizer)
router.post('/', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

// PUT update category (only organizer)
router.put('/:id', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const { name, description } = req.body;
    if (name) category.name = name;
    if (description) category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate category name' });
    res.status(500).json({ message: err.message });
  }
});

// DELETE category (only organizer)
router.delete('/:id', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;