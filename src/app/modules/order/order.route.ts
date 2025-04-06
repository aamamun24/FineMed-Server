import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = express.Router();

// Create a new order
router.post("/",validateRequest(OrderValidation.createOrderValidationSchema), auth("admin","customer"), OrderController.createOrder);

// Get all orders
router.get("/",auth("admin"), OrderController.getAllOrders);

// Get a single order by ID
router.get("/:orderId",auth("admin"), OrderController.getSingleOrder);

// Update an order by ID (partial update)
router.patch("/:orderId",validateRequest(OrderValidation.updateOrderValidationSchema),auth("admin"), OrderController.updateOrder);

// Delete an order by ID
router.delete("/:orderId",auth("admin"), OrderController.deleteOrder);

// Calculate total revenue
// router.get("/revenue",auth("admin"), OrderController.getRevenue);

export const OrderRoutes = router;

