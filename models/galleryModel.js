const mongoose = require('mongoose');

const PictureSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Picture = mongoose.model('Picture', PictureSchema);

module.exports = Picture;
