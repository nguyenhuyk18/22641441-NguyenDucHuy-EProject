const express = require("express");
const OrderController = require("../controllers/orderController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const orderController = new OrderController();

// router.post("/", isAuthenticated, orderController.createOrder);
router.post("/", isAuthenticated, orderController.getAllOrder);
// router.get("/", isAuthenticated, orderController.getOrders);


module.exports = router;
