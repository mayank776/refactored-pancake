const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Types.ObjectId, required: true, refs: "Movie" },

    reviewedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      refs: "User",
    },

    rating: { type: Number, min: 1, max: 10, required: true },

    review: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
