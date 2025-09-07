const router = require('express').Router();
const AdminController = require('../Controller/Admin.js');

//postmethods
router.post('/createAdmin', AdminController.createAdmin);
router.post('/loginAdmin', AdminController.loginAdmin); 
router.post('/createStudent', AdminController.createStudent);
router.post("/createInstructor", AdminController.createInstructor);

//getmethods
router.get('/getAllStudents', AdminController.getAllStudents);
router.get('/getAllInstructors', AdminController.getAllInstructors);
router.get("/getstudentbyname", AdminController.searchstudent);
router.get("/getinstructorbyname", AdminController.searchinstructor);
router.get("/getstudentbyid/:studentid", AdminController.getstudentbyid);
router.get("/getinstructorbyid/:instructorid", AdminController.getinstructorbyid);

//putmethods
router.put("/updatestudent/:studentid", AdminController.updateStudent);
router.put("/updateinstructor/:instructorid", AdminController.updateInstructor);


//deletemethods
router.delete("/deletestudent/:studentid", AdminController.deleteStudent);
router.delete("/deleteinstructor/:instructorid", AdminController.deleteInstructor);




module.exports = router;