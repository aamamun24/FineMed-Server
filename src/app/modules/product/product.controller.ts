import { Request, Response } from "express";
import { ProductServices } from "./product.service";





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

    } catch (err: any) {
        console.error(err);

        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            let errors: Record<string, any> = {};

            Object.keys(err.errors).forEach((key) => {
                errors[key] = {
                    message: err.errors[key].message,
                    name: err.errors[key].name,
                    properties: err.errors[key].properties,
                };
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: {
                    name: "ValidationError",
                    errors,
                },
            });
        }

        // Generic error handling
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message || "Something went wrong",
        });
    }
};

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await ProductServices.getAllProductsFromDB(req);  // Pass the `req` object here

        res.status(200).json({
            success: true,
            message: "Products are retrieved successfully.",
            data: result,
        });

    } catch (err: any) {
        console.error(err);

        let errorResponse: Record<string, any> = {
            message: "Internal Server Error",
            success: false,
            error: {
                name: err.name || "UnknownError",
                message: err.message || "Something went wrong",
            },
            stack: err.stack || "No stack trace available",
        };

        res.status(500).json(errorResponse);
    }
};


const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;

        const result = await ProductServices.getSingleProductFromDB(productId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                error: {
                    name: "NotFoundError",
                    message: `No product found with ID: ${productId}`,
                },
                stack: new Error().stack,
            });
        }

        res.status(200).json({
            success: true,
            message: "Single product retrieved successfully.",
            data: result,
        });

    } catch (err: any) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: {
                name: err.name || "UnknownError",
                message: err.message || "Something went wrong",
                stack: err.stack,
            },
        });
    }
};


const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;  // Extract productId from the URL parameter
        const updatedData = req.body;  // Extract the updated product details from the request body

        const updatedProduct = await ProductServices.updateProductInDB(productId, updatedData);  // Call service to update product

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message || "Something went wrong",
            stack: err.stack || "No stack trace available",
        });
    }
};



const deleteProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        // Call service function to delete the product
        const result = await ProductServices.deleteProductFromDB(productId);

        // Check if the product exists
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: {},
            });
        }

        // Return success message if product is deleted
        res.status(200).json({
            success: true,
            message: "Bicycle deleted successfully",
            data: {},
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message || "Something went wrong",
        });
    }
};




export const ProductController = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };