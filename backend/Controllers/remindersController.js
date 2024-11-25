const Reminder = require("./../Models/reminderModel");
const sendReminder = require("./../Utils/reminder");
const moment = require("moment-timezone");
const User = require("./../Models/userModel");

exports.getAllReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ createdBy: req.user._id });
    res.status(200).json({
      status: "success",
      length: reminders.length,
      data: {
        reminders: reminders,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addReminder = async (req, res, next) => {
  try {
    const isDaily = req.body.isDaily || false;
    const remindAt = moment
      .tz(req.body.remindAt, "MM-DD-YYYY HH:mm:ss", "Asia/Karachi")
      .toDate();
    if (!remindAt) {
      return res.status(400).json({
        status: "fail",
        message: "The Date/Time format is not valid",
      });
    }
    const reminder = await Reminder.create({
      roomNo: req.body.roomNo,
      reminderMsg: req.body.reminderMsg,
      remindAt: remindAt,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        reminder: reminder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      return res.status(404).json({
        status: "fail",
        message: "Reminder with the requested ID was not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: {
        reminder: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.editReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id });

    if (!reminder) {
      return res.status(404).json({
        status: "fail",
        message: "Reminder with this id does not exist",
      });
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      reminder._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        reminder: updatedReminder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.userReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({
      createdBy: req.user._id,
      isReminded: false,
    });
    res.status(200).json({
      status: "success",
      length: reminders.length,
      data: {
        reminders: reminders,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const lectureReminder = async () => {
  try {
    const reminders = await Reminder.find();
    if (!reminders) {
      console.error("No Reminders Found");
      return;
    }
    const now = moment.tz("Asia/Karachi");

    //console.log('Current Time (Asia/Karachi):', now.format('YYYY-MM-DD HH:mm:ss'));
    for (const reminder of reminders) {
      const remindAt = moment.tz(
        reminder.remindAt,
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
        "Asia/Karachi"
      );
      //console.log('Reminder Time:', remindAt ? moment(remindAt).format('YYYY-MM-DD HH:mm:ss') : 'Invalid Date');

      const remindAtMinus10Minutes = remindAt.clone().subtract(10, "minutes");

      if (
        !reminder.isRemindedBefore &&
        remindAt.isValid() &&
        now.isSameOrAfter(remindAtMinus10Minutes)
      ) {
        await Reminder.findByIdAndUpdate(reminder._id, {
          isRemindedBefore: true,
        });
        const user = await User.findById(reminder.createdBy._id);
        console.log(user);
        const recipient = user.phone;
        const msgBody = `Your Class of ${reminder.reminderMsg} will start after 10 minutes at Room No: ${reminder.roomNo}`;
        await sendReminder(recipient, msgBody);
      }

      if (
        !reminder.isReminded &&
        remindAt.isValid() &&
        now.isSameOrAfter(remindAt)
      ) {
        await Reminder.findByIdAndUpdate(reminder._id, { isReminded: true });
        const user = await User.findById(reminder.createdBy._id);
        console.log(user);
        const recipient = user.phone;
        const msgBody = `Your Class of ${reminder.reminderMsg} is about to start at Room No: ${reminder.roomNo}`;
        await sendReminder(recipient, msgBody);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

setInterval(lectureReminder, 5000);
