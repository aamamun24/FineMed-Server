import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import mongoose from "mongoose"; // ✅ Import mongoose for error handling

// Define a type for validation errors
type ValidationErrors = Record<string, { message: string; name: string; properties: unknown }>;

const createProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body.product;

        // Call service function to send this data
        const result = await ProductServices.createProductIntoDB(product);

        // Send response correctly
        res.status(201).json({
            success: true,
            message: "Product is created successfully.",
            data: result,
        });

    } catch (err) {
        console.log('error',err);


        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err 
        });
    }
};



const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await ProductServices.getAllProductsFromDB(req);

        res.status(200).json({
            success: true,
            message: "Products are retrieved successfully.",
            data: result,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err
        });
    }
};

const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) { // ✅ Validate ObjectId
             res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const result = await ProductServices.getSingleProductFromDB(productId);

        if (!result) {
             res.status(404).json({
                success: false,
                message: "Product not found",
                error: {
                    name: "NotFoundError",
                    message: `No product found with ID: ${productId}`,
                },
            });
        }

        res.status(200).json({
            success: true,
            message: "Single product retrieved successfully.",
            data: result,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err 
        });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) { // ✅ Validate ObjectId
             res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const updatedData = req.body;

        const updatedProduct = await ProductServices.updateProductInDB(productId, updatedData);

        if (!updatedProduct) {
             res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err 
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) { // ✅ Validate ObjectId
             res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const result = await ProductServices.deleteProductFromDB(productId);

        if (!result) {
             res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err 
        });
    }
};

export const ProductController = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };
