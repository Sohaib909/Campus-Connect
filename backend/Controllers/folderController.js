const Folder = require("../Models/folderModel.js");

exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;

    if (parentFolderId) {
      const parentFolder = await Folder.findById(parentFolderId);

      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }

      const subjectFolder = new Folder({ name, parentFolder: parentFolderId });

      const savedSubjectFolder = await subjectFolder.save();

      return res.status(201).json(savedSubjectFolder);
    }

    const folder = new Folder({ name });

    const savedFolder = await folder.save();

    res.status(201).json(savedFolder);
  } catch (error) {
    res.status(500).json({ error: "Unable to create folder" });
  }
};

exports.getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch folders" });
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

exports.deleteFolderByName = async (req, res) => {
  try {
    const { name } = req.body;

    const folderToDelete = await Folder.findOne({ name });

    if (!folderToDelete) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await Folder.findByIdAndDelete(folderToDelete._id);

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete folder" });
  }
};
