const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const { signUpValidation, validatePassword } = require("../utils/validation")
const { userAuth } = require("../middlewares/auth")
const validator = require("validator")

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {


    try {
        const { firstName, lastName, emailID, password } = req.body

        signUpValidation(req)

        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash)
        // create a new instance of user model
        const user = new User({ firstName, lastName, emailID, password: passwordHash })



        const saveUser = await user.save()

        return res.status(200).json({ message: "User added successfully.", users: saveUser })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ ERROR: err.message })
    }
})


authRouter.post("/login", async (req, res) => {

    const { emailID, password } = req.body
    try {
        const user = await User.findOne({ emailID })
        // console.log(user)
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials." })
        }

        const isPasswordValid = await user.validatePassword(password)


        if (isPasswordValid) {

            const token = await user.getJWT()

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                expires: new Date(Date.now() + 24 * 3600000)

            })

            return res.status(201).json({ message: "Login successfull.", user })
        } else {
            return res.status(404).json({ message: "Invalid Credentials." })

        }


    } catch (err) {
        console.error(err)
        return res.status(500).json({ ERROR: "User failed to Login." })
    }
})

authRouter.post("/logout", async(req, res) => {

    try{
        // const {token} = req.cookies

        res.cookie("token", null, {expires : new Date(Date.now())})
        return res.status(201).json({ message: "Logout successfull." })

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: "Failed to Logout."})
    }
})

authRouter.post("/updatePassword",userAuth, async(req, res) => {

    try{

        // if(!validatePassword){
        //     throw new Error("Invaild Password.")
        // }

        const {oldPassword, newPassword} = req.body;

        if(!newPassword || !validator.isStrongPassword(newPassword)){
            return res.status(400).json({message: "New Password is too weak or missing."})
        }


        const user = req.user
        const passwordHash = user?.password

        const isPasswordValid = await bcrypt.compare(oldPassword, passwordHash)


        if(!isPasswordValid){
            return res.status(400).json({message: "Old Password is Incorrect."})
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = newHashedPassword
        await user.save()

        res.status(200).json({message: "Password update successfully.", user})

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: "Failed to Update the Password."})
    }
})

module.exports =  {authRouter}