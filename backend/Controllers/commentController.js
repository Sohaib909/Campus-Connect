const User = require("./../Models/userModel");
const Post = require("./../Models/postModel");
const Comment = require("./../Models/commentModel");

exports.createComment = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Could not find the post",
      });
    }

    const comment = await Comment.create({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
      postId: post._id,
    });
    post.comments.push(comment._id);
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {
      new: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        comment: comment,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({
      createdAt: "desc",
    });
    if (!comments) {
      return res.status(404).json({
        status: "fail",
        message: "No comments found",
      });
    }
    res.status(200).json({
      status: "success",
      length: comments.length,
      data: {
        comments: comments,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addReply = async (req, res) => {
  try {
    const reply = {
      commentId: req.params.id,
      userId: req.user._id,
      userName: req.user.name,
      reply: req.body.reply,
    };

    const newComment = await Comment.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { replies: reply } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        newComment: newComment,
      },
    });
  } catch (err) {
    res.status(204).json({
      status: "fail",
      message: err.message,
    });
  }
};
