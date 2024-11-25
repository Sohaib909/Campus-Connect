const { Storage } = require("@google-cloud/storage");
const Subject = require("../Models/subjectModel.js");
const Folder = require("../Models/folderModel.js");

const storage = new Storage({
  keyFilename: "E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json",
  projectId: "affable-radio-402918",
});

const bucketName = "subject_folder";
const bucket = storage.bucket(bucketName);

exports.createSubjectFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;

    const mainFolder = await Folder.findById(folderId);

    if (!mainFolder) {
      return res.status(404).json({ message: "Main folder not found" });
    }

    const subjectFolder = new Subject({ name, parentFolder: folderId });

    if (req.file && req.file.buffer) {
      const uploadedImage = req.file;
      const filename = `${Date.now()}-${uploadedImage.originalname}`;
      const file = bucket.file(filename);
      const stream = file.createWriteStream({
        metadata: { contentType: uploadedImage.mimetype },
      });

      stream.on("error", (uploadErr) => {
        console.error(uploadErr);
        return res.status(500).json({ error: "Error uploading image." });
      });

      stream.on("finish", async () => {
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        subjectFolder.photo = imageUrl;
        await subjectFolder.save();
        res.status(201).json(subjectFolder);
      });

      stream.end(uploadedImage.buffer);
    } else {
      const savedSubjectFolder = await subjectFolder.save();
      res.status(201).json(savedSubjectFolder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create subject folder" });
  }
};

exports.getSubjectFoldersByfolderId = async (req, res) => {
  try {
    const { folderId } = req.params;

    const subjectFolders = await Subject.find({ parentFolder: folderId });

    if (subjectFolders.length > 0) {
      res.json(subjectFolders);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch subject folders" });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch folder" });
  }
};

exports.deleteSubjectFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const subjectFolderToDelete = await Subject.findOne({ name });

    if (!subjectFolderToDelete) {
      return res.status(404).json({ message: "Subject folder not found" });
    }

    await Subject.findByIdAndDelete(subjectFolderToDelete._id);

    res.json({ message: "Subject folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete subject folder" });
  }
};
