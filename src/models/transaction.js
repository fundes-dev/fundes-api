const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  user: {
    type: [String],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  project: {
    type: [String],
    required: true,
  },
  fundesFee: {
    type: Number,
  },
  stripeFee: {
    type: Number,
  },
});

module.exports = model('Transaction', transactionSchema);