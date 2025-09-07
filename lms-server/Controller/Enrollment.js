const Enroller = require('../Models/Enroller');
const Course = require('../Models/Course');

// Generate unique enrollment ID
function generateEnrollmentId() {
  return 'enr_' + Math.random().toString(36).substr(2, 9);
}

// Enroll a user in a course
exports.enrollUser = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enroller.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'User is already enrolled in this course' });
        }

        // Check if the course exists
        const course = await Course.findOne({ CourseId: courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Create a new enrollment
        const newEnrollment = new Enroller({
            user: userId,
            course: courseId,
            EnrollmentId: generateEnrollmentId()
        });
        await newEnrollment.save();
        res.status(201).json({ message: 'User enrolled successfully', enrollment: newEnrollment });
     }catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};