const User = require("../models/userModel")

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const {epost, password} = req.body
    
    if (epost && password) {

        const user = await User.findOne({email: epost})

        if (!user) {
            console.error("Invalid user");
            return res.redirect("/login");
        }
        
        const bcryptPassword = await bcrypt.compare(password, user.password);
        
        if (!bcryptPassword) {
            console.error("Invalid username or password");
            return res.redirect("/login");
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Include role
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
          );
      
          
        res.cookie("token", token, {
            httpOnly: true,
        })

        res.redirect("/");
    } else {
        return console.error("No username & a\oasswird")
    }
}