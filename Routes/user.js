const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const userRouter = express.Router();

const populate_data = ["firstName", "lastName", "photoUrl", "gender", "about", "skills", "age"]

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
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
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

userRouter.get("/feed", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        const skip = (page - 1)*limit

        const connectionRequest = await Connection.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())
        })
        

        const users = await User.find({
           $and:[ 
            {_id: {$nin: Array.from(hideUserFromFeed).map((id) => new ObjectId(id))}}, 
            {_id: {$ne: new ObjectId(loggedInUser._id)}}
        ]

        }).select(populate_data).skip(skip).limit(limit)

        return res.status(201).json({message: "Retrieve all feed.", users})

    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: err.message})
    }
})

module.exports = {userRouter}