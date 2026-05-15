// idher hum server start karain ga

require('dotenv').config();

//this comes from app.js 
const app = require('./src/app');
//here app is just identifire name it does not need to be same as app.js you can have any different name

//this comes from db.js
const connectDB = require('./src/db/db');
//calling the function to connect to the database
connectDB();
//now as soon as you call it and now run the server i.e npx nodemon server.js it will connect to the database and you will see the message "MongoDB connected" in the console, if there is any error it will show you the error message in the console.

//starting a server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
//till now we have created a server and started it on port 3000 but we have not created any route yet so if we try to access localhost:3000 it will give us error.
//we will start over server using commond npx nodemon server.js
//this commond will start the server but if you have made any changes it detects the changes and restart the server with updated code

//we are creating dummy rout in the app.js file to test our server is working or not,see thereA