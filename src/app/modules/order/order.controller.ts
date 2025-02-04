import { Request, Response } from "express";
import { OrderServices } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
    try {
        const order = req.body.order;

        // Call service function to send this data
        const result = await OrderServices.createOrderIntoDB(order);

        // Send response correctly
        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
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

export const OrderController = { createOrder };
