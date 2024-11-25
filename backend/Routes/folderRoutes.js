const express = require("express");
const router = express.Router();
const folderController = require("../Controllers/folderController.js");

router.post("/", folderController.createFolder);

router.get("/", folderController.getAllFolders);

router.get("/:folderId", folderController.getFolderById);

router.delete("/", folderController.deleteFolderByName);

module.exports = router;
