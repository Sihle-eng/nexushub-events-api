const express = require('express');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-googleId');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString())
      return res.status(403).json({ message: 'Can only edit own profile' });
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-googleId');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString())
      return res.status(403).json({ message: 'Can only delete own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;