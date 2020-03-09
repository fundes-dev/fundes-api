const mongoose = require('mongoose');

const localURI = 'mongodb://localhost:27017/fundes';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || localURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    // eslint-disable-next-line no-console
    console.log('MongoDB Connected...');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    // Exit processs with failure
    process.exit(1);
  }
};

module.exports = connectDB;
