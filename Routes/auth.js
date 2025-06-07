const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const { signUpValidation } = require("../utils/validationSignUp")

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

            res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600000)})
            return res.status(201).json({ message: "Login successfull." })
        } else {
            return res.status(404).json({ message: "Invalid Credentials." })

        }


    } catch (err) {
        console.error(err)
        return res.status(500).json({ ERROR: "User failed to Login." })
    }
})


module.exports =  {authRouter}