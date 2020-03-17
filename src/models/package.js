const { Schema, model } = require('mongoose');

const nodePackageSchema = new Schema({
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
  transactions: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  donations: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});

module.exports = model('package', nodePackageSchema);
