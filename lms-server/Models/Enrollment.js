const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  EnrollmentId: { type: mongoose.Schema.Types.ObjectId, unique: true },
  user: { type: String, ref: 'User', required: true },
  course: { type: String, ref: 'Course', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Enrollment', enrollmentSchema);