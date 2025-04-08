import { Types } from "mongoose";

// Define TProducts type for the products array
type TProducts = {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  
  // Define the Order interface
  export interface Order {
    userEmail: string;
    products: TProducts;
    totalPrice: number;
    address: string;
    contactNumber: string;
    status: "unpaid" | "paid" | "progressing" | "delivered" | "pending";
    createdAt: Date;
    updatedAt: Date;
    transactionId : string;
  }
