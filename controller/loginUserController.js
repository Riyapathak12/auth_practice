const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 // Ensure your database connection is set up correctly
const {User} = require("../models/user_model"); // Ensure the User model is correctly imported
const express=require('express')
const mysql = require("mysql2");
const {db2}=require('../config/db')

// const app = express()
// app.use(express.json());
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root@123",
//     database: "node_auth",
//   });
  
//   db.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL: ", err);
//       return;
//     }
//     console.log("Connected to MySQL database.");
//   });
  



// Login controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens
        const accessToken = jwt.sign({ userId: user.id },  "674jkhl", {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ userId: user.id }, "674jkhlgh", {
            expiresIn: "1d",
        });

        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        // Store the refresh token in the database
        const insertQuery = "INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)";
        db2.query(insertQuery, [user.id, refreshToken], (err) => {
            if (err) {
                console.error("Failed to store refresh token:", err);
                return res.status(500).json({ error: "Failed to store refresh token." });
            }
            res.json({ accessToken, refreshToken });
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginUser,
};
