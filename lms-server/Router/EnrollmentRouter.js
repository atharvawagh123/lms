const router = require('express').Router();
const EnrollmentController = require('../Controller/Enrollment');

// Post method to enroll a user
router.post("/enroll", EnrollmentController.enrollUser);

// Get all enrollments
router.get("/getallenrollments", EnrollmentController.getAllEnrollments);
router.get("/getenrollments/:userId", EnrollmentController.getEnrollmentsByUserId);
router.get("/getenrollments/course/:courseId", EnrollmentController.getEnrollmentsByCourseId);
// router.get("/getenrolleduser", EnrollmentController.getEnrolledCurrentUser);


// Delete an enrollment
router.delete("/deleteenrollment/:enrollmentId", EnrollmentController.deleteEnrollment);

//update enrollment - not needed for now
 router.put("/updateenrollment/:enrollmentId", EnrollmentController.updateEnrollment);


module.exports = router;