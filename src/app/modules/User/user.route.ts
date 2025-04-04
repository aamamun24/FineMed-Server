import { userController } from "./user.controller";
import express from 'express';
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserValidationSchema),
  userController.createUser,
);

export const UserRoutes = router;
