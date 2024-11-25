const { Storage } = require("@google-cloud/storage");
const Post = require("./../Models/postModel.js");
const User = require("./../Models/userModel.js");
const Society = require("./../Models/societyModel.js");
const multer = require("multer");

const storage = new Storage({
  keyFilename: "E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json",
  projectId: "affable-radio-402918",
});

const bucketName = "society_posts";
const bucket = storage.bucket(bucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi)$/)) {
      return cb(
        new Error(
          "Please upload an image or video file (jpg, jpeg, png, gif, mp4, mov, avi)."
        )
      );
    }
    cb(null, true);
  },
}).single("media");

exports.createPost = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      }

      const society = await Society.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user._id });

      if (!society) {
        return res.status(404).json({
          status: "fail",
          message: "Society doesn't exist",
        });
      }

      if (society.createdBy.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          status: "fail",
          message:
            "You do not have permission to create a post in this society.",
        });
      }

      const post = await handleMediaUpload(req, society, user);
      res.status(200).json({
        status: "success",
        data: {
          post: post,
        },
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

async function handleMediaUpload(req, society, user) {
  return new Promise((resolve, reject) => {
    const postData = {
      title: req.body.title,
      description: req.body.description,
      userId: req.user._id,
      societyId: req.params.id,
      societyInfo: society,
      userInfo: user,
    };

    if (req.file && req.file.buffer) {
      const uploadedMedia = req.file;
      const filename = `${Date.now()}-${uploadedMedia.originalname}`;

      const file = bucket.file(filename);
      const stream = file.createWriteStream({
        metadata: {
          contentType: uploadedMedia.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error("Error uploading media:", err);
        reject(new Error("Error uploading media."));
      });

      stream.on("finish", async () => {
        const mediaUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        postData.media = mediaUrl;
        const post = await Post.create(postData);
        resolve(post);
      });

      stream.end(uploadedMedia.buffer);
    } else {
      const post = Post.create(postData);
      resolve(post);
    }
  });
}

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ societyId: req.params.id });

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

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Could not find post",
      });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      alreadyLiked
        ? { $pull: { likes: req.user._id } }
        : { $push: { likes: req.user._id } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: alreadyLiked
        ? "Post Unliked Successfully"
        : "Post Liked Successfully",
      data: {
        post: updatedPost,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
