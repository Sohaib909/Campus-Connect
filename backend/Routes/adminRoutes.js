const express = require("express");
const adminController = require("./../Controllers/adminController.js");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const router = express.Router();

router.get("/getAllStudents", adminController.getAllStudents);
router.patch("/updateStudent/:id", adminController.updateStudent);
router.get("/manageStudentsCount", adminController.getAllStudentsCount);
router.delete("/deleteStudent/:id", adminController.deleteStudent);
router.get("/getOneStudent/:searchTerm", adminController.getOneStudent);
router.post("/addStudent", upload.single("image"), adminController.addStudent);

router.get("/getAllTeachers", adminController.getAllTeachers);
router.get("/getOneTeacher/:searchTerm", adminController.getOneTeacher);
router.post("/addTeacher", upload.single("image"), adminController.addTeacher);
router.patch("/updateTeacher/:id", adminController.updateTeacher);
router.delete("/deleteTeacher/:id", adminController.deleteTeacher);
router.get("/manageTeachersCount", adminController.getAllTeachersCount);

router.patch("/updateSociety/:id", adminController.updateSociety);
// router.get('/manageSocieties', authController.protect, societyController.manageSocieties);
router.get("/manageSocietiesCount", adminController.getAllSocietiesCount);
router.get("/getAllSocieties", adminController.getAllSocieties);
router.delete("/deleteSociety/:id", adminController.deleteSociety);
router.get("/getOneSociety/:searchTerm", adminController.getOneSociety);

module.exports = router;
