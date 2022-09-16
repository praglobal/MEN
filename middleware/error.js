const ErrorHandler = require("../utils/errorHandling");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";
    console.log("called",err.message)

    //wrong Id error 
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //E11000 error
    if(err.code === E11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        // console.log(Object.keys(err.keyValue)),
        err = new ErrorHandler(message, 400)
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web Token is invalid`;
        err=new ErrorHandler(message,400);
    }

    //JWT Expired Token
    if(err.name === "TokenExpiredError"){
        const message = `Json web toke is expired`;
        err = new ErrorHandler(message,400);
    }
    
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}

