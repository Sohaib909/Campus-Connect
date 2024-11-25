const Notification = require("../Models/notificationModel.js");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id });

    res.status(200).json({
      status: "success",
      length: notifications.length,
      data: {
        notifications: notifications,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const updatedNotifications = await Notification.updateMany(
      { _id: { $in: notificationIds }, recipient: req.user._id },
      { $set: { read: true } }
    );

    res.status(200).json({
      status: "success",
      message: "Notifications marked as read",
      data: {
        updatedNotifications: updatedNotifications,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    await Notification.findByIdAndRemove(notificationId);

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
