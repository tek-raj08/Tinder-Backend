const jwt = require("jsonwebtoken")
const User = require("../models/user")

const SECRET_KEY = process.env.SECRET_KEY
const userAuth = async(req, res, next) => {

    try{

        const {token} = req.cookies?.token || (req.headers['authorization']?.split(" ")[1])
        if(!token){
            return res.status(404).json({message: "Token is not found."})
        }
    
        const decodedToken = jwt.verify(token, SECRET_KEY)
    
        const {_id} = decodedToken
        const user = await User.findById({_id})
    
        if(!user){
            return res.status(404).json({message: "User not found."})
        }

        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(500).json({ERROR: "Failed to Validate the token."})
    }



}

module.exports = {userAuth}