const router = require("express").Router();
const InstructorController = require("../Controller/Instructor");
const auth = require("../Middleware/Instructormiddleware");

//postmethod
router.post("/loginInstructor", InstructorController.logininstructor);
router.post("logoutInstructor", InstructorController.logoutinstructor);
router.post("/createlectures", InstructorController.createLecture);

//getmethod
router.get(
  "/getInstructorProfile",
  auth,
  InstructorController.getinstructorprofile
);

module.exports = router;
