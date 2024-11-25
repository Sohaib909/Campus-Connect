const { Storage } = require("@google-cloud/storage");
const Society = require("./../Models/societyModel.js");
const User = require("./../Models/userModel.js");
const Notification = require("./../Models/notificationModel.js");
const multer = require("multer");


exports.getSocietyById = async (req, res) => {
    try {
      const society = await Society.findById(req.params.id);
  
      if (!society) {
        return res.status(404).json({
          status: 'fail',
          message: 'Society not found',
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          society,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message,
      });
    }
  };