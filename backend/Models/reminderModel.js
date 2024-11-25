const mongoose = require("mongoose");
const User = require("./userModel");

const reminderSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  roomNo: {
    type: String,
    required: [true, "Please set your room number for the lecture"],
  },
  reminderMsg: {
    type: String,
    required: [true, "Please write a reminder msg"],
  },
  remindAt: {
    type: String,
    required: [true, "Please select date and time for the reminder"],
  },
  isReminded: {
    type: Boolean,
    default: false,
  },
  isRemindedBefore: {
    type: Boolean,
    default: false,
  },
  isDaily: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
