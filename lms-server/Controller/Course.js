const Course = require('../Models/Course');

function CourseIdgenerator() {
    return 'CourseId-' + Math.floor(1000 + Math.random() * 9000).toString();
}

// Create Course postmethod
exports.createCourse = async (req,res) => {
    try {
      const { CourseId, title, summary, image, price, createdBy } = req.body;
      const newCourseId = CourseIdgenerator();

      // Check for unique CourseId
      const existingCourse = await Course.findOne({ CourseId: newCourseId });
      if (existingCourse) {
        return res.status(400).json({ message: "CourseId must be unique" });
      }
      // Create and save the new course
      const newCourse = new Course({
        CourseId: newCourseId,
        title,
        summary,
        image,
        price,
        createdBy,
      });
      await newCourse.save();
      res
        .status(201)
        .json({ message: "Course Created", CourseId: CourseId, newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

//update course
exports.updateCourse = async (req, res) => { 
    try {
        const { CourseId } = req.params;
        const {title,summary,image,price,createdBy} = req.body;
        const updatedCourse = await Course.findOneAndUpdate(
            { CourseId },
            { title, summary, image, price, createdBy },
            { new: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', updatedCourse });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


//delete course
exports.deleteCourse = async (req, res) => {
    try {
        const { CourseId } = req.params;
        const deletedCourse = await Course.findOneAndDelete({ CourseId });
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


//get course
exports.getCourse = async (req, res) => {
    try {
        const { CourseId } = req.params;
        const course = await Course.findOne({ CourseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
//get all course
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ courses });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

//search course by title
exports.searchCoursesByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const courses = await Course.find({ title: { $regex: title, $options: 'i' } });
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}       
//filter course by price range
exports.filterCoursesByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const courses = await Course.find({
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
        });
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
