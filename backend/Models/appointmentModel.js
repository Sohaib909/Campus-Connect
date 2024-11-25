const mongoose = require("mongoose");
const User = require("./userModel");

const appointmentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  createdFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  teacherInfo: {
    type: Object,
  },
  studentInfo: {
    type: Object,
  },
  teacherName: {
    type: String,
    required: [true, "Please select the teacher to book an appointment"],
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: [
      true,
      "Please select the appropriate time to book an appointment",
    ],
  },
  reason: {
    type: String,
    required: [true, "Please specify the reason for your appointment"],
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
