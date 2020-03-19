const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  recurrence: {
    type: String,
    enum: ['once', 'weekly', 'monthly'],
    default: 'once',
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
  transactionIDs: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  packageID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

module.exports = model('Donation', donationSchema);
