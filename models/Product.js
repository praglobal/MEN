const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim :true
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    price:{
        type:Number,
        maxLength:[8,"Maximum 8 charcter "],
        required:[true,"price is required"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            publicId:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter category"]
    },
    stock:{
        type:String,
        required:[true,"Stock is required"],
        maxlength:[4,"Maximum 4 charcters"]
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {   
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"Users",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            Comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users",
        required:true,
    },
},{timestamp:true});

module.exports = mongoose.model("Products",productSchema);