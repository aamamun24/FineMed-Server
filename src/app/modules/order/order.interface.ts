import { Types } from "mongoose";

type TProducts = {
    productId: Types.ObjectId;
    quantity: number;
}[];

export interface Order {
    userEmail: string;
    products: TProducts;
    totalPrice: number;
    address: string;
    contactNumber: string;
    status: "pending" | "processing" | "delivered" | "shipped";
    prescriptionVarified: boolean;
    prescriptionImageLink:string;
    createdAt: Date;
    updatedAt: Date;
    transactionId: string;
}
