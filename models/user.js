const mongoose = require("mongoose")
const validator = require('validator');
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.SECRET_KEY

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        index: true,
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
        enum:{
            values:["Male", "Female", "Others"],
            message: `{VALUE} is incorrect gender.`
        } 

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
// do not use arrow function
userSchema.methods.getJWT = async function() {
    const user = this

    const token = jwt.sign({_id: user._id}, SECRET_KEY, {expiresIn: '1d'})

    return token
}

userSchema.methods.validatePassword = async function(password) {
    const user = this
    const passwordHash = user?.password

    const isPasswordValid = bcrypt.compare(password, passwordHash)

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)