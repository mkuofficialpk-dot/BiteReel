//food-partner.routes.js
const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// /api/food-partner/me  — must be ABOVE /:id so Express doesn't treat "me" as an id
router.get("/me", authMiddleware.authFoodPartnerMiddleware, foodPartnerController.getCurrentFoodPartner);

// /api/food-partner/:id
router.get("/:id", authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;