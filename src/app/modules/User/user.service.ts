import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import bcrypt from "bcrypt"; // Make sure bcrypt is installed
import config from "../../../config";
const createUserIntoDB = async(payload: TUser) => {
  const newUser = await UserModel.create(payload); 
  if(!newUser){
    throw new AppError(400,"User not registerd! Error occured! ")
  }
  return newUser;
}

const toggleUserStatus = async (userId: string) => {
  const user = await UserModel.findById(userId);
  
  if (!user) {
    throw new AppError(404, "User not found!");
  }

  // Toggle between "active" and "deactivated"
  const newStatus = user.status === "active" ? "deactivated" : "active";
  
  user.status = newStatus;
  await user.save();

  return user;
};


const updateUserPassword = async (
  userEmail: string,
  oldPassword: string,
  newPassword: string
) => {
  // Find user by email instead of ID
  const user = await UserModel.findOne({ email: userEmail }).select("+password");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Check if old password is correct
  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    throw new AppError(401, "Old password is incorrect");
    }
  user.password = newPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  return { message: "Password updated successfully" };
};




const getMeFromDB = async (email: string) => {
  const user = await UserModel.findOne({ email }).select('-password');
  
  if (!user) {
    throw new AppError(404, "User not found!");
  }

  return user;
};

export const userServices = {
  createUserIntoDB,
  toggleUserStatus,
  updateUserPassword,
  getMeFromDB
}
