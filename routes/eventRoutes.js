const express = require('express');
const Event = require('../models/Event');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');
const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'displayName email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'displayName email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create event
router.post('/', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizer: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT update event
router.put('/:id', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your event' });
    Object.assign(event, req.body);
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE event
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your event' });
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;