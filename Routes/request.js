const express = require("express")
const { userAuth } = require("../middlewares/auth")

const requestRouter = express.Router()

requestRouter.post("/connectionRequest", userAuth, async(req, res) => {
    const user = req.user

    res.status(200).json({message: `${user.firstName} sent the connection request.`})
})
module.exports = {requestRouter}