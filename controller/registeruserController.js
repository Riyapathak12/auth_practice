// controllers/userController.js

const bcrypt = require('bcrypt');
const {User} = require('../models/user_model'); // Ensure you have the User model imported


// User registration controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("username:",username);
        console.log("password",password);
        console.log("email:",email);
        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        console.log(User);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        console.log(User);  

        res.status(201).json({ message: "User registered successfully", user });
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
}
    

module.exports = {
    registerUser,
};
