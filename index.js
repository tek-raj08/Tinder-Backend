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

app.use(express.json()) // middle aware read json data
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

app.get("/feed", async(req, res) => {

    try{
        
        const allUser = await User.find()
        if(allUser.length === 0){
            res.status(404).json({message: "Users not found"})
        }else{

            res.status(201).json({message: "All user retrieve successfully.", users: allUser})
        }

    }catch(err){
        res.status(500).json({ERROR: err.message})
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


