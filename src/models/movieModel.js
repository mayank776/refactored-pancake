const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    genre: [
      {
        type: String,
        trim: true,
      },
    ],

    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refs: "User",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
