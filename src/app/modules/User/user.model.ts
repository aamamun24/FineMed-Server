import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../../config";
import { IUserModel, TUser } from "./user.interface";

// Define the Mongoose schema
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // Document context
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Define static methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select("+password"); // 'this' refers to UserModel
};
userSchema.statics.isUserExistsByPhone = async function (phone: string) {
  return await this.findOne({ phone }).select("+password"); // 'this' refers to UserModel
};

// Export the Mongoose model
export const UserModel = model<TUser, IUserModel>("User", userSchema);