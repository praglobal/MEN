const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const DBconnect = require("./DB/connection");

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

const cookieParser = require("cookie-parser");
const errormiddleware = require("./middleware/error");

// Handling Uncaught Error


process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down due to unhandled uncaught Exception`);
    process.exit(1);    
})

dotenv.config();
app.use(express.json());
app.use(cookieParser());
DBconnect();

app.use("/api/product",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);

app.use(errormiddleware);
const server = app.listen(5000,()=>{
    try{
        console.log(`Server is liting http://localhost/5000`);
    }catch(err){
        console.log(err);
    }
})

//unhandle Promise Rejection 
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down due to unhandled promise rejection `);

    server.close(()=>{
        process.exit(1);
    });
});