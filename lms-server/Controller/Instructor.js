const Instructor = require("../Models/Instructor");
const Lecture = require("../Models/Lecture");
const Course = require("../Models/Course");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function generateLectureId() {
  return "lec_" + Math.random().toString(36).substr(2, 9);
}
exports.logininstructor = async (req, res) => {
    try {
        const { id, password } = req.body;
        // Validate input
        if (!id || !password) {
            return res.status(400).json({ message: "Please provide id and password" });
        }
        const instructor = await Instructor.findOne({ id });
        if (!instructor) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Check password
        if (instructor.password !== password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Create and return JWT
        const token = jwt.sign(
          {
            instructor: {
              id: instructor._id,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: "15d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
    
        res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.logoutinstructor = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getinstructorprofile = async (req, res) => {
    try {
        console.log("getinstructorprofile");
        console.log(req.user);
        const id = req.user._id;
        const instructor = await Instructor.findById(id).select("-password");
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.status(200).json({ success: true, instructor });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.createLecture = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl, resources } = req.body;

    // Check if course exists
    const course = await Course.findOne({ CourseId: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create new lecture
    const lectureId = generateLectureId();
    const newLecture = new Lecture({
      courseId,
      lectureId,
      title,
      description,
      videoUrl,
      resources,
    });

    await newLecture.save();
    res.status(201).json({
      message: "Lecture created successfully",
      lecture: newLecture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
