import { model, Schema } from "mongoose";
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
          _id: false, // 👈 this prevents automatic _id (not working and not causing any prblm also)
          type: Schema.Types.ObjectId,
          ref: "Product",
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
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
      required: [true, "Status is required"],
    },
    transactionId: {
      type: String,
      default: "TRANS_pending",
    },
    prescriptionVarified: {
      type: Boolean
    },
    prescriptionImageLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const OrderModel = model<Order>("Order", orderSchema);
