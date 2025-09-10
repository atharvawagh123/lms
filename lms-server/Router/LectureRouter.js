const router = require('express').Router();
const lectureController = require('../Controller/Lecture');
const auth = require('../Middleware/auth');

// postmethod
router.post("/createlectures", lectureController.createLecture);

//getmethod
router.get("/getalllectures",auth, lectureController.getAllLectures);
router.get("/getlecturesbycourse/:courseId", lectureController.getLecturesByCourseId);
router.get("/getlecturesbyid/:lectureId", lectureController.getLectureById);
router.get("/searchlectures", lectureController.searchLectures);

//putmethod
router.put("/updatelectures/:lectureId", lectureController.updateLecture);
//deletemethod
router.delete("/deletelectures/:lectureId", lectureController.deleteLecture);
module.exports = router;