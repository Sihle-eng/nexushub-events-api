const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  const regs = await Registration.find({ user: req.user._id }).populate('event');
  res.json(regs);
});

router.post('/', isLoggedIn, async (req, res) => {
  const { eventId } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.currentAttendees >= event.maxAttendees)
    return res.status(400).json({ message: 'Event is full' });
  
  const existing = await Registration.findOne({ user: req.user._id, event: eventId });
  if (existing) return res.status(400).json({ message: 'Already registered' });

  const registration = new Registration({ user: req.user._id, event: eventId });
  await registration.save();
  event.currentAttendees += 1;
  await event.save();
  res.status(201).json(registration);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const reg = await Registration.findById(req.params.id);
  if (!reg) return res.status(404).json({ message: 'Not found' });
  if (reg.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your registration' });
  
  const event = await Event.findById(reg.event);
  event.currentAttendees -= 1;
  await event.save();
  await reg.deleteOne();
  res.json({ message: 'Cancelled' });
});

module.exports = router;