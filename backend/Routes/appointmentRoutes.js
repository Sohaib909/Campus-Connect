const express = require('express');
const appointmentController = require('./../Controllers/appointmentController.js');
const authController = require('./../Controllers/authController.js');


const router = express.Router();

router.get('/', authController.protect, appointmentController.getAllAppointments);
router.get('/teachersForAppointment', authController.protect, appointmentController.teachersForAppointment);
router.post('/', authController.protect, appointmentController.createAppointment);
router.get('/manageAppointments', authController.protect, appointmentController.manageAppointments);
router.post('/:id', authController.protect, appointmentController.changeAppointmentStatus);
router.get('/approvedAppointments', authController.protect, appointmentController.getApprovedAppointments);




module.exports = router;


