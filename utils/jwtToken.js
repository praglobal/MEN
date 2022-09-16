// Store Token in Cookie

const sendToken = (user,statusCode,res) =>{
    const Token = user.getJSONToken();
    const options ={
        expiresIn:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 *60 *60 *1000
        ),
        httpOnly:true
    }
    const {password,...others} = user._doc;
    res.status(statusCode).cookie("Token",Token,options).json({
        
        others,Token
    });
}

module.exports = sendToken;