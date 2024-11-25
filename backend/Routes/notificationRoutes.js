const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController.js");
const notificationController = require("./../Controllers/notificationController.js");

router.get("/", authController.protect, notificationController.getNotifications);
router.patch("/markAsRead", authController.protect, notificationController.markNotificationsAsRead);
router.delete("/:id", authController.protect, notificationController.deleteNotification);



module.exports = router;
