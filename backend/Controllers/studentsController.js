const User = require("./../Models/userModel");

exports.getAllStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "student" });

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "student") {
      return res.status(404).json({
        status: "fail",
        message: "Student with the given ID was not found.",
      });
    }
    res.status(200).json({
      status: "success",
      length: user.length,
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    console.log(user);

    if (!user || user.role !== "student") {
      return res.status(404).json({
        status: "fail",
        message: "Student with this id does not exist",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(updatedUser);

    res.status(200).json({
      status: "success",
      data: {
        student: updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addStudent = async (req, res) => {
  try {
    if (req.body.role !== "student") {
      return res.status(400).json({
        status: "fail",
        message: "You can only add a Student.",
      });
    }
    const countryCode = req.body.countryCode;
    const phoneNumber = req.body.phoneNumber;

    const formatPhoneNumber = `+${countryCode}${phoneNumber}`;
    console.log(formatPhoneNumber);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      phone: formatPhoneNumber,
      countryCode: req.body.countryCode,
      phoneNumber: req.body.phoneNumber,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user || user.role !== "student") {
      return res.status(404).json({
        status: "fail",
        message: "You can only delete a student",
      });
    }

    const deletedUser = await User.findByIdAndDelete(user._id);
    res.status(204).json({
      status: "success",
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
