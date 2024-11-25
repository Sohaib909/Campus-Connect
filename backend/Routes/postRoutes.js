const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const authController = require('../Controllers/authController.js');
const postController = require('../Controllers/postController.js');


router.post('/:id/posts', authController.protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), postController.createPost);

router.get('/:id/posts', authController.protect, postController.getPosts);

module.exports = router;
