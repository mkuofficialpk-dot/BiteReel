//food.controller.js
const foodModel = require("../models/food.model");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

//controller for creating food item, will contains(video,name,discription), can be added only by the foodPartner
async function createFood(req, res) {
  //hum file ko upload kar raha hain imageKit ma , result ma hama aik url mila ga us video ka to access now us URL ko hum na DB ma store karna ha taka hum feature ma access kar pain
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid(),
  );

  //creating food item
  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id, // is sa pata chala ga ka kis foodPartner na fooditem create kiya ha
  });

  // 201 when creating new resource
  res.status(201).json({
    message: "food item created successfully",
    food: foodItem,
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});

  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

module.exports = {
  createFood,
  getFoodItems,
};
