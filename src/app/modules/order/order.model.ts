import { model, Schema } from "mongoose";
import { Order } from "./order.interface";
import validator from "validator";

const orderSchema = new Schema<Order>(
  {
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: (value: number) => Number.isInteger(value),
        message: "Quantity must be a whole number",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
      validate: {
        validator: (value: number) => validator.isFloat(value.toString(), { min: 0 }),
        message: "Total price must be a valid number greater than or equal to 0",
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const OrderModel = model<Order>("Order", orderSchema);
