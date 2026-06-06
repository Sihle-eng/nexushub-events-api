require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected');
    console.log('Event collection name:', Event.collection.name);
    const count = await Event.countDocuments();
    console.log('Event count:', count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();