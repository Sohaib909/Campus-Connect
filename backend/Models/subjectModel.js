const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  photo: {
    type: String,
  },
});

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;
