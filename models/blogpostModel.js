const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add the title"],
    },
    description: {
      type: String,
      required: [true, "Please add the description"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blogpost", blogSchema);
