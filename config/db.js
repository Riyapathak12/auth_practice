const mysql = require("mysql2");
const express=require('express')



const app = express()
app.use(express.json());
const db2 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "node_auth",
  });
  
  db2.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      return;
    }
    console.log("Connected to MySQL database.");
  });
  module.exports = {
    db2,
};
  