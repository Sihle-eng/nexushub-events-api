const express = require('express');
const Review = require('../models/Review');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

// GET reviews for an event (public)
router.get('/event/:eventId', async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'displayName avatar');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create review
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    if (!eventId || !rating) return res.status(400).json({ message: 'eventId and rating required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    const existing = await Review.findOne({ user: req.user._id, event: eventId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this event' });

    const review = new Review({ user: req.user._id, event: eventId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

// PUT update review
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your review' });
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5))
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

// DELETE review
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your review' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;