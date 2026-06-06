const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Tech','Music','Business','Workshop','Social','Other'], default: 'Other' },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxAttendees: { type: Number, min: 1, required: true },
  currentAttendees: { type: Number, default: 0 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema, 'events');