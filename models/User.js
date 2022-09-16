const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      maxLength: [30, "Name cannot be exceed 30 charcters"],
      minLength: [4, "Name shuold have 4 charcters"],
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
      unique: true,
      validators: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter Password"],
      minLength: [8, "Password should be Minimum 8 charcter"],
      select: false,
    },
    avatar: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken : String,
    resetPasswordExpires:Date
  },
  { timestamps: true }
);

//Encrypt Password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//Access Token 

userSchema.methods.getJSONToken = function (){
  return jwt.sign({id:this._id},process.env.JWT_SEC,
    {expiresIn:process.env.JWT_EXPIRES});
}

//Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//resetPasswordToken

  userSchema.methods.getResetPasswordToken = async function(){

    // Generating Token 
    const resetToken =  crypto.randomBytes(20).toString("hex");

    //Hasing and Adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 

    return resetToken
  }
 
module.exports =  mongoose.model("Users",userSchema);
