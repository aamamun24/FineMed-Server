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
  const user = await UserModel.findOne({ email: userEmail }).select("+password");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // // Log details for debugging
  // console.log("userEmail:", userEmail);
  // console.log("oldPassword (raw):", JSON.stringify(oldPassword)); // Show exact string
  // console.log("user.password (hashed):", user.password);
  // console.log("oldPassword length:", oldPassword.length);
  // console.log("user.password length:", user.password.length);

  // Verify password
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


// New service function to update user data (name, email)
const updateUserData = async (userEmail: string, updates: Partial<TUser>) => {
  const user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Update only the provided fields (name, email)
  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;

  await user.save();
  return user;
};

export const userServices = {
  createUserIntoDB,
  toggleUserStatus,
  updateUserPassword,
  getMeFromDB,
  updateUserData
}
