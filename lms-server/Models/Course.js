const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  CourseId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdBy: {
    type: String, 
    enum: ["Admin", "Instructor"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Course", CourseSchema);
