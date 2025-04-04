import { model, Schema, Types } from "mongoose";
import validator from "validator";

type TProducts = {
  productId: Types.ObjectId;
  quantity: number;
}[];

interface Order {
  userId: Types.ObjectId;
  products: TProducts;
  totalPrice: number;
  status: "in-progress" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    products: [
      {
        productId: {
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
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
      validate: {
        validator: (value: number) => validator.isFloat(value.toString(), { min: 0 }),
        message: "Total price must be a valid number greater than or equal to 0",
      },
    },
    status: {
      type: String,
      enum: ["in-progress", "delivered"],
      default: "in-progress",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const OrderModel = model<Order>("Order", orderSchema);
