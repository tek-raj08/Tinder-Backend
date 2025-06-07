const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 50,
        required: true,
    },
    lastName: {
        type: String,
      
    },
    emailID: {
        type: String,
        lowercase:true,
        trim: true,
        required:true,
        unique:true


    },
    password: {
        type: String,
        required:true
    },
    age: {
        type: Number,
        min: 18,
        

    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]

    },
    photoUrl: {
        type: String,
    },
    about: {
        type:String
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)