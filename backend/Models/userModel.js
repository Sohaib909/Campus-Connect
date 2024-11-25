const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please choose a valid email address"],
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["admin", "student", "teacher"],
    default: "student",
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [5, "Password must be at least 5 characters long"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password does not match",
    },
  },
  countryCode: {
    type: String,
    required: [true, "Please select the country code"],
    select: false,
  },
  phoneNumber: {
    type: String,
    maxLength: 10,
    minLength: 10,
    required: [true, "Please provide a phone number"],
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
  },
  seenNotifications: {
    type: Array,
    default: [],
  },
  unseenNotifications: {
    type: Array,
    default: [],
  },
  specialization: {
    type: String,
  },
  qualifications: {
    type: Array,
    default: undefined,
  },
  bio: {
    type: String,
    maxLength: 50,
  },
  timeSlots: {
    type: Array,
    default: undefined,
  },
  department: {
    type: String,
  },

  joinedSocieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Soceity",
    },
  ],

  passwordChangedAt: Date,
  passwordResetToken: String,

  passwordResetTokenExpires: {
    type: Date,
    default: Date.now() + 1 * 24 * 60 * 60 * 1000,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePasswordInDb = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isPasswordChanged = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < passwordChangedTimestamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
