//food_partner.controller.js
const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

async function getFoodPartnerById(req, res) {
  const foodPartnerId = req.params.id;

  const foodPartner = await foodPartnerModel.findById(foodPartnerId);

  const foodItemByFoodPartner = await foodModel.find({
    foodPartner: foodPartnerId,
  });

  if (!foodPartner) {
    return res.status(404).json({ message: "Food Partner not found" });
  }

  res.status(200).json({
    message: "Food Partner retrieved successfully",
    foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemByFoodPartner,
    }
  });
}

async function getCurrentFoodPartner(req, res) {
  const foodPartnerId = req.foodPartner._id;

  const foodPartner = await foodPartnerModel.findById(foodPartnerId);
  const foodItems = await foodModel.find({ foodPartner: foodPartnerId });

  if (!foodPartner) {
    return res.status(404).json({ message: "Food Partner not found" });
  }

  res.status(200).json({
    message: "Current Food Partner retrieved successfully",
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems,
    },
  });
}

async function updateCurrentFoodPartner(req, res) {
  const foodPartnerId = req.foodPartner._id;

  const updates = {};
  const allowed = ["name", "address", "contactName", "phone"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      updates[field] = req.body[field];
    }
  });

  if (req.file) {
    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid()
    );
    updates.image = fileUploadResult.url;
  }

  const foodPartner = await foodPartnerModel.findByIdAndUpdate(
    foodPartnerId,
    updates,
    { new: true }
  );

  if (!foodPartner) {
    return res.status(404).json({ message: "Food Partner not found" });
  }

  res.status(200).json({
    message: "Food Partner updated successfully",
    foodPartner: foodPartner.toObject(),
  });
}

module.exports = {
  getFoodPartnerById,
  getCurrentFoodPartner,
  updateCurrentFoodPartner,
};
