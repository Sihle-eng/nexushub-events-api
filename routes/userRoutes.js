const express = require('express');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().select('-googleId');
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-googleId');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/:id', isLoggedIn, async (req, res) => {
  if (req.params.id !== req.user._id.toString())
    return res.status(403).json({ message: 'Can only edit own profile' });
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-googleId');
  res.json(user);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  if (req.params.id !== req.user._id.toString())
    return res.status(403).json({ message: 'Can only delete own account' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;