const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const tokenBlacklist = require("../models/tokenBlacklistModel");

const mongoose = require("mongoose")

exports.validateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");  
  }

  try {
    const blacklistedToken = await tokenBlacklist.findOne({ token });

    if (blacklistedToken) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.clearCookie('token');
    return res.redirect('/login'); 
  }
};


exports.validateAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      console.error("Invalid or missing user ID");
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const admin = await User.findById(userId);
    if (!admin) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (admin.role === "admin") {
      console.log("Admin authenticated");
      return next();
    } else {
      console.error("User is not an admin");
      return res.status(403).json({ message: "Access denied. User is not an admin." });
    }
  } catch (error) {
    console.error("Error in validateAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
