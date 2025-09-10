const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const AdminRouter = require('./Router/AdminRouter');
const CertificateRouter = require("./Router/CertificateRouter");
const CourseRouter = require("./Router/CourseRouter");
const LectureRouter = require("./Router/LectureRouter");
const EnrollmentRouter = require("./Router/EnrollmentRouter");
const StudentRouter = require("./Router/StudentRouter");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Routes
app.use('/api/admin', AdminRouter);
app.use("/api/certificate", CertificateRouter);
app.use("/api/course", CourseRouter);
app.use("/api/lecture", LectureRouter);
app.use("/api/enrollment", EnrollmentRouter);
app.use("/api/student", StudentRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
