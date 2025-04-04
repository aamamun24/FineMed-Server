import express from "express";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

// Create a new order
router.post("/", auth("admin","customer"), OrderController.createOrder);

// Get all orders
router.get("/",auth("admin"), OrderController.getAllOrders);

// Get a single order by ID
router.get("/:orderId",auth("admin"), OrderController.getSingleOrder);

// Update an order by ID (partial update)
router.patch("/:orderId",auth("admin","customer"), OrderController.updateOrder);

// Delete an order by ID
router.delete("/:orderId",auth("admin","customer"), OrderController.deleteOrder);

// Calculate total revenue
// router.get("/revenue",auth("admin"), OrderController.getRevenue);

export const OrderRoutes = router;

