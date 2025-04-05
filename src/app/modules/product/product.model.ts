import { model, Schema } from "mongoose";
import { Product, BicycleType } from "./product.interface";
import validator from "validator";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    validate: {
      validator: (value: string) => validator.isLength(value, { min: 3, max: 50 }),
      message: "Product name must be between 3 and 50 characters",
    },
  },
  image: {
    type: String,
    required: [true, "Image link is required"],
    default:"https://iili.io/35DtmLF.webp"
  },
  brand: {
    type: String,
    required: [true, "Brand name is required"],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlphanumeric(value.replace(/\s/g, '')), // Allow spaces but ensure alphanumeric
      message: "Brand name should contain only letters and numbers",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: (value: number) => validator.isFloat(value.toString(), { min: 0 }),
      message: "Price must be a valid number greater than or equal to 0",
    },
  },
  type: {
    type: String,
    enum: {
      values: Object.values(BicycleType),
      message: "Invalid bicycle type. Choose from Mountain, Road, Hybrid, BMX, or Electric",
    },
    required: [true, "Bicycle type is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    validate: {
      validator: (value: string) => validator.isLength(value, { min: 10, max: 500 }),
      message: "Description must be between 10 and 500 characters",
    },
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    validate: {
      validator: (value: number) => Number.isInteger(value),
      message: "Quantity must be a whole number",
    },
  },
  inStock: {
    type: Boolean,
    required: [true, "In-stock status is required"],
    default: true
  }
},
{
  timestamps: true,
});

export const ProductModel = model<Product>("Product", productSchema);
