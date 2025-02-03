import { Request, Response } from "express";
import { ProductServices } from "./product.service";





const createProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body.product;

        // Call service function to send this data
        const result = await ProductServices.createProductIntoDB(product);

        // Send response correctly
        res.status(200).json({
            success: true,
            message: "Product is created successfully.",
            data: result,
        });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: err,
            });
        }
};



export const ProductController = { createProduct };
