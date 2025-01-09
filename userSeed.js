const User = require("./models/userModel")
const bcrypt = require("bcryptjs")
const connectToDatabase = require("./controllers/databaseController")

require('dotenv').config()

const userRegister = async () => {
    try {
        console.log("Connecting to database")
        await connectToDatabase()

        const hashPassword = await bcrypt.hash("Admin", 10)
        const newUser = new User({
            name: "Geir Hilmersen",
            email: "geir@afk.no",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()
        console.log("User registered successfully")
    } catch (err) {
        console.error("Error in userSeed.js", err)
    }
}

userRegister();