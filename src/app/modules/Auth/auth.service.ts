import config from "../../../config";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import httpStatus from 'http-status';
import bcrypt from "bcrypt";
import { UserModel } from "../User/user.model";

const loginUserIntoDB = async (payload: TLoginUser) => {
  const { email, phone, password } = payload;

  // Fetch user by email or phone
  const user = email
    ? await UserModel.isUserExistsByEmail(email)
    : await UserModel.isUserExistsByPhone(phone!);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const jwtPayload = {
    userEmail: user.email,
    userPhone: user.phone,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // Verify the refresh token
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, userPhone } = decoded;

  // Check if the user exists using either email or phone
  const user = userEmail
    ? await UserModel.isUserExistsByEmail(userEmail)
    : await UserModel.isUserExistsByPhone(userPhone);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
  }


  const jwtPayload = {
    userEmail: user.email,
    userPhone: user.phone,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUserIntoDB,
  refreshToken,
};