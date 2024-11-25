const { Storage } = require('@google-cloud/storage');
const User = require("./../Models/userModel.js");
const Society = require("./../Models/societyModel.js");


const storage = new Storage({
  keyFilename: "E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json",
  projectId: "affable-radio-402918",
});

const bucketName = "userprofile-images";
const bucket = storage.bucket(bucketName);



exports.getAllStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "student" });

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getOneStudent = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
      ],
      role: 'student',
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No students found with the given search term.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user || user.role !== 'student') {
      return res.status(404).json({
        status: "fail",
        message: "Student with this id does not exist",
      });
    }

    const allowedFields = ['name', 'email', 'department', 'phone'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      data: {
        student: updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      countryCode,
      phoneNumber,
      department,
    } = req.body;


    if (!name || !email || !password || !confirmPassword || !countryCode || !phoneNumber || !department) {
      return handleErrorResponse(res, 400, 'Please provide all required fields.');
    }
    const userData = {
      name,
      email,
      role,
      password,
      confirmPassword,
      phone: `+${countryCode}${phoneNumber}`,
      countryCode,
      phoneNumber,
      department,
    };

    const user = new User(userData);

    if (req.file && req.file.buffer) {
      const uploadedImage = req.file;
      const filename = `${Date.now()}-${uploadedImage.originalname}`;


      const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      user.photo = imageUrl;


      const file = bucket.file(filename);
      const stream = file.createWriteStream({
        metadata: {
          contentType: uploadedImage.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.error('Error uploading image:', err);
        return handleErrorResponse(res, 500, 'Error uploading image.');
      });

      stream.on('finish', async () => {

        await user.save();


        handleSuccessResponse(res, 200, null, user);
      });

      stream.end(uploadedImage.buffer);
    } else {
      return handleErrorResponse(res, 400, 'No image file provided.');
    }
  } catch (err) {
    console.error(err);
    handleErrorResponse(res, 500, 'Internal Server Error');
  }
};

const handleErrorResponse = (res, status, message) => {
  return res.status(status).json({
    status: "fail",
    message: message,
  });
};

const handleSuccessResponse = (res, status, user) => {
  return res.status(status).json({
    status: "success",
    data: {
      user: user,
    },
  });
};

exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })

    if (!user || user.role !== 'student') {
      return res.status(404).json({
        status: "fail",
        message: "You can only delete a student",
      });
    }

    const deletedUser = await User.findByIdAndDelete(user._id)
    res.status(204).json({
      status: "success",
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getAllTeachers = async (req, res) => {
  try {
    const users = await User.find({ role: "teacher" });

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getOneTeacher = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
      ],
      role: 'teacher',
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No teachers found with the given search term.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};



exports.updateTeacher = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user || user.role !== 'teacher') {
      return res.status(404).json({
        status: "fail",
        message: "Teacher with this id does not exist",
      });
    }

    const allowedFields = ['name', 'email', 'specialization', 'phone'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      data: {
        teacher: updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.addTeacher = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword, countryCode, phoneNumber, specialization, qualifications, bio, timeSlots } = req.body;

    if (!name || !email || !role || !password || !confirmPassword || !countryCode || !phoneNumber) {
      return handleErrorResponse(res, 400, "Please provide all required fields.");
    }
    const userData = {
      name,
      email,
      role,
      password,
      confirmPassword,
      phone: `+${countryCode}${phoneNumber}`,
      countryCode,
      phoneNumber,
      specialization,
      qualifications,
      bio,
      timeSlots,
    };

    if (role === "teacher" && specialization && qualifications && bio && timeSlots) {
      userData.specialization = specialization;
      userData.qualifications = qualifications;
      userData.bio = bio;
      userData.timeSlots = timeSlots.split(", ");
    } else {
      return handleErrorResponse(res, 400, "Please provide all required details.");
    }

    const user = new User(userData);


    if (req.file && req.file.buffer) {
      const uploadedImage = req.file;
      const filename = `${Date.now()}-${uploadedImage.originalname}`;


      const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      user.photo = imageUrl;


      const file = bucket.file(filename);
      const stream = file.createWriteStream({
        metadata: {
          contentType: uploadedImage.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.error('Error uploading image:', err);
        return handleErrorResponse(res, 500, 'Error uploading image.');
      });

      stream.on('finish', async () => {

        await user.save();

        handleSuccessResponse(res, 200, null, user);
      });

      stream.end(uploadedImage.buffer);
    } else {
      return handleErrorResponse(res, 400, 'No image file provided.');
    }
  } catch (err) {
    console.error(err);
    handleErrorResponse(res, 500, 'Internal Server Error');
  }
};



exports.deleteTeacher = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })

    if (!user || user.role !== 'teacher') {
      return res.status(404).json({
        status: "fail",
        message: "You can only delete a teacher",
      });
    }

    const deletedUser = await User.findByIdAndDelete(user._id)
    res.status(204).json({
      status: "success",
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getAllStudentsCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });

    res.status(200).json({
      status: "success",
      count: count,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllTeachersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "teacher" });

    res.status(200).json({
      status: "success",
      count: count,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getAllSocietiesCount = async (req, res) => {
  try {
    const count = await Society.countDocuments({ status: "approved" });

    res.status(200).json({
      status: "success",
      count: count,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ status: "approved" });

    res.status(200).json({
      status: "success",
      length: societies.length,
      data: societies,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};



exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findOne({ _id: req.params.id });

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society with this id does not exist",
      });
    }

    const allowedFields = ['name', 'description', 'societyByLaws'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedSociety = await Society.findByIdAndUpdate(society._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      data: {
        society: updatedSociety,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findOne({ _id: req.params.id });

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society with this id does not exist",
      });
    }

    await Society.findByIdAndDelete(society._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getOneSociety = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const societies = await Society.find({
      name: { $regex: searchTerm, $options: 'i' },
    });

    if (!societies || societies.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No societies found with the given search term.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        societies: societies,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};