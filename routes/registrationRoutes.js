const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

// GET all registrations for logged-in user
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST register for event
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ message: 'eventId required' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check capacity
    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check duplicate registration
    const existing = await Registration.findOne({ user: req.user._id, event: eventId });
    if (existing) return res.status(400).json({ message: 'Already registered' });

    const registration = new Registration({ user: req.user._id, event: eventId });
    await registration.save();

    // Increment attendee count
    event.currentAttendees += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate registration' });
    res.status(500).json({ message: err.message });
  }
});

// PUT update registration status (confirmed/cancelled)
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your registration' });

    const { status } = req.body;
    if (status && !['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status must be confirmed or cancelled' });
    }
    registration.status = status || registration.status;
    await registration.save();

    // If cancelling, decrement event attendee count
    if (status === 'cancelled' && registration.status === 'cancelled') {
      const event = await Event.findById(registration.event);
      if (event) {
        event.currentAttendees = Math.max(0, event.currentAttendees - 1);
        await event.save();
      }
    }

    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE cancel registration
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your registration' });

    const event = await Event.findById(registration.event);
    if (event) {
      event.currentAttendees = Math.max(0, event.currentAttendees - 1);
      await event.save();
    }

    await registration.deleteOne();
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;