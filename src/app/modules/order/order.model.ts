import { model, Schema, Types } from "mongoose";
import { Order } from "./order.interface";

// Define the order schema
const orderSchema = new Schema<Order>(
  {
    userEmail: {
      type: String,
      required: [true, "User email is required"],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // References the Product model
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "progressing", "delivered"], // Keep enum for valid status values
      default: "unpaid", // Default to "unpaid"
      required: [true, "Status is required"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Order model
export const OrderModel = model<Order>("Order", orderSchema);