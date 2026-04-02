const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("DB CONNECTED");
    }
    catch(error){
        console.log("error occured while connecting to mongoDb",error);

    }
}


module.exports = connectDB;