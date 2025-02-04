import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import { Error } from "mongoose";

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
        if (err instanceof Error.ValidationError) {
            const errors: ValidationErrors = {};

            Object.keys(err.errors).forEach((key) => {
                const errorDetail = err.errors[key];
                errors[key] = {
                    message: errorDetail.message,
                    name: errorDetail.name,
                    properties: errorDetail.properties,
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

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Something went wrong",
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
            error: err instanceof Error ? err.message : "Something went wrong",
        });
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
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const updatedData = req.body;

        const updatedProduct = await ProductServices.updateProductInDB(productId, updatedData);

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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const result = await ProductServices.deleteProductFromDB(productId);

        if (!result) {
            return res.status(404).json({
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
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};

export const ProductController = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };
