// debugger.js file

//in this file we will connect to the database and export the connection
//idher hum basically logic likhain ga lakin idher ki chizon ko use karna kaliya hum call karain ga server.js file ma.

const mongoose = require("mongoose");

const dns = require('dns')
dns.setServers(["8.8.8.8", "1.1.1.1"]);

//connecting to the database
//here we write the code that how over server will connect to the database.
function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI) // see in .env 
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}
//now we have created a funtion for connecting to database but the server will not connect to the database until we call this function in the server.js file, so we have to export this function and call it in the server.js file
module.exports = connectDB;
