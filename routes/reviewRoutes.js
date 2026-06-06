const express = require('express');
const Review = require('../models/Review');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/event/:eventId', async (req, res) => {
  const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'displayName avatar');
  res.json(reviews);
});

router.post('/', isLoggedIn, async (req, res) => {
  const { eventId, rating, comment } = req.body;
  const existing = await Review.findOne({ user: req.user._id, event: eventId });
  if (existing) return res.status(400).json({ message: 'Already reviewed' });
  const review = new Review({ user: req.user._id, event: eventId, rating, comment });
  await review.save();
  res.status(201).json(review);
});

router.put('/:id', isLoggedIn, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Not found' });
  if (review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your review' });
  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  await review.save();
  res.json(review);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Not found' });
  if (review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your review' });
  await review.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;