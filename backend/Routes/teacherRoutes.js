const express = require("express");
const teachersController = require("../Controllers/teachersController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.get('/',authController.protect,authController.restrict('admin'), teachersController.getAllTeachers)
router.get('/:id',authController.protect,authController.restrict('admin'), teachersController.getOneTeacher)
router.post('/',authController.protect,authController.restrict('admin'), teachersController.addTeacher)
router.patch('/:id',authController.protect,authController.restrict('admin'), teachersController.updateTeacher)
router.delete('/:id',authController.protect,authController.restrict('admin'),teachersController.deleteTeacher)

module.exports = router;
