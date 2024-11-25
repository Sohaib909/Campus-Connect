const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const cloudStorageController = require("../Controllers/cloudStorageController.js");
const CourseMaterial = require("../Models/courseMaterial.js");
const Subject = require("../Models/subjectModel.js");

router.post(
  "/upload",
  upload.single("file"),
  cloudStorageController.uploadCourseMaterial
);

router.get("/list", async (req, res) => {
  try {
    let query = {};

    if (req.query.folderId && req.query.folderType) {
      query.folder = req.query.folderId;
      query.folderType = req.query.folderType;
    } else if (req.query.folderId) {
      query.folder = req.query.folderId;
    } else {
      return res.status(400).json({ error: "Folder ID is required." });
    }

    if (req.query.folderId && req.query.folderType) {
      query.folder = req.query.folderId;
      query.folderType = req.query.folderType;
    }

    const courseMaterials = await CourseMaterial.find(query).populate("folder");
    res.json(courseMaterials);
  } catch (error) {
    console.error("Failed to fetch course materials:", error);
    res.status(500).json({ message: "Failed to fetch course materials" });
  }
});
router.get("/download/:filename", async (req, res) => {});

router.delete("/delete/:id", cloudStorageController.deleteCourseMaterial);

router.get("/folders/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    console.error("Failed to fetch folder:", error);
    res.status(500).json({ message: "Failed to fetch folder" });
  }
});

module.exports = router;
