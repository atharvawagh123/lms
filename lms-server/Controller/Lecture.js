const Lecture = require("../Models/Lecture");
const Course = require("../Models/Course");

// Generate unique lecture ID
function generateLectureId() {
  return "lec_" + Math.random().toString(36).substr(2, 9);
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

exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lectures = await Lecture.find({ courseId });

    if (!lectures || lectures.length === 0) {
      return res
        .status(404)
        .json({ message: "No lectures found for this course" });
    }

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findOne({ lectureId });

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search lectures by title or description
exports.searchLectures = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const lectures = await Lecture.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    if (lectures.length === 0) {
      return res.status(404).json({ message: "No lectures found" });
    }

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update lecture details
exports.updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, description, videoUrl, resources } = req.body;

    const updatedLecture = await Lecture.findOneAndUpdate(
      { lectureId },
      { title, description, videoUrl, resources },
      { new: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({
      message: "Lecture updated successfully",
      updatedLecture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a lecture
exports.deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const deletedLecture = await Lecture.findOneAndDelete({ lectureId });

    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
