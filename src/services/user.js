const User = require('../models/user');

const createUser = async ({
  email, password, firstName, lastName,
}) => {
  const newUser = new User({
    email,
    password,
    firstName,
    lastName,
    donations: [],
    transactions: [],
  });
  const user = await newUser.save();
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const findUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
};

const updateUserById = async (_id, body = {}) => {
  const user = await User.findOneAndUpdate(_id, body, { new: true, runValidators: true });
  return user;
};

module.exports = {
  createUser, findUserByEmail, findUserById, updateUserById,
};
