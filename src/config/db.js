const mongoose = require('mongoose');


const localURI = process.env.DB_ENV === 'local' ? 'mongodb://localhost:27017/fundes' : process.env.MONGO_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(localURI, {
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
