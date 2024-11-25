const mongoose = require('mongoose');
const User = require('./userModel.js');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false, // Default to unread
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
});


const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
