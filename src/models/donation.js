const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  user: {
    type: [String],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date,
  },
  transactions: {
    type: [String],
    required: true,
  },
  packageId: {
    type: String,
  },
});

module.exports = model('Donation', donationSchema);