import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    userEmail: {
      type: String,
      required: [true, "User email is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    products: [
      {
        productId: {
          _id: false,
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
    paymentMethod: {
      type: String,
      required: [true, "Payment Method is required"],
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
      type: String
    },
    prescriptionRequired: {
      type: Boolean,
      default: false
    },
    prescriptionVarified: {
      type: Boolean,
      default: false
    },
    prescriptionImageLink: {
      type: String
    },
  },
  { timestamps: true }
);



export const OrderModel = model<IOrder>("Order", orderSchema);
