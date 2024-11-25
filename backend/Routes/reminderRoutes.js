const express = require('express')
const reminderController = require('./../Controllers/remindersController')
const authController = require('./../Controllers/authController')



const router = express.Router()

router.use(authController.protect)

router.get('/all', reminderController.getAllReminders)
router.post('/add', reminderController.addReminder)
router.delete('/:id', reminderController.deleteReminder)
router.patch('/:id', reminderController.editReminder)
router.get('/user', reminderController.userReminders)


module.exports = router;