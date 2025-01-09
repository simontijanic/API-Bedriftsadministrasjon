const mongoose = require("mongoose")
const User = require("../models/userModel")

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to MongoDB");
    } catch(err){
        console.error("Database error", err)
    }
}

module.exports = connectToDatabase