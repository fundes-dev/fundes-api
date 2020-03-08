const mongoose = require("mongoose");

const localURI = "mongodb://localhost:27017/note-app";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || localURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit processs with failure
    process.exit(1);
  }
};

module.exports = connectDB;
