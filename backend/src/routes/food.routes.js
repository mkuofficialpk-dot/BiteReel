// food.routes.js

const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer"); // express ka server ka sath aik masla ha ka wo by default koi bhi file nahi par sakta chaha wo video,pdf,word,txt etc in masa koi bhi nahi jo frontend sa arahi ha, the solution is using package multer (1)

// upload varaible create karo (2)
const upload = multer({
  storage: multer.memoryStorage(),
});

//API end point for creating food item in the DB
// POST /api/food/ --> now this api should be [protected] why? --> means only food partner should use this to add new food item not normal user. --> will do this by creating a middleware(folder in src) see there auth.middleware.js
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("foodItem"),
  foodController.createFood,
); // ab is ka matlab kiya ha ka pahli hamari request middleware ka pas jay gi, middleware request process kara ga(see by yourself how), then usa forword kara go to controller, matlab ya request ko authenticate karta ha ka eigther the request is from food partner or not if yes then it will add that foodPartner details in the req.body, and farword that request. if not it will directly give an error and return that error, request controller tak jay gi hi nahi
// now taht api is protected

// GET/api/food/ [protected] --> ya foodPartner kaliya nahi ha --> ya user kaliya ha jub user scroll karain gain to jo new videos ain gi un sab ka dat alana kaliya ya wali api ha (simply jitna bhi food items hain un sab ki videos la ka ay gi) --> that means we have to create new middleware
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

module.exports = router;
