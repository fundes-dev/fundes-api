const { Schema, model } = require('mongoose');

const packageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  npmLink: {
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
    type: [String],
    required: true,
  },
  transactions: {
    type: [String],
  },
});

module.exports = model('Package', packageSchema);
