const express = require('express')
const commentController = require('./../Controllers/commentController')
const authController = require('./../Controllers/authController')


const router = express.Router()


router.post('/:id/createComment', authController.protect, commentController.createComment )
router.get('/:id/comments', authController.protect, commentController.getAllComments)
router.patch('/:id/reply',authController.protect, commentController.addReply)


module.exports = router
