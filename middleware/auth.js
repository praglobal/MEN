const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandling");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.isAuthnticateUser = catchAsyncError(async(req,res,next)=>{
    const  { Token }  = req.cookies;
    if(!Token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decodedData = jwt.verify(Token,process.env.JWT_SEC);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizeRoles = (...roles)=>{
    return(req,res,next) =>{
            console.log(roles)
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,403))
        }
        next();
    }
}