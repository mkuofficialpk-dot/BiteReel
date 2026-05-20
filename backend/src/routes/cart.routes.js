const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.authUserMiddleware, cartController.getCart);
router.post("/add", authMiddleware.authUserMiddleware, cartController.addToCart);
router.post("/remove", authMiddleware.authUserMiddleware, cartController.removeFromCart);
router.delete("/clear", authMiddleware.authUserMiddleware, cartController.clearCart);

module.exports = router;
