const { initializeData } = require("./db/db.connect")

const express = require("express")
const cors = require("cors")
const User = require("./models/user")

const corsOptions = {
    origin: "*",
    credentials: true,
    status: 200
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))


app.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        emailID,
        password
    } = req.body
    try {
        // create a new instance of user model
        const user = new User({firstName, lastName, emailID, password})

        const saveUser = await user.save()

        res.status(200).json({ message: "User added successfully.", users: saveUser })

    } catch (err) {
        res.status(500).json({ ERROR: err.message })
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


