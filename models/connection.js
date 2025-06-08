const mongoose = require("mongoose")

const connectionSchema = new mongoose.Schema({
     
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    status: {
        type: String,
        required: true,
        enum: {
            values:["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type.`
        } 
        
    }
},
{
    timestamps: true
})
// for optimaization // compounding index
connectionSchema.index({fromUserId: 1, toUserId: 1})

 connectionSchema.pre("save", function(next) {
    
    // check if the fromUserID and toUserID is same
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send connection request to yourself.")
    }

    next()
})

const Connection = mongoose.model("Connection", connectionSchema)

module.exports = Connection