const express = require('express')
const newsController = require('./../Controllers/newsController.js')
const authController = require('./../Controllers/authController.js')

const router = express.Router()


router.get('/', authController.protect, newsController.getAllNews)
router.get('/Allposts', authController.protect, newsController.getAllPosts);


module.exports = router