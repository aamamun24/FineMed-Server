/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser extends Document {
  email: string;
  name: string,
  password: string;
  passwordChangedAt?: Date;
  role: "admin" | "customer";
  isDeleted: boolean;
}

// Define the statics interface for the model
export interface IUserModel extends Model<TUser> {
  // Static method
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Instance methods (if needed)
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;