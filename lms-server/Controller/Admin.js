const Admin = require("../Models/Admin");
const Student = require("../Models/Student");
const Instructor = require("../Models/Instructor");
const mailTransporter = require("../config/Email");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// class AdminController {
//   AdminController() {}
//   //    async sendEmail(to, subject, text) {
//   //     const mailOptions = {
//   //       from: process.env.EMAIL,
//   //       to,
//   //       subject,
//   //       text,
//   //         };
//   //     try {
//   //       const info = await mailTransporter.sendMail(mailOptions);
//   //       console.log("Email sent successfully:", info.response);
//   //     } catch (error) {
//   //       console.error("Email sending failed:", error);
//   //     }

//   //      }
// }

function generateStudentId() {
    const prefix = "STU"; // LMS ke liye prefix
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    const random = Math.floor(100 + Math.random() * 900); // 3 digit random number
    return `${prefix}-${timestamp}-${random}`;
  }

 function  generateInstructorId() {
    const prefix = "INS"; // LMS ke liye prefix
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    const random = Math.floor(100 + Math.random() * 900); // 3 digit random number
    return `${prefix}-${timestamp}-${random}`;
  }
exports.createAdmin = (req, res) => {
  try {
    check("name", "Username is required").not().isEmpty();
    check("password", "Password is required").not().isEmpty();
    check("email", "Please include a valid email").isEmail();
    check("phone", "Phone number is required").not().isEmpty();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, password, email, phone } = req.body;

    const newAdmin = Admin.create({
      name,
      password,
      email,
      phonenumber: phone,
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    check("email", "Please include a valid email").isEmail();
    check("password", "Password is required").not().isEmpty();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (admin.password != password) {
      return res.status(400).json({ message: "password does not match" });
    }

    admin.pastlogins.push(new Date());
    admin.save();

    const token = jwt.sign(
      {
        admin: {
          id: admin.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createStudent = async (req, res) => {
  try {
    await check("name", "Name is required").not().isEmpty().run(req);
    await check("email", "Please include a valid email").isEmail().run(req);
    await check("phone", "Phone number is required").not().isEmpty().run(req);
    await check("password", "Password is required").not().isEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists" });
    }
    const id =generateStudentId();

    const newstudent = await Student.create({
      id,
      name,
      email,
      phonenumber: phone,
      password,
    });

    // Send welcome email to student
    // await mailTransporter.sendMail({
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: "Welcome to LMS",
    //   text: `Your Student ID is ${id} and your password is ${password}`,
    // });

    res.status(201).json({
      message: "Student created successfully and email sent",
      student: newstudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createInstructor = async (req, res) => {
  try {
    await check("name", "Name is required").not().isEmpty();
    await check("email", "Please include a valid email").isEmail();
    await check("phone", "Phone number is required").not().isEmpty();
    await check("password", "Password is required").not().isEmpty();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, password } = req.body;

    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res
        .status(400)
        .json({ message: "Instructor with this email already exists" });
    }

    const id = generateInstructorId();

    const newInstructor = await Instructor.create({
      id,
      name,
      email,
      phonenumber: phone,
      password,
    });

    // Send welcome email to instructor
    // await mailTransporter.sendMail({
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: "Welcome to LMS",
    //   text: `Your Instructor ID is ${id} and your password is ${password}`,
    // });

    res.status(201).json({
      message: "Instructor created successfully and email sent",
      instructor: newInstructor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



//getall 
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json({ instructors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.searchstudent = async (req, res) => {
    try {
        const { studentname } = req.query;
        const students = await Student.find({ name: { $regex: studentname, $options: 'i' } });
        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.searchinstructor = async (req, res) => {
    try {
        const { instructorname } = req.query;
        const instructors = await Instructor.find({ name: { $regex: instructorname, $options: 'i' } });
        res.status(200).json({ instructors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getstudentbyid = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await Student.findOne({ id: studentid });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
exports.getinstructorbyid = async (req, res) => {
    try {
        const { instructorid } = req.params;
        const instructor = await Instructor.findOne({ id: instructorid });
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.status(200).json({ instructor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

//update
exports.updateStudent = async (req, res) => { 
    try {
        await check("email", "Please include a valid email").optional().isEmail().run(req);
        await check("phone", "Phone number is required").optional().not().isEmpty().run(req);
        await check("password", "Password is required").optional().not().isEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { studentid } = req.params;
        const { name, email, phone, password } = req.body;
        const student = await Student.findOne({ id: studentid });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (name) student.name = name;
        if (email) student.email = email;
        if (phone) student.phonenumber = phone;
        if (password) student.password = password;
        await student.save();
        res.status(200).json({ message: "Student updated successfully", student });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateInstructor = async (req, res) => { 
    try {
        await check("email", "Please include a valid email").optional().isEmail().run(req);
        await check("phone", "Phone number is required").optional().not().isEmpty().run(req);
        await check("password", "Password is required").optional().not().isEmpty().run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { instructorid } = req.params;
        const { name, email, phone, password } = req.body;

        const instructor = await Instructor.findOne({ id: instructorid });
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        if (name) instructor.name = name;
        if (email) instructor.email = email;
        if (phone) instructor.phonenumber = phone;
        if (password) instructor.password = password;
        await instructor.save();
        res.status(200).json({ message: "Instructor updated successfully", instructor });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


//delte
exports.deleteStudent = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await Student.findOneAndDelete({ id: studentid });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
    res.status(200).json({ message: "Student deleted successfully", student }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteInstructor = async (req, res) => {
    try {
    const { instructorid } = req.params;
    const instructor = await Instructor.findOneAndDelete({ id: instructorid });
    if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
    }
    res.status(200).json({ message: "Instructor deleted successfully", instructor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

