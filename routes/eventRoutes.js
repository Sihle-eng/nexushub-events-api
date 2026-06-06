const express = require('express');
const Event = require('../models/Event');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find().populate('organizer', 'displayName email');
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'displayName email');
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
});

router.post('/', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', isLoggedIn, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (event.organizer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your event' });
  Object.assign(event, req.body);
  await event.save();
  res.json(event);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (event.organizer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your event' });
  await event.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;