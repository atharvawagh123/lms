const jwt = require('jsonwebtoken');
const Student = require('../Models/Student');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lecture = require('../Models/Lecture');
const Course = require('../Models/Course');
const Enrollment = require('../Models/Enrollment');

// login student
exports.loginstudent = async (req, res) => {
    try {
        const { id, password } = req.body;
        // Validate input
        if (!id || !password) {
            return res.status(400).json({ message: 'Please provide id and password' });
        }
        const student = await Student.findOne({ id });
        if (!student) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        // Check password
        if (student.password !== password) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        // Create and return JWT
        const token = jwt.sign(
            {
                student: {
                    id: student._id,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );
        res.status(200).json({ success: true, message: 'Login successful',token });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

// Additional student-related controller functions can be added here
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ success: true, student });
    } catch (error) {
        console.error('Profile Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            user: req.user.id,
        });
        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: 'No enrolled courses found' });
        }

      
        res.status(200).json({ success: true , enrollments });
    } catch (error) {
        console.error('Enrollment Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};  