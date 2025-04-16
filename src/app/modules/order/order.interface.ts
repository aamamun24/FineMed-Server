import { Types } from "mongoose";

export interface IOrder {
    userEmail: string;
    products: {
      productId: Types.ObjectId;
      quantity: number;
    }[];
    totalPrice: number;
    address: string;
    contactNumber: string;
    status: "pending" | "processing" | "delivered" | "shipped";
    prescriptionRequired: boolean; // ✅ always required
    prescriptionVarified?: boolean; // ✅ optional
    prescriptionImageLink?: string; // ✅ optional
    createdAt: Date;
    updatedAt: Date;
    transactionId: string;
  }
  