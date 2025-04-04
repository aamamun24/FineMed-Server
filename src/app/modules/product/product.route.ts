import express from "express";
import auth from "../../middlewares/auth";
import { ProductController } from "./product.controller";
const router = express.Router();

router.post("/",auth("admin"), ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:productId", ProductController.getSingleProduct);
router.patch("/:productId", auth("admin"), ProductController.updateProduct);
router.delete("/:productId", auth("admin"), ProductController.deleteProduct);

export const ProductRoutes = router;
