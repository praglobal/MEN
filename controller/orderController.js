const Product = require("../models/Product");
const mongoose = require("mongoose")
const ErrorHandler = require("../utils/errorHandling");
const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../models/Order");
const user = require("../models/User");


//Create Orders
exports.addOrders = catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id
    });
    res.status(201).json(order);
});

//get Logged in user Orders
exports.getMyOrders = catchAsyncError(async(req,res,next)=>{
    
   const orders = await Order.find({user:req.user._id});

   res.status(200).json(orders);
})

//Get orders -- Admin
exports.getOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")
    console.log("order =>",order.user)
    if(!order){
        next(new ErrorHandler("Order Not found",404));
    }
    res.status(200).json(order);
})

//Get All Orders - Admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalamount=0;
    orders.forEach((order)=>{
        totalamount +=order.totalPrice;
    })
    res.status(200).json({orders,totalamount});
})

//update Order status - Admin

exports.updateOrderStatus = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("You have aleardy upadted status"));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have aleardy upadted status"));
    }

    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity,next);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json("Order Delievered");
})

async function updateStock(id,quantity,next){
    const product = await Product.findById(id);
    console.log("Before quantity minus stock",product.stock);
    product.stock -= quantity; 
     if( product.stock < 0 ){
        return next(new ErrorHandler("Stock is not available"));
    }

    await product.save();
}



//Delete Orders --Admin

exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const orders= await Order.findById(req.params.id);

    if(!orders){
        return next(new ErrorHandler("You have aleardy upadted status"));
    }

    await orders.remove();
    res.status(200).json("Order Deleted");
})