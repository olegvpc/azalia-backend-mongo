const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('number', cardSchema);
