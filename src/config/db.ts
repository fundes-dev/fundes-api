import * as mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit processs with failure
    process.exit(1);
  }
};

export default connectDB;
