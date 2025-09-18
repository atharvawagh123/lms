const jwt = require("jsonwebtoken");
const  Admin = require("../Models/Admin");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token and remove "Bearer " if present
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
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

    // Validate token payload
    const adminId = decoded?.admin?.id || decoded?.id; 
    if (!adminId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Check if user exists
    const user = await Admin.findById(adminId); 
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("Authenticated User:", user);

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
