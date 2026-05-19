//food-partner.routes.js
const express = require("express");
const multer = require("multer");
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// /api/food-partner/me  — must be ABOVE /:id so Express doesn't treat "me" as an id
router.get("/me", authMiddleware.authFoodPartnerMiddleware, foodPartnerController.getCurrentFoodPartner);
router.patch("/me", authMiddleware.authFoodPartnerMiddleware, upload.single("image"), foodPartnerController.updateCurrentFoodPartner);

// /api/food-partner/:id
router.get("/:id", authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;