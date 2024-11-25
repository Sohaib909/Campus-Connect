const { Storage } = require('@google-cloud/storage');
const User = require('../Models/userModel.js');
const Society = require("./../Models/societyModel.js");
const sendEmail = require("../Utils/email");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");

const storage = new Storage({
  keyFilename: "E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json",
  projectId: "affable-radio-402918",
});

const bucketName = "userprofile-images";
const bucket = storage.bucket(bucketName);

const signToken = (id) => jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const handleErrorResponse = (res, status, message) => res.status(status).json({ status: "fail", message });

const handleSuccessResponse = (res, status, token, user) => res.status(status).json({ status: "success", token, data: { user } });

exports.signup = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword, countryCode, phoneNumber, department, specialization, qualifications, bio, timeSlots } = req.body;

    if (!name || !email || !role || !password || !confirmPassword || !countryCode || !phoneNumber) {
      return handleErrorResponse(res, 400, "Please provide all required fields.");
    }

    if (role !== 'admin' && role !== 'student' && role !== 'teacher') {
      return handleErrorResponse(res, 400, 'Invalid role. Role must be either "admin," "student," or "teacher".');
    }

    const userData = {
      name,
      email,
      role,
      password,
      confirmPassword,
      phone: `+${countryCode}${phoneNumber}`,
      countryCode,
      phoneNumber,
    };

    if (role === "student" && department) {
      userData.department = department;
    } else if (role === "teacher" && specialization && qualifications && bio && timeSlots) {
      userData.specialization = specialization;
      userData.qualifications = qualifications;
      userData.bio = bio;
      userData.timeSlots = timeSlots.split(", ");
    } else if (role === 'admin') {

    } else {
      return handleErrorResponse(res, 400, "Please provide all required details for the selected role.");
    }

    const user = new User(userData);

    const token = signToken(user._id);

    if (req.file && req.file.buffer) {
      const uploadedImage = req.file;
      const filename = `${Date.now()}-${uploadedImage.originalname}`;
      const file = bucket.file(filename);
      const stream = file.createWriteStream({ metadata: { contentType: uploadedImage.mimetype } });

      stream.on("error", (err) => handleErrorResponse(res, 500, "Error uploading image."));

      stream.on("finish", async () => {
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        user.photo = imageUrl;
        await user.save();
        handleSuccessResponse(res, 200, token, user);
      });

      stream.end(uploadedImage.buffer);
    } else {
      return handleErrorResponse(res, 400, "No image file provided.");
    }
  } catch (err) {
    console.error(err);
    handleErrorResponse(res, 400, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleErrorResponse(res, 400, 'Please provide both email and password.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      return handleErrorResponse(res, 400, 'Please enter the correct email or password.');
    }

    const token = signToken(user._id);

    handleSuccessResponse(res, 200, token, user);
  } catch (err) {
    console.error(err);
    handleErrorResponse(res, 404, err.message);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let tokenExists = req.headers.authorization;

    if (tokenExists && tokenExists.startsWith("Bearer")) {
      tokenExists = tokenExists.split(" ")[1];
    }
    if (!tokenExists) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const decodedToken = await util.promisify(jwt.verify)(tokenExists, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User does not exist with this token",
      });
    }

    const isPassChanged = await user.isPasswordChanged(decodedToken.iat);

    if (isPassChanged) {
      return res.status(401).json({
        status: "fail",
        message: "You have changed your password recently, please log in again",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};

exports.restrict = (...role) => (req, res, next) => {
  if (role.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      status: "fail",
      message: "You do not have permission to access this.",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with this email address",
      });
    }

    req.session = null;

    const resetToken = await user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `We have received your password reset request. Please click on the following link to reset your password:\n\n${resetUrl}\n\nThis link is valid for the next 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request Received",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset instructions sent to your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Unable to process your request at the moment. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Both password and confirmPassword are required",
      });
    }

    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    const loginToken = signToken(user._id);

    res.status(200).json({
      status: "success",
      token: loginToken,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.fetchUserRole = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user || !['admin', 'student', 'teacher'].includes(user.role)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user role",
      });
    }

    res.status(200).json({
      status: "success",
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch user role",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to fetch user profile',
    });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const countryCode = '92';
    const phoneNumber = req.body.phoneNumber;
    const formatPhoneNumber = `+${countryCode}${phoneNumber}`;

    const updatedUser = await User.findByIdAndUpdate(userId, { phone: formatPhoneNumber, phoneNumber: phoneNumber }, { new: true });

    res.status(200).json({
      status: 'success',
      data: {
        updatedUser: updatedUser,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to update phone number',
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const { newPassword } = req.body;
    user.password = newPassword;
    await user.save();


    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to update password',
    });
  }
};


exports.updateProfilePhoto = async (req, res) => {
  if (!req.user) {
    return handleErrorResponse(res, 401, 'User not authenticated.');
  }

  if (!req.file || !req.file.buffer) {
    return handleErrorResponse(res, 400, 'No image file provided.');
  }

  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return handleErrorResponse(res, 404, 'User not found');
  }

  const token = signToken(user._id);

  try {
    const uploadedImage = req.file;
    const filename = `${Date.now()}-${uploadedImage.originalname}`;
    const file = bucket.file(filename);
    const stream = file.createWriteStream({
      metadata: {
        contentType: uploadedImage.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error('Error uploading image:', err);
      return handleErrorResponse(res, 500, 'Error uploading image.');
    });

    stream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      const updatedUser = await User.findByIdAndUpdate(userId, { photo: imageUrl }, { new: true });
      handleSuccessResponse(res, 200, token, updatedUser);
    });

    stream.end(uploadedImage.buffer);
  } catch (error) {
    console.error('Image upload error:', error);
    return handleErrorResponse(res, 500, 'Error uploading image.');
  }
};

