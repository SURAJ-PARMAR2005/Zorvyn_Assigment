const userModel = require("../Models/users.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require("dotenv").config();


async function getAllUsers(req,res) {
    try {
        const Users = await userModel.find({_id : {$ne : req.user._id}});
        
        return res.status(201).json({
            message : "users fetched perfectlly",
            Users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "server error",
        })
    }
}

async function getUserById(req,res){
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if(!user){
            return res.status(401).json({
                message : "User not found",
            })
        }

        return res.status(200).json({
            message : "User found successfully",
            user
        })
          
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "server error",
        })
    }
}

async function assignRole(req,res){
    try {
        const id = req.params.id;
        const {role} = req.body;

        const trueRoles  = ['viewer','analyst','admin'];

        if(!trueRoles.includes(role)){
            return res.status(401).json({
                message : "Invalid Role",
            })
        }

        //we can also handle the case that admin cant change its own role , but here i am allowing it 

        const user = await userModel.findByIdAndUpdate(id,{
                role
            },
        { new: true, runValidators: true }
        )
        
        if(!user){
            return res.status(401).json({
                message : "user Not found"
            })
        }

        return res.status(200).json({
            message : "Role Updated Successfully",
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server error",
        })
    }
}

async function updateStatus(req,res){
try {
    const id = req.params.id;
    const {isActive} = req.body;

    const user = await userModel.findByIdAndUpdate(id,{isActive},{new:true});
    if(!user){
        return res.status(401).json({
            message : "user not found",
        })
    };
    res.status(200).json({
      message: "status Updated Successfully",
      user,
    });

    
} catch (error) {
    console.log(error);
    return res.status(500).json({
        message : "server error"
    })
}
}

async function deleteUser(req,res){
    try {
    const id =req.params.id;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = { getAllUsers,getUserById,assignRole,updateStatus,deleteUser }