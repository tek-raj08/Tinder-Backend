const { initializeData } = require("./db/db.connect")
const validator = require('validator');
const { signUpValidation } = require("./utils/validationSignUp")
const bcrypt = require("bcryptjs");

const express = require("express")
const cors = require("cors")
const User = require("./models/user")

const corsOptions = {
    origin: "*",
    credentials: true,
    status: 200
}

const app = express()

app.use(express.json()) // middle aware read json data
app.use(cors(corsOptions))


app.post("/signup", async (req, res) => {


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

app.post("/login", async (req, res) => {

    const { emailID, password } = req.body
    try {
        const user = await User.findOne({ emailID })
        // console.log(user)
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials." })
        }

        const isPasswordValid = bcrypt.compare(password, user?.password)


        if (isPasswordValid) {
            return res.status(201).json({ message: "Login successfull." })
        } else {
            return res.status(404).json({ message: "Invalid Credentials." })

        }


    } catch (err) {
        console.error(err)
        return res.status(500).json({ ERROR: "User failed to Login." })
    }
})

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


