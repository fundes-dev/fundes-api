const User = require('../models/user');

exports.createUser = async ({ email, password }) => {
  try {
    const newUser = new User({
      email,
      password,
    });
    const user = await newUser.save();
    return user;
  } catch (ex) {
    throw ex;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (ex) {
    throw ex;
  }
}