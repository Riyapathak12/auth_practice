const express=require('express')

//const User = require('./models/user_model'); // Adjust the path to match your directory structure
const { User } = require('./models/user_model');

const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const mysql = require("mysql2");
const { registerUser } = require('./controller/registeruserController.js');
const{loginUser}=require('./controller/loginUserController.js');
const {db2}=require('./config/db.js')
const{userInfo}=require('./controller/userInfoController.js')
const{logout}=require('./controller/logoutUserController.js')
const{userRetrival}=require('./controller/userRetriveController.js')

const app = express()
app.use(express.json());
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
  



// //user registration
// // User registration route
// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         console.log("username:",username);
//         console.log("password",password);
//         console.log("email:",email);
//         // Validate required fields
//         if (!username || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user in the database
//         console.log(User);
//         const user = await User.create({
//             username,
//             email,
//             password: hashedPassword,
//         });

//         res.status(201).json({ message: "User registered successfully", user });
        
//     } catch (error) {
//         console.error("Error registering user:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// //user login
// app.post("/login",async(req,res)=>{
//     try{
//         const{email,password}=req.body;
//         const user =await User.findOne({where:{email}})
//         if(!user){
//             return res.status(400).json({message:"invalid credintials"})
//         }
//         const isPasswordMatch =await bcrypt.compare(password,user.password);
//         if(!isPasswordMatch){
//             return res.status(400).json({message:"invalid credintials"})

//         }
//         const token =jwt.sign({userId:user.id},"674jkhl",{
//             expiresIn:"1h"
            
         
//         })
//         const token_refresh =jwt.sign({userId:user.id},"674jkhlgh",{
//             expiresIn:"1d"
            
         
//         })

//         console.log("the actual token is:"+token)
//         console.log("the refresh token is:"+token_refresh)
//         const insertQuery = "INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)";
//         db2.query(insertQuery, [user.id, token_refresh], (err) => {
//           if (err) {
//             return res.status(500).json({ error: "Failed to store refresh token." });
//           }
//         res.json({token,token_refresh});
//     })

//        // localStorage.getItem("authtoken",token)
//        //const token_storage = localStorage.setItem("authtoken")
       
       

//     }catch(error)
//     {
//         console.log("Error in loggining in:",error)
//         res.status(500).json({message:"server error"})
//     }
   
    
  
// })
//middleware to verify jwt token 
function verifyToken(req, res, next) {
     const token = req.header("Authorization");
   // const token_refresh=req.header("Authorization")
   // console.log("token to be used:", token);
    //console.log("token to be used:", token_refresh);

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(
            token.split(" ")[1],
            "674jkhl"
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error in verifying token:", error);

        // Make sure this is the only response sent when the token is invalid
        return res.status(401).json({ message: "Invalid token" });
    }
}

//     // protected route to get info
//     app.get("/userInfo",verifyToken,async(req,res)=>{
//         try{
//             //const user=await User.findByPk(req.user.userId);
//             const{email}=req.body;
//             const user =await User.findOne({where:{email}})
            
//             if(!user)
//             {
//                 return res.status(404).json({message:"user not found"})
//             }
        
//         res.json({user});

//     }catch(error){
//         console.log("error in fetching info",error);
//         return res.status(404).json({message:"user not found"})
//     }

//     }) ;

//      // unprotected route to get info
// app.get("/users/:page/:limit", async (req, res) => {
//     try {
//       // Extract `page` and `limit` from query parameters
//     //  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
//     const page =req.params['page']
//     const limit=req.params['limit']
  
//       // Calculate offset
//       const offset = (page - 1) * limit;
  
//       // Fetch users with pagination
//       const users = await User.findAndCountAll({
//         limit: parseInt(limit),
//         offset: parseInt(offset),
//       });
  
//       if (!users.rows || users.rows.length === 0) {
//         return res.status(404).json({ message: "Users not found" });
//       }
  
//       // Send paginated response
//       res.json({
//         totalItems: users.count,
//         totalPages: Math.ceil(users.count / limit),
//         currentPage: parseInt(page),
//         users: users.rows,
//       });
//     } catch (error) {
//       console.error("Error in fetching info", error);
//       return res.status(500).json({ message: "Error in fetching user information" });
//     }
 // });
    // Refresh token route
// app.post("/token", (req, res) => {
//     const { user_id ,token_refresh} = req.body;
//     if (!user_id) return res.status(401).json({ error: "user not found." });
  
//     // Check if the refresh token exists in the database
//     const query = "SELECT * FROM tokens WHERE user_id = ?";
//     db.query(query, [user_id], (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: "Database error." });
//       }
  
//       if (results.length === 0) {
//         return res.status(403).json({ error: "Invalid id." });
//       }
  
//       jwt.verify(token_refresh, "674jkhlgh", (err, user) => {
//         if (err) return res.status(403).json({ error: "Invalid refresh token." });
  
//         const accessToken = jwt.sign({userId:user.id},"674jkhl",{
//             expiresIn:"1h"
//         });
//         res.json({ accessToken });
//       });
//     });
//   });
  
//     // Logout route
// app.post("/logout", (req, res) => {
  
//     const { token_refresh } = req.body;
//     if (!token_refresh) return res.status(401).json({ error: "Refresh token required." });
  
//     // Delete refresh token from the database
//     const query = "DELETE FROM tokens WHERE refresh_token = ?";
//     db.query(query, [token_refresh], (err) => {
//       if (err) {
//         return res.status(500).json({ error: "Database error." });
//       }
  
//       res.status(200).json({ message: "Logged out successfully." });
//     });
//   });
//retrive  users

  app.post('/registerc', registerUser);
  app.post('/loginUserc',loginUser);
  app.get("/userInfoc",verifyToken,userInfo)
  app.get("/userInfoupc",userInfo)
  app.post("/logoutuserc",logout)
  app.get("/usersc/:page/:limit",userRetrival)
  //app.post('/logoutc',logout);
    //starting the server
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    });

    
 
   
        
