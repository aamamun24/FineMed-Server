import { Types } from "mongoose";
type TProducts = {
    productId: Types.ObjectId,
    quantity: number
}[];

export interface Order{
    userId: Types.ObjectId;
    products: TProducts;
    quantity: number;
    totalPrice: number;
    status: 'in-progress' | 'delivered';
    createdAt: Date;
    updatedAt: Date;
}
