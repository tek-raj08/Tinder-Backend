const {initializeData} = require("./db/db.connect")

initializeData()

const express = require("express")
const cors  = require("cors")

const corsOptions = {
    origin: "*",
    credentials: true,
    status: 200
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

app.get("/user/:id/:name/:gender", (req, res) =>{
    // console.log(req.query)
    console.log(req.params)
    res.send({firstName: "Tek", lastName: "Rana"})
})

app.get("/", (req, res) => {

    res.json("Hello Server!")
})

app.listen(3000, () => console.log("Server is running on PORT 3000"))