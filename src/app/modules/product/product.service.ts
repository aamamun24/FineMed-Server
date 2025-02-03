import { Request } from "express";
import mongoose from "mongoose";
import { Product } from "./product.interface";
import { ProductModel } from "./product.model";


const createProductIntoDB = async(product: Product)=>{
    const result = await ProductModel.create(product);
    return result;
}


const getAllProductsFromDB = async (req: Request) => {
    const { searchTerm } = req.query;  // Extract searchTerm from query parameters

    let filter = {};  // Default: No filtering, return all products

    if (searchTerm) {
        const regex = new RegExp(searchTerm as string, "i");  // Case-insensitive regex for searching
        filter = {
            $or: [
                { name: regex },
                { brand: regex },
                { type: regex }
            ]
        };
    }

    return ProductModel.find(filter);  // Return the result directly
};



const getSingleProductFromDB = async (productId: string) => {
    const result = await ProductModel.findOne({ _id: new mongoose.Types.ObjectId(productId) });
    return result;
};



const updateProductInDB = async (productId: string, updatedData: any) => {
    try {
        // Find the product by ID and update it
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: updatedData },
            { new: true }  // This option returns the updated document
        );

        return updatedProduct;  // Return the updated product
    } catch (err) {
        console.error(err);
        throw new Error("Failed to update product");
    }
};


const deleteProductFromDB = async (productId: string) => {
    try {
        // Find and delete the product by its ID
        const result = await ProductModel.findByIdAndDelete(productId);
        return result;
    } catch (err) {
        throw new Error("Error deleting product");
    }
};





export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    updateProductInDB,
    deleteProductFromDB

}
