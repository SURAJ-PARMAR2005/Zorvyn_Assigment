const userModel = require("../Models/users.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require("dotenv").config();

async function register(req,res) {
   try {
     const {name,email,password,role} = req.body;
    //  console.log(req.body);

    const isAlreadyUser = await userModel.findOne(
       {email}
    );

    if(isAlreadyUser){
        return res.status(400).json({
            message : "you are already a user"
        })
    }

    // const hashedPassword = bcrypt.hash(password,12);

    const user = await userModel.create({
        name,
        email,
        password,
        role
    });

    const token = jwt.sign({ id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" });

    // i am not implementing the refresh token and accesstoken authentication here cause this is a assigment , but i do know how to do that 

    res.cookie("token",token,{
        httpOnly : true,
        secure : false ,// i will make it true in production
        sameSite : "strict"
    })

    return res.status(201).json({
        message: "User registered Successfully",
        user
    })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : "Server error",
    })
   }
}


async function login(req,res) {
    try {
        const {email,password} = req.body;

        const user = await userModel.findOne(
          {email}
        );
        if(!user){
            return res.status(401).json({
                message : "You have not registred please register first"
            })
        }

        if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({
                message : "Password didnt match"
            })
        }

        const token  = jwt.sign({id : user._id,role : user.role},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        )

        res.cookie("token",token,{
            httpOnly : true,
            secure : false,
            sameSite : "strict"
        })
        
        return res.status(200).json({
            message: "login successfull",
            user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        })
    }
}

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


module.exports  = {register,login,getAllUsers,getUserById,assignRole};