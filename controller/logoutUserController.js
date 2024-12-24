const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 // Ensure your database connection is set up correctly
const {User} = require("../models/user_model"); // Ensure the User model is correctly imported
const express=require('express')
const mysql = require("mysql2");
const {db2}=require('../config/db')


const logout= async(req, res) => {
  
    const { token_refresh } = req.body;
    if (!token_refresh) return res.status(401).json({ error: "Refresh token required." });
  
    // Delete refresh token from the database
    const query = "DELETE FROM tokens WHERE refresh_token = ?";
    db2.query(query, [token_refresh], (err) => {
      if (err) {
        return res.status(500).json({ error: "Database error." });
      }
  
      res.status(200).json({ message: "Logged out successfully." });
    });
}
module.exports = {
    logout,
};