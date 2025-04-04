import { Types } from "mongoose";

export interface Order{
    userId: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
