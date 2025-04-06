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



const getMe = catchAsync(async (req,res) => {
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

  const { userEmail } = decoded; // Get email from body instead of query

  if (!userEmail) {
    throw new AppError(400, "Email extraction failed!");
  }

  const user = await userServices.getMeFromDB(userEmail);

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