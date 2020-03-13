const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrpyt = require('bcryptjs');

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
    type: [String],
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

  try {
    if (user.isModified('password') || user.isNew) {
      const encrpytedPassword = await bcrpyt.hash(user.password, 10);
      user.password = encrpytedPassword;
    }

    next();
  } catch (ex) {
    next(ex);
  }
});

userSchema.methods.comparePasswords = function comparePasswords(password) {
  const user = this;
  return bcrpyt.compare(password, user.password);
};

module.exports = model('User', userSchema);
