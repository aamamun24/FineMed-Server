import { userController } from "./user.controller";
import express from 'express';
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserValidationSchema),
  userController.createUser,
);


router.get('/me',auth("admin","customer"), userController.getMe);

router.patch("/:userId/toggle-status",auth("admin"), userController.toggleUserStatus);
router.patch('/update-password',auth("admin","customer"), userController.updatePassword);

export const UserRoutes = router;
