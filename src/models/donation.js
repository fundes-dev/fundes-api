const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
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
  package: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Package',
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

donationSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'donation',
});

module.exports = model('Donation', donationSchema);
