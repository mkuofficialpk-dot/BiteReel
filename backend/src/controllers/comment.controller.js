const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");

async function getComments(req, res) {
  const { foodId } = req.params;
  const comments = await commentModel
    .find({ food: foodId })
    .populate("user", "fullName")
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ comments });
}

async function addComment(req, res) {
  const { foodId } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  const comment = await commentModel.create({
    user: req.user._id,
    food: foodId,
    text: text.trim(),
  });

  await foodModel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

  const populated = await comment.populate("user", "fullName");
  res.status(201).json({ comment: populated });
}

async function deleteComment(req, res) {
  const { commentId } = req.params;
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (String(comment.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not your comment" });
  }

  await comment.deleteOne();
  await foodModel.findByIdAndUpdate(comment.food, {
    $inc: { commentCount: -1 },
  });

  res.status(200).json({ message: "Comment deleted" });
}

module.exports = { getComments, addComment, deleteComment };
