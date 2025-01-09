const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.injectUserData = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decodedToken.userId);

      if (user) {
        res.locals.user = user; 
        res.locals.isAuthenticated = true; 
        res.locals.role = user.role;
      }
    }

    next();
  } catch (error) {
    console.error("Error in user data middleware:", error);
    next();
  }
};