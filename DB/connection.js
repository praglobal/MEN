const mongoose = require("mongoose");

const DBconnect =() =>{

    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Backend is Running..")
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = DBconnect;