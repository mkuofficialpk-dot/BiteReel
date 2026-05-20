const cartModel = require("../models/cart.model");

async function getCart(req, res) {
  const cart = await cartModel.findOne({ user: req.user._id }).populate({
    path: "items.food",
    select: "name video price description foodPartner",
    populate: { path: "foodPartner", select: "name" },
  });

  res.status(200).json({
    message: "Cart retrieved successfully",
    items: cart ? cart.items : [],
  });
}

async function addToCart(req, res) {
  const { foodId } = req.body;

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({ user: req.user._id, items: [] });
  }

  const exists = cart.items.some((i) => i.food.toString() === foodId);
  if (!exists) {
    cart.items.push({ food: foodId });
    await cart.save();
  }

  res.status(200).json({ message: "Added to cart" });
}

async function removeFromCart(req, res) {
  const { foodId } = req.body;

  await cartModel.updateOne(
    { user: req.user._id },
    { $pull: { items: { food: foodId } } }
  );

  res.status(200).json({ message: "Removed from cart" });
}

async function clearCart(req, res) {
  await cartModel.updateOne(
    { user: req.user._id },
    { $set: { items: [] } }
  );

  res.status(200).json({ message: "Cart cleared" });
}

module.exports = { getCart, addToCart, removeFromCart, clearCart };
