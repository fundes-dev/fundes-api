const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fundesFee: {
    type: Number,
    required: true,
  },
  stripeFee: {
    type: Number,
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Package',
  },
  donation: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Donation',
  },
});

module.exports = model('Transaction', transactionSchema);
