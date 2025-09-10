const Enroller = require("../Models/Enrollment");
const Course = require("../Models/Course");
const mongoose = require("mongoose");

// Generate unique enrollment ID
function generateEnrollmentId() {
  return "enr_" + Math.random().toString(36).substr(2, 9);
}

// Enroll a user in a course
exports.enrollUser = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enroller.findOne({
      user: userId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    // Check if the course exists
    const course = await Course.findOne({ CourseId: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new enrollment
    const newEnrollment = new Enroller({
      EnrollmentId: new mongoose.Types.ObjectId(),
      user: userId,
      course: courseId,
    });
    await newEnrollment.save();
    res
      .status(201)
      .json({
        message: "User enrolled successfully",
        enrollment: newEnrollment,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enroller.find();
    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get enrollment by userId
exports.getEnrollmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enroller.find({ user: userId });
    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get enrollment by courseId
exports.getEnrollmentsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enroller.find({ course: courseId });
    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const deletedEnrollment = await Enroller.findOneAndDelete({
      EnrollmentId: enrollmentId,
    });
    if (!deletedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res
      .status(200)
      .json({ message: "Enrollment deleted successfully", deletedEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an enrollment (e.g., change course)
exports.updateEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { courseId } = req.body;
    const updatedEnrollment = await Enroller.findOneAndUpdate(
      { EnrollmentId: enrollmentId },
      { course: courseId },
      { new: true }
    );
    if (!updatedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res
      .status(200)
      .json({ message: "Enrollment updated successfully", updatedEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error});
  }
};

//getenrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enroller.find({ user: userId }).populate(
      "course"
    );
    const courses = enrollments.map((enrollment) => enrollment.course);
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get enrolled current user who logged in
