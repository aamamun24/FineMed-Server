import { z } from "zod";
import { Types } from "mongoose";

// Create order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    userEmail: z
      .string({
        invalid_type_error: "User email must be a string",
        required_error: "User email is required",
      })
      .email({ message: "Invalid email format" })
      .trim()
      .toLowerCase(),
    products: z.array(z.any(), {
      required_error: "Products array is required",
    }).nonempty({ message: "Products array cannot be empty" }), // Minimal validation
    totalPrice: z
      .number({
        invalid_type_error: "Total price must be a number",
        required_error: "Total price is required",
      })
      .min(0, { message: "Total price cannot be negative" }),
    address: z
      .string({
        invalid_type_error: "Address must be a string",
        required_error: "Address is required",
      })
      .min(1, { message: "Address cannot be empty" }),
    contactNumber: z
      .string({
        invalid_type_error: "Contact number must be a string",
        required_error: "Contact number is required",
      })
      .min(1, { message: "Contact number cannot be empty" }),
    status: z
      .enum(["unpaid", "paid", "progressing", "delivered"], {
        required_error: "Status is required",
        invalid_type_error: "Status must be a valid string",
      })
      .default("unpaid"), // Matches model default
  }),
});

// Update order validation schema (partial updates)
const updateOrderValidationSchema = z.object({
  body: z.object({
    userEmail: z
      .string({
        invalid_type_error: "User email must be a string",
      })
      .email({ message: "Invalid email format" })
      .trim()
      .toLowerCase()
      .optional(),
    products: z.array(z.any()).optional(), // Minimal validation, optional
    totalPrice: z
      .number({
        invalid_type_error: "Total price must be a number",
      })
      .min(0, { message: "Total price cannot be negative" })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be a string",
      })
      .min(1, { message: "Address cannot be empty" })
      .optional(),
    contactNumber: z
      .string({
        invalid_type_error: "Contact number must be a string",
      })
      .min(1, { message: "Contact number cannot be empty" })
      .optional(),
    status: z
      .enum(["unpaid", "paid", "progressing", "delivered"], {
        invalid_type_error: "Status must be a valid string",
      })
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};