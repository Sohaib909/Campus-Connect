const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },
    societyInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },
    likes: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    media: [String],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
