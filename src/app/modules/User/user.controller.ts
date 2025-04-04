import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body as TUser;
  const newUser = await userServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED, 
    success: true,
    message: "User created successfully", 
    data: newUser,
  });
});

const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updatedUser = await userServices.toggleUserStatus(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status updated to ${updatedUser.status}`,
    data: updatedUser,
  });
});

const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError(400, "Both old and new passwords are required");
  }

  const result = await userServices.updateUserPassword(userId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const userController = {
  createUser,
  toggleUserStatus,
  updatePassword
};