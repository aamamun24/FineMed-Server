import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import bcrypt from "bcrypt"; // Make sure bcrypt is installed
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
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    throw new AppError(401, "Old password is incorrect");
  }

  // Update password and passwordChangedAt
  user.password = newPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  return { message: "Password updated successfully" };
};



export const userServices = {
  createUserIntoDB,
  toggleUserStatus,
  updateUserPassword
}
