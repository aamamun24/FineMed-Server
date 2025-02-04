import { Request } from "express";
import mongoose from "mongoose";
import { Product } from "./product.interface";
import { ProductModel } from "./product.model";


const createProductIntoDB = async (product: Product) => {
    return await ProductModel.create(product);
};

const getAllProductsFromDB = async (req: Request) => {
    const { searchTerm } = req.query; // Extract searchTerm from query parameters

    let filter = {}; // Default: No filtering, return all products

    if (searchTerm) {
        const regex = new RegExp(searchTerm as string, "i"); // Case-insensitive regex for searching
        filter = {
            $or: [
                { name: regex },
                { brand: regex },
                { type: regex }
            ]
        };
    }

    return ProductModel.find(filter);
};

const getSingleProductFromDB = async (productId: string) => {
    return await ProductModel.findOne({ _id: new mongoose.Types.ObjectId(productId) });
};

const updateProductInDB = async (productId: string, updatedData: Partial<Product>) => {
    return await ProductModel.findByIdAndUpdate(
        productId,
        { $set: updatedData },
        { new: true } // This option returns the updated document
    );
};

const deleteProductFromDB = async (productId: string) => {
    return await ProductModel.findByIdAndDelete(productId);
};

export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    updateProductInDB,
    deleteProductFromDB
};
