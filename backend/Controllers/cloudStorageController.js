const { Storage } = require('@google-cloud/storage');
const CourseMaterial = require('../Models/courseMaterial.js');
const Subject = require('../Models/subjectModel.js');

const storage = new Storage({
  keyFilename: 'E:/Integration 2/Integration/backend/affable-radio-402918-23c4170fa2d1.json',
  projectId: 'affable-radio-402918',
});

const bucketName = 'course_material';
const bucket = storage.bucket(bucketName);


function extractFileType(fileName) {
  const extension = fileName.split('.').pop();
  if (extension === 'pdf' || extension === 'docx' || extension === 'pptx') {
    return extension;
  } else {
    return null;
  }
}

exports.uploadCourseMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { title, instructor, folderId } = req.body;
    if (!title || !instructor || !folderId) {
      return res.status(400).json({ error: 'Title, instructor, and folderId are required' });
    }

    const fileName = req.file.originalname;
    const fileType = extractFileType(fileName);

    if (!fileType) {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const cloudStorageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          title,
          instructor,
          fileType,
          cloudStorageUrl,
        },
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading to Google Cloud Storage:', err);
      res.status(500).json({ error: 'Course material upload failed' });
    });

    blobStream.on('finish', async () => {
      console.log('File uploaded to Google Cloud Storage.');

      try {
        const folderDetails = await Subject.findById(folderId);

        if (!folderDetails) {
          return res.status(404).json({ error: 'Folder not found' });
        }

        const newCourseMaterial = new CourseMaterial({
          title,
          instructor,
          cloudStorageUrl,
          fileType,
          folder: folderId,
        });

        const savedCourseMaterial = await newCourseMaterial.save();
        res.status(201).json(savedCourseMaterial);
      } catch (error) {
        console.error('Error saving file data to MongoDB:', error);
        res.status(500).json({ error: 'Course material upload failed' });
      }
    });

    blobStream.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Course material upload failed' });
  }
};



exports.listCourseMaterials = async (req, res) => {
  try {
    const courseMaterials = await CourseMaterial.find();
    res.json(courseMaterials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course materials' });
  }

};


exports.listFilesInBucket = async () => {
  const [files] = await bucket.getFiles();
  const fileNames = files.map((file) => file.name);
  return fileNames;
};

exports.deleteCourseMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    if (!materialId) {
      return res.status(400).json({ message: 'Material ID is missing or invalid.' });
    }


    const material = await CourseMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Course material not found.' });
    }


    const filename = material.cloudStorageUrl.split('/').pop();
    const file = bucket.file(filename);
    await file.delete();


    await CourseMaterial.findByIdAndDelete(materialId);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting the file' });
  }
};


exports.isCloudStorageConnected = () => {
  return storage.authClient != null;
};



exports.getCourseMaterialsByFolder = async (req, res) => {

  try {
    const { folderId } = req.params;
    console.log('Folder ID:', folderId);

    if (!folderId) {
      return res.status(400).json({ error: "Folder ID is required." });
    }


    const courseMaterials = await CourseMaterial.find({ folder: folderId });

    res.json(courseMaterials);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch course materials" });
  }
};
