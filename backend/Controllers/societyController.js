const { Storage } = require("@google-cloud/storage");
const Society = require("./../Models/societyModel.js");
const User = require("./../Models/userModel.js");
const Notification = require("./../Models/notificationModel.js");
const mongoose = require("mongoose");

const multer = require("multer");

const storage = new Storage({
  keyFilename: "E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json",
  projectId: "affable-radio-402918",
});

const societyLogoBucketName = "society_logos";
const societyBannerBucketName = "society_banner";
const logoBucket = storage.bucket(societyLogoBucketName);
const bannerBucket = storage.bucket(societyBannerBucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload an image file (jpg, jpeg, png, or gif).")
      );
    }
    cb(null, true);
  },
});

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({
      status: "approved",
    });

    res.status(200).json({
      status: "success",
      length: societies.length,
      data: {
        societies: societies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createSociety = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(400).json({
        status: "fail",
        message: "Admin not found",
      });
    }

    const createdBy = req.user._id;

    if (!createdBy) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is missing",
      });
    }

    const societyData = req.body;
    societyData.status = "pending";
    societyData.createdBy = createdBy;

    if (req.files && req.files.logo && req.files.banner) {
      const uploadedLogo = req.files.logo[0];
      const uploadedBanner = req.files.banner[0];

      console.log("Uploaded Logo:", uploadedLogo);
      console.log("Uploaded Banner:", uploadedBanner);

      const logoFilename = uploadedLogo.originalname;
      const bannerFilename = uploadedBanner.originalname;

      console.log("Logo Filename:", logoFilename);
      console.log("Banner Filename:", bannerFilename);

      const logoFile = logoBucket.file(logoFilename);
      const bannerFile = bannerBucket.file(bannerFilename);

      const logoStream = logoFile.createWriteStream({
        metadata: {
          contentType: uploadedLogo.mimetype,
        },
      });

      const bannerStream = bannerFile.createWriteStream({
        metadata: {
          contentType: uploadedBanner.mimetype,
        },
      });

      logoStream.on("error", (err) => {
        console.error("Error uploading logo:", err);
        return res.status(500).json({
          status: "fail",
          message: "Error uploading logo.",
        });
      });

      bannerStream.on("error", (err) => {
        console.error("Error uploading banner:", err);
        return res.status(500).json({
          status: "fail",
          message: "Error uploading banner.",
        });
      });

      logoStream.on("finish", () => {
        const logoImageUrl = `https://storage.googleapis.com/${societyLogoBucketName}/${logoFilename}`;
        societyData.logo = logoImageUrl;

        bannerStream.on("finish", () => {
          const bannerImageUrl = `https://storage.googleapis.com/${societyBannerBucketName}/${bannerFilename}`;
          societyData.banner = bannerImageUrl;

          createSocietyWithLogoAndBanner(societyData, res, createdBy, admin);
        });

        bannerStream.end(uploadedBanner.buffer);
      });

      logoStream.end(uploadedLogo.buffer);

      console.log("Uploaded Logo:", uploadedLogo);
      console.log("Uploaded Banner:", uploadedBanner);
    } else {
      createSocietyWithLogoAndBanner(societyData, res, createdBy, admin);
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

async function createSocietyWithLogo(societyData, res, createdBy, admin) {
  const society = await Society.create(societyData);
  console.log("Created society:", society);

  const user = await User.findById(createdBy);

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  }

  const updatedSociety = await Society.findByIdAndUpdate(society._id, {
    createdFor: admin._id,
    adminInfo: admin,
    userInfo: user,
  });

  const notificationMessage = `${user.name} has sent you a request to create a society`;

  const notification = new Notification({
    type: "New Society Request",
    message: notificationMessage,
    recipient: admin._id,
    onClickPath: "/manageSocieties",
    data: {
      society: updatedSociety,
    },
  });

  await notification.save();

  admin.unseenNotifications.push(notification);
  await admin.save();

  const userNotification = new Notification({
    type: "Society Request Created",
    message: "Your society request has been created successfully",
    recipient: user._id,
    onClickPath: "/manageSocieties",
    data: {
      society: updatedSociety,
    },
  });

  await userNotification.save();

  res.status(200).json({
    status: "success",
    message: "Your society creation request has been sent to the admin.",
    data: {
      updatedSociety: updatedSociety,
    },
  });
}

async function createSocietyWithLogoAndBanner(
  societyData,
  res,
  createdBy,
  admin
) {
  try {
    const society = await Society.create(societyData);

    const user = await User.findById(createdBy);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    const updatedSociety = await Society.findByIdAndUpdate(society._id, {
      createdFor: admin._id,
      adminInfo: admin,
      userInfo: user,
    });

    const notificationMessage = `${user.name} has sent you a request to create a society`;

    const notification = new Notification({
      type: "New Society Request",
      message: notificationMessage,
      recipient: admin._id,
      onClickPath: "/manageSocieties",
      data: {
        society: updatedSociety,
      },
    });

    await notification.save();

    admin.unseenNotifications.push(notification);
    await admin.save();

    const userNotification = new Notification({
      type: "Society Request Created",
      message: "Your society request has been created successfully",
      recipient: user._id,
      onClickPath: "/manageSocieties",
      data: {
        society: updatedSociety,
      },
    });

    await userNotification.save();

    res.status(200).json({
      status: "success",
      message: "Your society creation request has been sent to the admin.",
      data: {
        updatedSociety: updatedSociety,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

exports.manageSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ createdFor: req.user._id });
    if (!societies) {
      return res.status(404).json({
        status: "fail",
        message: "No Society Requests could be found",
      });
    }
    res.status(200).json({
      status: "success",
      length: societies.length,
      data: {
        societies: societies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateSocietyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatusValues = ["approved", "rejected"];
    if (!validStatusValues.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Status Value",
      });
    }
    const society = await Society.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const user = await User.findById(society.createdBy);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User could not be found",
      });
    }

    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "Society Status Changed",
      message: `Your Society creation request has been ${society.status} by ${society.adminInfo.name}`,
    });

    await User.findByIdAndUpdate(user._id, {
      unseenNotifications: unseenNotifications,
    });

    res.status(200).json({
      status: "success",
      message: "Society status changed successfully",
      data: {
        society: society,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getApprovedSocieties = async (req, res) => {
  try {
    const approvedSocieties = await Society.find({ status: "approved" });
    res.status(200).json({
      status: "success",
      length: approvedSocieties.length,
      data: {
        societies: approvedSocieties,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        society,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.joinSociety = async (req, res) => {
  try {
    const society = await Society.findOne({ _id: req.params.id });
    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society Not Found",
      });
    }
    const isMember = society.members.includes(req.user._id);
    const hasJoinRequest = society.joinRequests.includes(req.user._id);

    if (isMember) {
      return res.status(400).json({
        status: "fail",
        message: "You are already a member of this society",
      });
    }
    if (hasJoinRequest) {
      return res.status(400).json({
        status: "fail",
        message: "You have already sent a join request for this society",
      });
    }
    society.joinRequests.push(req.user._id);
    await society.save();
    res.status(200).json({
      status: "success",
      message: "Join request sent successfully to the society Admin",
      data: {
        society: society,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.handleJoinRequest = async (req, res) => {
  try {
    const { societyId, userId, action } = req.params;

    const society = await Society.findById(societyId).populate("createdBy");

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const hasJoinRequest = society.joinRequests.includes(userId);

    if (!hasJoinRequest) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid action. Valid actions are 'accept' or 'reject'.",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(403).json({
        status: "fail",
        message: "User not authenticated.",
      });
    }
    


    if (society.createdBy._id && req.user._id.equals(society.createdBy._id)) {
     
      if (action === "accept") {
        society.members.push(userId);
        society.joinRequests.pull(userId);
        await society.save();

        await User.findByIdAndUpdate(
          userId,
          {
            $push: { joinedSocieties: societyId },
          },
          { new: true }
        );

        return res.status(200).json({
          status: "success",
          message: "User has been added to the society.",
          data: {
            society: society,
          },
        });
      } else if (action === "reject") {
        society.joinRequests.pull(userId);
        await society.save();

        return res.status(200).json({
          status: "success",
          message: "Join request has been rejected.",
          data: {
            society: society,
          },
        });
      }
    }

    return res.status(403).json({
      
      status: "fail",
      message: "Only the admin can handle join requests.",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId).populate({
      path: "members createdBy",
      select: "name photo role email department specialization",
    });
    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const members = society.members.map((member) => ({
      _id: member._id,
      name: member.name,
      photo: member.photo,
      role: member.role,
      email: member.email,
      department: member.department,
      specialization: member.specialization,
    }));

    const admin = {
      _id: society.createdBy._id,
      name: society.createdBy.name,
      photo: society.createdBy.photo,
      email: society.createdBy.email,
      department: society.createdBy.department,
      role: "admin",
    };

    res.status(200).json({
      status: "success",
      data: {
        admin: admin,
        members: members,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllMemberRequests = async (req, res) => {
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId).populate(
      "joinRequests",
      "name photo"
    );

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const joinRequests = society.joinRequests.map((joinRequest) => ({
      _id: joinRequest._id,
      name: joinRequest.name,
      photo: joinRequest.photo,
    }));

    res.status(200).json({
      status: "success",
      length: joinRequests.length,
      data: {
        joinRequests: joinRequests,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getJoinRequests = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    if (req.user._id.toString() !== society.createdBy.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Only the admin can fetch join requests.",
      });
    }

    const joinRequests = await User.find(
      { _id: { $in: society.joinRequests } },
      "name"
    );

    res.status(200).json({
      status: "success",
      data: {
        joinRequests,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUserJoinedSocieties = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "User not authenticated.",
      });
    }

    const joinedSocieties = await Society.find({
      _id: { $in: req.user.joinedSocieties },
    });

    res.status(200).json({
      status: "success",
      length: joinedSocieties.length,
      data: {
        joinedSocieties,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch user's joined societies",
    });
  }
};

exports.getMembersCount = async (req, res) => {
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId).populate(
      "members",
      "name photo"
    );

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const membersCount = society.members.length;

    res.status(200).json({
      status: "success",
      membersCount: membersCount,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.isUserMember = async (req, res) => {
  try {
    const societyId = req.params.societyId;

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        status: "fail",
        message: "Society not found",
      });
    }

    const members = await User.find({
      _id: { $in: society.members },
    });

    res.status(200).json({
      status: "success",
      length: members.length,
      data: {
        members,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
