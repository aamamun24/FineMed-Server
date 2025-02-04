import { Types } from "mongoose";

export interface Order{
    email: string;
    product: Types.ObjectId; // Correct type for ObjectId reference
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
