import { Request } from "express";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Product } from "./product.interface";
import { ProductModel } from "./product.model";


const createProductIntoDB = async (product: Product) => {
    return await ProductModel.create(product);
};


// &filter=Giant&sortBy=price&sortOrder=asc&page=2&limit=10&fields=name,brand,price
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    try {
        const productsQuery = new QueryBuilder(ProductModel.find(), query)
            .search(["name", "description", "brand"])
            .filter()
            .sort()
            .paginate()
            .fields();

        const result = await productsQuery.modelQuery.exec(); // Execute the query
        return result;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new AppError(400,"Failed to fetch products");
    }
};

export default getAllProductsFromDB;


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
