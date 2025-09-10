const router = require("express").Router();
const studentController = require("../Controller/Student");
const auth = require("../middleware/Studentmiddleware");

// postmethod
router.post("/loginstudent", studentController.loginstudent);

//getmethod
router.get("/getstudentprofile", auth, studentController.getStudentProfile);

module.exports = router;