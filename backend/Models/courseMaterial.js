const mongoose = require("mongoose");

const courseMaterialSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  cloudStorageUrl: String,
  fileType: String,
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});

module.exports = mongoose.model("CourseMaterial", courseMaterialSchema);
