//auth.routes.js file

//rout file ma jub bhi hum koi API create karna chata hain ---> to sab sa pahla hama aik router create karna parta ha.

const express = require('express'); // 1st part
const authController = require("../controllers/auth.controller") //3rd part (from 12th part of auth.controller.js file)

const router = express.Router();  // 1st part


//----------------------User Auth API's---------------------------

//To API's hum routes ma banay ga yahan, lakin is API ma jo logic(means callback() function --> jisa uahan hum controller kahta hain) hoga wo hum auth.controller.js ma likhain ga.
// means routes jo hain wo is folder ma hon ga but routes ka jo logic hoga wo controllers folder ma hoga
router.post('/user/register',authController.registerUser)  // 2nd part & 4th part(adding authController.register later)
// ab user ko create karna sa pahla hama user ka aik model create karna para ga, matlab ka user hmara kasa dikha g uski ki kiya properties,field,attributes hongi i.e name, age, email etc --> model ma hum ya likhain ga ka DB ma user kistarhan store hoga 
// or ya sab kuch hum --> models folder ma karna wala hain (user.mode.js)

//API endpoint for Login_user
router.post("/user/login", authController.loginUser) //4th part

//API endpoint for Logout
router.get("/user/logout", authController.logoutUser); //5th part

// -----------------FoodPartner Auth API's----------------------

router.post("/food-partner/register", authController.registerFoodPartner);

router.post("/food-partner/login", authController.loginFoodPartner);

router.get("/food-partner/logout", authController.logoutFoodPartner)



module.exports = router;  // 1st part


