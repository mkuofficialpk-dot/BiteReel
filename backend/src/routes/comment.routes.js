const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

router.get("/:foodId", authUserMiddleware, commentController.getComments);
router.post("/:foodId", authUserMiddleware, commentController.addComment);
router.delete("/:commentId", authUserMiddleware, commentController.deleteComment);

module.exports = router;
