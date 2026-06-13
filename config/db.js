const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected to database:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error(err);
    // Do not exit the process when running tests
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;