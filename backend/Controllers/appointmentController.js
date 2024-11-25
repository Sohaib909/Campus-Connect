const Appointment = require("./../Models/appointmentModel.js");
const User = require("./../Models/userModel.js");
const Notification = require('../Models/notificationModel.js');
const moment = require("moment-timezone");


exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdBy: req.user._id });

    res.status(200).json({
      status: "success",
      legnth: appointments.length,
      data: {
        appointments: appointments,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.teachersForAppointment = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
    if (!teachers) {
      return res.status(400).json({
        status: "fail",
        message: "No teacher could be found"
      })
    }
    res.status(200).json({
      status: "success",
      length: teachers.length,
      data: {
        teachers: teachers
      }
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    })
  }


}



exports.createAppointment = async (req, res) => {
  try {
    const date = moment(req.body.date, "MM-DD-YYYY").toISOString();
    const time = moment(req.body.time, "HH:mm").format("HH:mm");
    const teacherUser = await User.findOne({ name: req.body.teacherName });

    if (!teacherUser) {
      return res.status(400).json({
        status: "fail",
        message: "Teacher not found.",
      });
    }

    const existingAppointment = await Appointment.findOne({
      createdFor: teacherUser._id,
      date: date,
      time: {
        $gte: moment(time, "HH:mm").subtract(1, "hours").format("HH:mm"),
        $lte: moment(time, "HH:ss").add(1, "hours").format("HH:ss"),
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: "fail",
        message: "This slot has already been booked.",
      });
    }
    const appointment = await Appointment.create({
      teacherName: req.body.teacherName,
      reason: req.body.reason,
      status: "pending",
      createdBy: req.user._id,
      date: date,
      time: time,
    });
    console.log(appointment);
    const studentUser = await User.findById(appointment.createdBy);
    console.log(studentUser);

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointment._id,
      {
        createdFor: teacherUser._id,
        teacherInfo: teacherUser,
        studentInfo: studentUser,
      }
    );


    const notificationMessage = `${studentUser.name} has sent you an appointment request`;

    const notification = new Notification({
      type: 'New Appointment Request',
      message: notificationMessage,
      recipient: teacherUser._id,
      onClickPath: '/manageAppointments',
    });

    await notification.save();


    teacherUser.unseenNotifications.push(notification);
    await teacherUser.save();

    const studentNotificationMessage = `Your appointment request has been sent to ${teacherUser.name}`;

    const studentNotification = new Notification({
      type: 'Appointment Request Sent',
      message: studentNotificationMessage,
      recipient: studentUser._id,
      onClickPath: '/manageAppointments',
    });

    await studentNotification.save();

    studentUser.unseenNotifications.push(studentNotification);
    await studentUser.save();


    return res.status(201).json({
      status: 'success',
      message: 'Your appointment request has been sent to the teacher',
      data: {
        updatedAppointment: appointment,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};



exports.manageAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdFor: req.user._id })
    if (!appointments) {
      return res.status(404).json({
        status: "fail",
        message: "No Appointments could be found for this user"
      })
    }
    res.status(200).json({
      status: "success",
      length: appointments.length,
      data: {
        appointments: appointments
      }
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    })
  }

}

exports.changeAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatusValues = ['approved', 'rejected'];
    if (!validStatusValues.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }

    const studentUser = await User.findById(appointment.createdBy);
    if (!studentUser) {
      return res.status(404).json({
        status: "fail",
        message: "Student could not be found",
      });
    }

    const notificationMessage = `Your appointment request has been ${status === "approved" ? "approved" : "rejected"} by ${appointment.teacherInfo.name}`;

    const studentNotification = new Notification({
      type: "Appointment Status Changed",
      message: notificationMessage,
      recipient: studentUser._id,
      onClickPath: '/manageAppointments',
    });

    await studentNotification.save();

    studentUser.unseenNotifications.push(studentNotification);
    await studentUser.save();

    res.status(200).json({
      status: "success",
      message: `Appointment has been ${status === "approved" ? "approved" : "rejected"} successfully.`,
      data: {
        appointment: appointment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getApprovedAppointments = async (req, res) => {
  try {
    const teacherUser = await User.findOne({ _id: req.user._id });


    if (teacherUser.role !== 'teacher') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource.',
      });
    }


    const approvedAppointments = await Appointment.find({
      createdFor: teacherUser._id,
      status: 'approved',
    });

    res.status(200).json({
      status: 'success',
      length: approvedAppointments.length,
      data: {
        appointments: approvedAppointments,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};


