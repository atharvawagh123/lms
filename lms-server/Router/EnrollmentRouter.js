const router = require('express').Router();
const EnrollmentController = require('../Controller/Enrollment');

// Post method to enroll a user
router.post("/enroll", EnrollmentController.enrollUser);