const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  stripeToken: {
    type: String,
  },
  adminOf: {
    type: [String],
  },
  transactions: {
    type: [Schema.Types.ObjectId],
  },
  donations: {
    type: [Schema.Types.ObjectId],
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
  avatar: {
    type: Buffer,
  },
});

userSchema.pre('save', async function encryptPassword(next) {
  const user = this;

  if (user.isModified('password') || user.isNew) {
    const encryptedPassword = await bcrpyt.hash(user.password, 8);
    user.password = encryptedPassword;
  }

  next();
});

userSchema.methods.generateAuthToken = async function generateAuthToken() {
  const user = this;
  const userId = user._id.toString();

  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
  user.tokens = [...user.tokens, { token }];

  await user.save();
  return token;
};

userSchema.methods.comparePasswords = function comparePasswords(password) {
  const user = this;
  return bcrpyt.compare(password, user.password);
};

userSchema.methods.toJSON = function getPublicProfile() {
  const user = this;
  const publicUser = user.toObject();

  delete publicUser.password;
  delete publicUser.tokens;

  return publicUser;
};

module.exports = model('User', userSchema);
