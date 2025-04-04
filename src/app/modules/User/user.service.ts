import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async(payload: TUser) => {
  const newUser = await UserModel.create(payload); 
  if(!newUser){
    throw new AppError(400,"User not registerd! Error occured! ")
  }
  return newUser;
}


export const userServices = {
  createUserIntoDB
}
