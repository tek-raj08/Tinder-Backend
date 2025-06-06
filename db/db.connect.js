const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeData = async() => {
    try{
       await mongoose.connect(mongoUri)
       console.log("Connected to Database.")

    }catch(err){
        console.log("ERROR: Connecting to Database", err)
    }
}

module.exports = {initializeData}