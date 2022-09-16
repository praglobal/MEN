const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandling");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");

//Register User

exports.Register = catchAsyncError(async (req, res, next) => {
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar:{
                    publicId:"Example of public id",
                    url:"example of url"
                }
    });
  
    sendToken(user, 201, res);
  });

// User Login

exports.Login = catchAsyncError(async(req,res,next)=>{

    const userData = await User.findOne({email:req.body.email}).select("+password");
    if(!userData){
        return next(new ErrorHandler("Invalid Email",401))
    }else{
        const validPassword = await bcrypt.compare(req.body.password,userData.password);
        console.log(validPassword)
        if(!validPassword){
            return next(new ErrorHandler("Invalid Password"));
        }
        const token = userData.getJSONToken();
    }
    sendToken(userData,200,res);
})

//User Logout
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("Token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({message:"Logout successFully"})
});

//Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("Invalid Email"));
    }

    //Get Reset Token
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validationBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/users/password/reset/${resetToken}`;

    const message = `Your reset password Token is :-- \n\n ${resetPasswordUrl} \n\n If you have not requested than igonre it`;
    console.log("email",user.email)
    try{
        await sendEmail({
            
            email:user.email,
            subject:`Password Recovery`,
            message,
        });
        
        res.status(200).json({
            success:true,
            message:`Email send ${user.email} successFully`,
        });
    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({ validationBeforeSave:false});

        return next(new ErrorHandler(err.message,500));
    }
})

//ReSet Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Invalid reset password Token",403));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't matched",403));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendToken(user,200,res);
})

//User Details 

exports.getUserDetalis = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
})

//Update Password Details 

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById({_id:req.user.id}).select("+password")
    // console.log(user)
    const validPassword = await bcrypt.compare(req.body.oldPassword,user.password);

    if(!validPassword){
        return next(new ErrorHandler("Old Password is Incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password is not matched",400))
    }
   
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
})


//update User Profile

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newData ={
        name:req.body.name,
        email:req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,newData,{new:true});

    res.status(200).json(user)
})

//Get all user Details -- (Admin)

exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json(users);
})

//Get single user Details -- (admin)

exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.findById(req.params.id);

    if(!users){
        return next(ErrorHandler("User Not Found",403));
    }
    res.status(200).json(users);
})

//Update user Role --Admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{

    const userData = await User.findById(req.params.id);

    if(!userData){
        return next(ErrorHandler("User not found",400));
    }
    const newData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(userData,newData,{new:true});

    res.status(200).json(user)
})

//Delete  --Admin
exports.deleteProfileAdmin = catchAsyncError(async(req,res,next)=>{

    const userData=await User.findById(req.params.id);
    
    if(!userData){
        return next(ErrorHandler("User not found",400));
    }

    await User.findByIdAndDelete(userData);

    res.status(200).json("User Deleted");
})