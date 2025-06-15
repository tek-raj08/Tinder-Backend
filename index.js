const { initializeData } = require("./db/db.connect")
const validator = require('validator');
const { signUpValidation } = require("./utils/validation")
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {userAuth} = require("./middlewares/auth")

const express = require("express")
const cors = require("cors")
const User = require("./models/user");


const app = express()

// app.use(
//     cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))

// app.use(
//     cors({
//     origin: "https://tinder-frontend-feqr.vercel.app",
//     credentials: true
// }))

const allowedOrgins = ["https://tinder-frontend-psi.vercel.app/", "http://localhost:5173"]

app.use(cors({
    oring: function (origin, callback){
        if(!origin || allowedOrgins.includes(origin)){
            return  (callback(null, true))
        }else{
            return callback(new Error("Origin are not allowed by CORS."))
        }
    }
}))

const SECRET_KEY = process.env.SECRET_KEY

app.use(express.json()) // middle aware read json data

app.use(cookieParser())

const {authRouter}  = require("./Routes/auth")
const {profileRouter}  = require("./Routes/profile")
const {requestRouter}  = require("./Routes/request")
const {userRouter} = require("./Routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


app.get("/feed", async (req, res) => {

    try {

        const allUser = await User.find()
        if (allUser.length === 0) {
            res.status(404).json({ message: "Users not found" })
        } else {

            res.status(201).json({ message: "All user retrieve successfully.", users: allUser })
        }

    } catch (err) {
        res.status(500).json({ ERROR: err.message })
    }
})

app.delete("/users", async (req, res) => {
    const userId = req.body.userId
    try {
        const users = await User.findByIdAndDelete(userId)
        res.status(200).json({ message: "User deleted successfully.", users })

    } catch (err) {
        res.status(500).json({ ERROR: "Failed to delete user." })
    }
})

app.post("/users/:userId", async (req, res) => {
    try {
        const user_Id = req.params?.userId.trim()
        // console.log(user_Id)

        const { skills, age, gender, photoUrl, about } = req.body

        if (skills && (!Array.isArray(skills) || skills.length > 4)) {
            return res.status(400).json({ message: "User does not add more than 4 skills." })
        }

        if (age && (isNaN(age) || age < 18)) {
            return res.status(400).json({ message: "Age should be more than 18." })
        }

        if (photoUrl && !validator.isURL(photoUrl)) {
            return res.status(400).json({ message: "Enter valid Photo URL.", photoUrl })
        }


        const ALLOWED_UPDATES = ["skills", "gender", "photoUrl", "about", "age"]

        const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k))

        if (!isUpdateAllowed) {
            return res.status(400).json({ message: "Failed to updated the user's data" })
        }


        const updateUser = await User.findByIdAndUpdate(user_Id, { skills, age, gender, photoUrl, about }, { new: true })
        res.status(201).json({ message: "User updated successfully.", users: updateUser })


    } catch (err) {
        console.error(err)
        res.status(500).json({ ERROR: "Failed to User update." })
    }
})

app.get("/", (req, res) => {

    res.json("Hello Server!")
})


initializeData().then(() => {
    console.log("Connected to Database.");
    app.listen(3000, () => console.log("Server is running on PORT 3000"))
}).catch((err) => {
    console.log("ERROR: Connecting to Database", err)
})


