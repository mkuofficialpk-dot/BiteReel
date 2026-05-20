//food.controller.js
const foodModel = require("../models/food.model");
const storageService = require("../services/storage.services");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  );

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "food item created successfully",
    food: foodItem,
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});

  const [likes, saves] = await Promise.all([
    likeModel.find({ user: req.user._id }).select("food"),
    saveModel.find({ user: req.user._id }).select("food"),
  ]);

  const likedSet = new Set(likes.map((l) => l.food.toString()));
  const savedSet = new Set(saves.map((s) => s.food.toString()));

  const enriched = foodItems.map((item) => ({
    ...item.toObject(),
    isLiked: likedSet.has(item._id.toString()),
    isSaved: savedSet.has(item._id.toString()),
  }));

  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems: enriched,
  });
}

async function likeFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
    return res.status(200).json({ message: "Food unliked successfully" });
  }

  const like = await likeModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

  res.status(201).json({ message: "Food liked successfully", like });
}

async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadySaved = await saveModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadySaved) {
    await saveModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
    return res.status(200).json({ message: "Food unsaved successfully" });
  }

  const save = await saveModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });

  res.status(201).json({ message: "Food saved successfully", save });
}

async function getSavedFoods(req, res) {
  const saves = await saveModel.find({ user: req.user._id });
  const foodIds = saves.map((s) => s.food);
  const savedFoods = await foodModel.find({ _id: { $in: foodIds } });

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods,
  });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoods,
};
