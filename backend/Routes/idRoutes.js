const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const authController = require('../Controllers/authController.js');
const idController = require('../Controllers/idController.js');



router.get('/:id', authController.protect, idController.getSocietyById);




module.exports = router;