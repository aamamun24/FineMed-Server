import mongoose from "mongoose";
import { Product } from "./product.interface";
import { ProductModel } from "./product.model";


const createProductIntoDB = async(product: Product)=>{
    const result = await ProductModel.create(product);
    return result;
}


const getAllProductsFromDB = async()=>{
    const result = await ProductModel.find();
    return result;
}


const getSingleProductFromDB = async (productId: string) => {

    const result = await ProductModel.findOne({ _id: new mongoose.Types.ObjectId(productId) });

        return result;
};





export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB

}
