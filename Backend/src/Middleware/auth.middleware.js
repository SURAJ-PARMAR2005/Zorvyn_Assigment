const jwt = require('jsonwebtoken');
const userModel = require("../Models/users.models");
require("dotenv").config();


async function isUser(req,res,next) {
    try {
            const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "No token , please register or login first."
        })
    }

    //now token to h 

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user  = await userModel.findById(decoded.id);

    if(!user.isActive){
        return res.status(403).json({
            message : "User deactivated",
        })
    }

    req.user = user;
    next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server Error",
        })
    }
}



module.exports = isUser;
