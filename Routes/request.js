const express = require("express")
const { userAuth } = require("../middlewares/auth")
const Connection = require("../models/connection")
const User = require("../models/user")

const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user?._id
        const toUserId = req.params.toUserId
        const status = req.params.status
      
        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status", status})
        }

        const toUser = await User.findById(toUserId)

        if(!toUser){
            return res.status(404).json({message: "User not found."})
        }

        // find the existing connection request

        const existingConnection = await Connection.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId}
            ]
        })

        if(existingConnection){
            return res.status(400).json({message: "Connection request already exist."})
        }

        const connectionRequest = new Connection({
            fromUserId,
            toUserId,
            status
        })

        const savedConnection = await connectionRequest.save()

        return res.status(200).json({ message: "Connection request sent successfully.", savedConnection })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ ERROR: err.message })
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"]

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status.")
        }

        const connectionRequest = await Connection.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            throw new Error("Connection not found.")
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        return res.status(201).json({message: "Connection request " + status, data})

    }catch(err){
        console.error(err)
        return res.status(500).json({message: err.message})
    }
})
module.exports = { requestRouter }