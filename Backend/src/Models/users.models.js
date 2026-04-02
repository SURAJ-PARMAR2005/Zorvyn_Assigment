const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    email : {
        type : String,
        required : true,
        unique : true   
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
    },
    role : {
        type : String,
        enum : ["viewer","analyst","admin"],
        default : "viewer"
    },
    isActive :{
        type : Boolean,
        default : true
    }
},{timestamps:true}
)

userSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,12);
})


const userModel = mongoose.model("User",userSchema);

module.exports = userModel;