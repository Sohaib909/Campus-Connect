const mongoose = require("mongoose");
const User = require("./userModel.js");

const societySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  createdFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  userInfo: {
    type: Object,
  },
  adminInfo: {
    type: Object,
  },
  name: {
    type: String,
    required: [true, "Please provide a Name for the Society"],
    unique: true,
  },
  logo: {
    type: String,
  },
  banner: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Please provide a short description for your society"],
    maxLength: [
      300,
      "The length of description should not exceed 300 characters.",
    ],
  },
  societyByLaws: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  joinRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
});

societySchema.statics.approveOrRejectSociety = async function (id, status) {
  const Society = this;
  if (status !== "approved" && status !== "rejected") {
    throw new Error("Invalid status value");
  }

  const society = await Society.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!society) {
    throw new Error("Society not found");
  }

  const user = await User.findById(society.createdBy);

  if (!user) {
    throw new Error("User could not be found");
  }

  user.unseenNotifications.push({
    type: "Society status changed",
    message: `Your society request has been ${status}`,
  });

  await User.findByIdAndUpdate(user._id, {
    unseenNotifications: user.unseenNotifications,
  });

  return society;
};

const Society = mongoose.model("Society", societySchema);

module.exports = Society;
