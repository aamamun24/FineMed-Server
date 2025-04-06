import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { verifyToken } from "../Auth/auth.utils";
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
  const { oldPassword, newPassword } = req.body;
  const { userEmail } = req.params; // Extract userEmail from URL params


  if (!oldPassword || !newPassword) {
    throw new AppError(400, "Both old and new passwords are required");
  }

  // Extract token from Authorization header
  const token = req.headers.authorization;


  if (!token) {
    throw new AppError(401, "No access-token provided");
  }

  // Verify token using the utility function
  let decoded: JwtPayload;
  try {
    decoded = verifyToken(token, config.jwt_access_secret as string);
  } catch (error) {
    throw new AppError(401, "Invalid or expired token");
  }

  // Compare userEmail from params with decoded userEmail
  if (decoded.userEmail !== userEmail) {
    throw new AppError(403, "Forbidden: You cannot change another user's password");
  }

  // Pass authenticated userEmail to service
  const result = await userServices.updateUserPassword(
    decoded.userEmail,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});



const getMe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body; // Get email from body instead of query

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const user = await userServices.getMeFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data retrieved successfully",
    data: user,
  });
});

export const userController = {
  createUser,
  toggleUserStatus,
  updatePassword,
  getMe
};