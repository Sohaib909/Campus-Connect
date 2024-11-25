const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const authController = require('../Controllers/authController.js');
const userController = require('../Controllers/userController.js');

router.post('/signup', upload.single('photo'), authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/profile', authController.protect, authController.getUserProfile);
router.get('/teachers', userController.getTeachers);
router.get('/fetchRole', authController.protect, authController.fetchUserRole);
router.patch('/updateProfilePhoto', authController.protect, upload.single('photo'), authController.updateProfilePhoto);
router.patch('/updatePhoneNumber', authController.protect, authController.updatePhoneNumber);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.get('/currentUser', authController.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});


module.exports = router;
