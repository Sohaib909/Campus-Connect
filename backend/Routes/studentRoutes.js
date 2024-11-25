const express = require('express')
const studentsController = require('./../Controllers/studentsController')
const authController = require('./../Controllers/authController')


const router = express.Router()

router.get('/',authController.protect,authController.restrict('admin'), studentsController.getAllStudents)
router.get('/:id',authController.protect,authController.restrict('admin'), studentsController.getOneStudent)
router.post('/',authController.protect,authController.restrict('admin'), studentsController.addStudent)
router.patch('/:id',authController.protect,authController.restrict('admin'), studentsController.updateStudent)
router.delete('/:id',authController.protect,authController.restrict('admin'),studentsController.deleteStudent)

    
module.exports = router;