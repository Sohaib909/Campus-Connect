const User = require("../Models/userModel.js");

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.status(200).json({
      status: "success",
      data: teachers,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
