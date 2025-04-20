import { z } from "zod";

// Create order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    userEmail: z
      .string({ required_error: "User email is required" })
      .email({ message: "Invalid email format" })
      .trim()
      .toLowerCase(),

    userName: z
      .string({ required_error: "User name is required" })
      .trim(),

    products: z
      .array(z.any(), { required_error: "Products array is required" })
      .nonempty({ message: "Products array cannot be empty" }),

    totalPrice: z
      .number({ required_error: "Total price is required" })
      .min(0, { message: "Total price cannot be negative" }),

    address: z
      .string({ required_error: "Address is required" })
      .min(1, { message: "Address cannot be empty" }),

    contactNumber: z
      .string({ required_error: "Contact number is required" })
      .min(1, { message: "Contact number cannot be empty" }),

    status: z.enum(["pending", "processing", "shipped", "delivered"]).default("pending"),

  }),
});


// Update order validation schema (partial)
const updateOrderValidationSchema = z.object({
  body: z.object({
    userEmail: z.string().email().trim().toLowerCase().optional(),
    userName: z.string().trim().optional(),
    products: z.array(z.any()).optional(),
    totalPrice: z.number().min(0).optional(),
    address: z.string().min(1).optional(),
    contactNumber: z.string().min(1).optional(),
    status: z.enum(["pending", "processing", "shipped", "delivered"]).optional(),
    transactionId: z.string().optional(),
    prescriptionRequired: z.boolean().optional(), // optional here since PATCH
    prescriptionVarified: z.boolean().optional(),
    prescriptionImageLink: z.string().optional(),
  }),
});


export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
