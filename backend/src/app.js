//app.js file
// idher hum server create karain ga

const express = require("express"); //1st part
const cookieParser = require("cookie-parser"); //6th part (after 8th part in auth.controller.js file) it is middleware
const authRoutes = require("./routes/auth.routes"); //8th part
const foodRputes = require("./routes/food.routes");

//creating server instance
const app = express(); //2nd part

app.use(cookieParser()); //7th part (middleware)
app.use(express.json()); // 5th part (after 2nd part in auth.controller.js file) --> it is middleware
//creating dummy route here
app.get("/", (req, res) => {
  // 4th part
  res.send("Hello World");
});
//now test it in the postman

app.use("/api/auth", authRoutes); //9th part
//yahan par hum na server ko ya bataya ka is application ma kuch authentication related API's exist karti bhi hain ya hum na server ko bataya
// --> /api/auth this is called prefix, yani auth ki koi bhi api ko hama acces karna ha to us sa pahla hama ya prefix lagana hoga

app.use("/api/food", foodRputes);

//as we know here we only create server, we start server in the server.js file ==> so we have to
//export this file to server.js
module.exports = app; // 3rd part
//now require this in server.js
