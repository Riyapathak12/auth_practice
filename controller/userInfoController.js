const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 // Ensure your database connection is set up correctly
const {User} = require("../models/user_model"); // Ensure the User model is correctly imported
const express=require('express')
const mysql = require("mysql2");
const {db2}=require('../config/db')


const userInfo= async(req,res)=>{
    try{
        //const user=await User.findByPk(req.user.userId);
        const{email}=req.body;
        const user =await User.findOne({where:{email}})
        console.log(user)
        if(!user)
        {
            return res.status(404).json({message:"user not found"})
        }
    
    res.json({user});

}catch(error){
    console.log("error in fetching info",error);
    return res.status(404).json({message:"user not found"})
}

}
module.exports = {
    userInfo
};
