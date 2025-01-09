const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
    token: String,
    invalidatedAt: Date  
})

const tokenBlacklist = mongoose.model("Blacklist", blackListSchema);

module.exports = tokenBlacklist;
