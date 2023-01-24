const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      minlength: 2,
      maxlength: 150,
      required: true,
    },
    author: {
      type: String,
      minlength: 2,
      maxlength: 30,
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

module.exports = mongoose.model('message', cardSchema);
