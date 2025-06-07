const express = require("express")
const {userAuth} = require("../middlewares/auth")

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
moudule.express = {profileRouter}