const { Schema, model } = require('mongoose');

const packageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  npmID: {
    type: String,
    required: true,
  },
  homePage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maintainers: {
    type: [{
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    }],
    required: true,
  },
});

packageSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'package',
});

packageSchema.virtual('donations', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'package',
});

// packageSchema.virtual('supporters', {
//   ref: 'User',
//   localField: '_id',
//   foreignField: 'supporters',
// });


module.exports = model('Package', packageSchema);
