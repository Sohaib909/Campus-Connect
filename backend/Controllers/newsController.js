const Post = require("./../Models/postModel.js");
const Society = require("./../Models/societyModel.js");

exports.getAllNews = async (req, res) => {
  try {
    const news = await Post.find();
    console.log(news);
    if (!news) {
      return res.status(404).json({
        status: "fail",
        message: "No News Found",
      });
    }
    res.status(200).json({
      status: "success",
      length: news.length,
      data: {
        news: news,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("societyInfo", "name logo")
      .populate("userInfo", "username profileImage");

    if (!posts) {
      return res.status(404).json({
        status: "fail",
        message: "No Posts exist",
      });
    }

    res.status(200).json({
      status: "success",
      length: posts.length,
      data: {
        posts: posts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
