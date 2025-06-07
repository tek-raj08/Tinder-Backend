const mongoose = require("mongoose")
const validator = require('validator');

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
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter valid email ID." + value)
            }
        }


    },
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password." + value)
            }
        }
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