const jwt = require("jsonwebtoken");
const  Student = require("../Models/Student");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token and remove "Bearer " if present
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token not provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const studentid = decoded?.student?.id || decoded?.id;
    const user = await Student.findById(studentid);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
