const express = require("express");
const cors = require("cors");
const authController = require("./Controllers/authController.js");
const cloudStorageController = require("./Controllers/cloudStorageController.js");
const authRoutes = require("./Routes/authRoutes.js");
const teacherRoutes = require("./Routes/teacherRoutes.js");
const studentRoutes = require("./Routes/studentRoutes.js");
const reminderRoutes = require("./Routes/reminderRoutes.js");
const appointmentRoutes = require("./Routes/appointmentRoutes.js");
const notificationRoutes = require("./Routes/notificationRoutes.js");
const courseMaterialRoutes = require("./Routes/courseMaterialRoutes.js");
const folderRoutes = require("./Routes/folderRoutes.js");
const societyRoutes = require("./Routes/societyRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const newsRoutes = require("./Routes/newsRoutes");
const idRoutes = require("./Routes/idRoutes");
const postRoutes = require("./Routes/postRoutes.js");
const commentRoutes = require("./Routes/commentRoutes");
const subjectRoutes = require("./Routes/subjectRoutes.js");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

if (cloudStorageController.isCloudStorageConnected()) {
  console.log("Connected to Google Cloud Storage.");
} else {
  console.log("Failed to connect to Google Cloud Storage.");
}


app.use("/api/v1/users", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/manageTeachers", teacherRoutes);
app.use("/api/v1/manageStudents", studentRoutes);
app.use("/api/v1/reminders", reminderRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/course-materials", courseMaterialRoutes);
app.use("/api/v1/folders", folderRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/folders/:folderId/subject", subjectRoutes);
app.use("/api/v1/subject/:folderId", subjectRoutes);
app.use("/api/v1/folders/:folderId/course-materials", courseMaterialRoutes);
app.use("/api/v1/course-materials", courseMaterialRoutes);
app.use("/api/v1/folders/:folderId/course-materials", folderRoutes);
app.use("/api/v1/societies", societyRoutes);
app.use("/api/v1/campusNews", newsRoutes);
app.use("/api/v1/societies/:id", idRoutes);
app.use("/api/v1/societies", postRoutes);
app.use("/api/v1/users/currentUser", authRoutes);
app.use("/api/v1/comments", commentRoutes);

app.use((req, res, next) => {
  console.log(`Received request for: ${req.originalUrl}`);
  next();
});

app.use((req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `Cannot find the URL ${req.originalUrl} on the server`,
  });
});

module.exports = app;
