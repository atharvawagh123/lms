const router = require('express').Router();
const CouserController = require('../Controller/Course');

//post method
router.post('/createCourse', CouserController.createCourse);

//putmethod
router.put('/updateCourse/:CourseId', CouserController.updateCourse);

//delete method
router.delete('/deleteCourse/:CourseId', CouserController.deleteCourse);

//get method
router.get('/getCourse/:CourseId', CouserController.getCourse);
router.get('/getAllCourses', CouserController.getAllCourses);
router.get('/getCoursetitle', CouserController.searchCoursesByTitle);
router.get("/filterCoursesByPrice", CouserController.filterCoursesByPriceRange);

module.exports = router;