import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
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

export const userController = {
  createUser,
};