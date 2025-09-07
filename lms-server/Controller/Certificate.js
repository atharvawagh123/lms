const { PDFDocument, rgb } = require("pdf-lib");
const path = require("path");
const Certificate = require("../Models/Certificate");
const fs = require("fs");
const { check, validationResult } = require("express-validator");

function certificateidgenerator() {
  return "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}
// Create Certificate
exports.createCertificate = async (req, res) => {
  try {
    const { studentId, studentName, courseName, completionDate } = req.body;

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();

    // Add a blank page
    const page = pdfDoc.addPage([842, 595]); // Landscape A4 size

    // Load image
    const imagePath = path.join(__dirname, "../certificate/image.png");
    const imageBytes = fs.readFileSync(imagePath);
    const pngImage = await pdfDoc.embedPng(imageBytes);

    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Draw Course Name (for)
    page.drawText(courseName, {
      x: 300,
      y: 350,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Draw Student Name (Awarded to)
    page.drawText(studentName, {
      x: 350,
      y: 225,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Draw Date
    page.drawText(new Date(completionDate).toDateString(), {
      x: 160,
      y: 155,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Draw Signature
    page.drawText("Authorized Signature", {
      x: 505,
      y: 155,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Save to file
    const savePath = path.join(
      __dirname,
      `../studentcertificate/${studentId}.pdf`
    );

    fs.writeFileSync(savePath, pdfBytes);

    const certificateId = certificateidgenerator();
    // Save certificate info to DB
    const newCertificate = new Certificate({
      studentId,
      studentName,
      courseName,
      completionDate,
      fileType: "pdf",
      certificateFile: Buffer.from(pdfBytes),
      certificateId,
    });
    await newCertificate.save();

    res.status(200).json({
      message: "Certificate created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const { certificateid } = req.params;
    const certificate = await Certificate.findOne({ certificateid });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    await Certificate.deleteOne({ certificateid });
    const filePath = path.join(
      __dirname,
      `../studentcertificate/${certificate.studentId}.pdf`
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    //remove certificateFile from each certificate
    certificates.forEach((certificate) => {
      certificate.certificateFile = undefined;
    });

    res.status(200).json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get certificates by Student ID
exports.getCertificatesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const certificates = await Certificate.find({ studentId });
    res.status(200).json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//download certificate by certificateId
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
        }
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${certificate.studentId}.pdf`,
    });
    res.send(certificate.certificateFile);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};  