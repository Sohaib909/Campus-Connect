const express = require("express");
const multer = require("multer");
const subjectController = require("../controllers/subjectController");

const router = express.Router();

const storage = multer.memoryStorage();
const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/:folderId",
  multerUpload.single("photo"),
  subjectController.createSubjectFolder
);

router.delete("/", subjectController.deleteSubjectFolder);

router.get("/:folderId", subjectController.getFolderById);
router.get("/list/:folderId", subjectController.getSubjectFoldersByfolderId);
router.get("/:folderId", subjectController.getSubjectFoldersByfolderId);

module.exports = router;
