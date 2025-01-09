const User = require("./models/userModel")
const bcrypt = require("bcryptjs")
const connectToDatabase = require("./controllers/databaseController")

require('dotenv').config()

const userRegister = async () => {
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("simo", 10)
        const newUser = new User({
            name: "Simon",
            email: "simon@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()
    } catch(err) {
        console.error("Error in userSeed.js", err)
    }
}

//userRegister();