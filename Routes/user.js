const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connection");

const userRouter = express.Router();

const populate_data = ["firstName", "lastName", "photoUrl", "gender", "about", "skills"]

userRouter.get("/user/requests", userAuth, async(req, res) => {

    try{

        const loggedInUser = req.user;

        const connectionRequest = await Connection.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])

        res.status(200).json({message: "Retrieve all the connection request.", connectionRequest})

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: err.message})
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;

        const connectionRequest  = await Connection.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", populate_data).populate("toUserId", populate_data)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id = loggedInUser._id){
                return row.toUserId
            }

            return row.fromUserId
        })

        return res.status(200).json({message: "Retrieve all connections.", data})

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: err.message})
    }
})

module.exports = {userRouter}