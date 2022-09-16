const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandling");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//Admin Add Product
exports.addProduct = catchAsyncError(async(req,res,next)=>{
        req.body.user = req.user.id;
        const productdata = new Product(req.body);
        const savedProduct = await productdata.save();
        res.status(201).json(savedProduct);
   
});

//GET  Product USING Search,Filter,Pagination
exports.getProducts = catchAsyncError(async(req,res,next)=>{
        const resultperPage = 5;
        const productCount = await Product.countDocuments();
        const apifeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultperPage);
        const productData = await apifeature.query;
        res.status(200).json(productData);
});

//GET Single Product
exports.singleProduct = catchAsyncError(async(req,res,next)=>{
    const productData = await Product.findById(req.params.id);
    if(!productData){
        next(new ErrorHandler("Product Not found",404));
    }
        res.status(200).json({productData,productCount});
    
})

//Admin update Product
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    const productId = await Product.findById(req.params.id);
    if(!productId){
        next(new ErrorHandler("Product Not found",404));
    }else{
        const Update = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(Update);
    }
})

//Admin delete Product
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const productId = await Product.findById(req.params.id);
    if(!productId){
        next(new ErrorHandler("Product Not found",404));
    }else{
        const deletePro = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product Deleted");
    }
})

// create Reviwe

exports.addReview = catchAsyncError(async(req,res,next)=>{
    
    const { rating,Comment, productId} = req.body;
    
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        Comment,
    } 
    
    const product= await Product.findById(productId);
    const isreviewd = product.reviews.find((rev)=>rev.user.toString() === req.user._id.toString());

    if(isreviewd){
        product.reviews.forEach(rev =>{
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.Comment = Comment)
            
        })
    }else{
        product.reviews.push(review);
        product.numofReviews = product.reviews.length;
    }

    let avg=0;
    product.reviews.forEach((rev)=>{
        avg = avg + rev.rating;
    })
 
    product.ratings= avg/product.reviews.length;

     await product.save({validateBeforeSave:false});
    res.status(200).json("review added");
    
    
})

//Get all Reviews

exports.getAllReview = catchAsyncError(async(req,res,next)=>{

  const product= await Product.findById(req.query.id);

  

  if(!product){
    next(new ErrorHandler("Product Not found",404));
  }
  res.status(200).json({reviews:product.reviews})
})

//Delete Review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
  const product= await Product.findById(req.query.productId);
  
  if(!product){
    next(new ErrorHandler("Product Not found",404));
  }

  const reviews=product.reviews.filter(
    (rev) =>rev._id.toString() !==req.query.id.toString()
  )

  let avg=0;

    reviews.forEach((rev)=>{
        avg += rev.rating;

    })
   const  ratings= avg/reviews.length; 
   
   const numofReviews= reviews.length;
   await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numofReviews},{new:true});
  res.status(200).json("review Deleted")
})
