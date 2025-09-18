const jwt = require("jsonwebtoken");
const Instructor = require("../Models/Instructor");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Instructormiddleware = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization").replace("Bearer ", "") || req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token not provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const instructorid = decoded?.instructor?.id || decoded?.id;

    const instructor = await Instructor.findById(instructorid).select(
      "-password"
    );

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    req.user = instructor;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = Instructormiddleware;
