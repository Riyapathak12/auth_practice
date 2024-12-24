const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 // Ensure your database connection is set up correctly
const {User} = require("../models/user_model"); // Ensure the User model is correctly imported
const express=require('express')
const mysql = require("mysql2");
const {db2}=require('../config/db')

const userRetrival = async (req, res) => {
    try {
      const limit = req.params['limit']
      const page = req.params['page']
      const offset = (page-1)*10
      const users= await User.findAndCountAll({
        limit:parseInt['limit'],
        offset:parseInt['offset']

      })
      if(users.rows.length==0)
      {
       return  res.status(404).json({message:"user not found"})

      }
      //send paginated response
      res.json({
        users:users.rows
        
        

      })
      
     
     
    } catch (error) {
      console.error("Error in fetching info", error);
      return res.status(500).json({ message: "Error in fetching user information" });
    }
  }
  module.exports = {
    userRetrival
};
