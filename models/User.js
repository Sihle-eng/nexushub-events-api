const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['user','organizer'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');