const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  lectureId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  resources: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lecture", LectureSchema);
