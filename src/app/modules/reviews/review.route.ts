import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";


const router = express.Router();

router.post("/",auth("customer","admin"), ReviewController.createReview);
router.delete("/:id",auth("admin"), ReviewController.deleteReviewById);
router.get("/", ReviewController.getAllReviews);

export const ReviewRoutes = router;
