
const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    completionDate: { type: Date, required: true },
    certificateFile: { type: Buffer, required: true }, // PDF or PNG file buffer
    fileType: { type: String, enum: ["pdf", "png"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
