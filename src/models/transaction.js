const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
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
  packageID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  donationID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = model('Transaction', transactionSchema);
