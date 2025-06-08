const express = require("express")
const {userAuth} = require("../middlewares/auth")
const User = require("../models/user")
const { validateProfileData } = require("../utils/validation")

const profileRouter = express.Router()

profileRouter.get("/profile", userAuth, async(req, res) => {

    try{

        const user  = req.user
        res.status(200).json({message: "User found successfully.", user})
        // console.log("Decoded userName:", userData)
    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: "Failed to get profile."})
    }
})

profileRouter.post("/profile/edit",userAuth, async(req, res) => {

    try{

        if(!validateProfileData(req)){
            throw new Error("Invalid Edit Profile.")
        }

        const user = req.user
        // console.log(user)

        Object.keys(req.body).forEach((k) => user[k] = req.body[k])
        const saveUser = await user.save()
        
        // const updateUser = await User.findByIdAndUpdate(userId, updateData, {new: true})

        res.status(201).json({message: `${saveUser.firstName} your profile edit successfully.`, saveUser})

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: err.message})
    }
})

module.exports = {profileRouter}