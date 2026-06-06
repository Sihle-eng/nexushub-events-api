require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to:', mongoose.connection.db.databaseName);
    console.log('Event model collection name:', Event.collection.name);
    const count = await Event.countDocuments();
    console.log('Number of events:', count);
    process.exit(0);
  })
  .catch(err => console.error(err));