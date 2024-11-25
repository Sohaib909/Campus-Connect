const mongoose = require("mongoose");
const Post = require("./postModel");
const User = require("./userModel");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    userName: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Please write a comment"],
    },

    replies: [
      {
        commentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        reply: {
          type: String,
          required: [true, "please write a reply"],
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },

        likes: [
          {
            type: String,
          },
        ],
      },
    ],
    likes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
