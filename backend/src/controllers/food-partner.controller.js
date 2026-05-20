//food_partner.controller.js
const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const cartModel = require("../models/cart.model");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

async function getFoodPartnerById(req, res) {
  const foodPartnerId = req.params.id;

  const foodPartner = await foodPartnerModel.findById(foodPartnerId);

  if (!foodPartner) {
    return res.status(404).json({ message: "Food Partner not found" });
  }

  const foodItemByFoodPartner = await foodModel
    .find({ foodPartner: foodPartnerId })
    .populate("foodPartner", "name image");

  const userId = req.user?._id;
  let likedSet = new Set();
  let savedSet = new Set();
  let cartSet = new Set();

  if (userId) {
    const [likes, saves, cart] = await Promise.all([
      likeModel.find({ user: userId }).select("food"),
      saveModel.find({ user: userId }).select("food"),
      cartModel.findOne({ user: userId }).select("items.food"),
    ]);
    likedSet = new Set(likes.map((l) => String(l.food)));
    savedSet = new Set(saves.map((s) => String(s.food)));
    if (cart) cartSet = new Set(cart.items.map((i) => String(i.food)));
  }

  const foodItemsWithFlags = foodItemByFoodPartner.map((f) => ({
    ...f.toObject(),
    isLiked: likedSet.has(String(f._id)),
    isSaved: savedSet.has(String(f._id)),
    isInCart: cartSet.has(String(f._id)),
  }));

  res.status(200).json({
    message: "Food Partner retrieved successfully",
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems: foodItemsWithFlags,
    },
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
