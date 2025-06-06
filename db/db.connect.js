const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeData = async() => {
    
       await mongoose.connect(mongoUri)  
}

module.exports = {initializeData}