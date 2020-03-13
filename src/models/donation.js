const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  user: {
    type: [String],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Amount must be a positive number');
      }
    },
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
  },
  recurrence: {
    enum: ['once', 'weekly', 'monthly'],
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
