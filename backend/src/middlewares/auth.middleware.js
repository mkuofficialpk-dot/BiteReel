//auth.middleware.js
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//middleware for FoodPartner
async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token; //fetching token from cookie from the FoodPartner request(because we know with every reuest the cookies also comes by default)

  // if he don't has any token means un-uthorize access(because every user who is registered/login has the token we see that in auth api's)
  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  // now if token ha then we need to check if this token is valid token or someone made it,
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // if correct will return the food partner id in form of object, because we have set id during creating token in controller see there, if not will give error and that error will be handleld in catch.

    const foodPartner = await foodPartnerModel.findById(decoded.id); // find foodPartner on the basses of id in DB

    if (!foodPartner) {
      return res.status(401).json({
        message: "Unauthorized. Food partners only.",
      });
    }

    req.foodPartner = foodPartner; // in req body we don't have property foodPetner, here we are creating one, and assining that with foodPartner(i.e data fetched from DB)

    next(); // middleware ka bad jis controller par move karna ha the flow will move there, --> ! simply specified controller ma request ko forword kar ga --> processing karna kaliya
  } catch (err) {
    return res.status(401).json({
      // 401 is for un-authorize access
      message: "Invalid token",
    });
  }
}

// middleware for User
async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware //now require this in food.routs.js (to make that api protected)
};
