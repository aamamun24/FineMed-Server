import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image link is required"],
      default: "https://iili.io/35DtmLF.webp",
    },
    brand: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    form: {
      type: String,
      enum: {
        values: ['Tablet', 'Syrup', 'Capsule', 'Injection', 'Ointment'],
        message:
          "Invalid medicine type. Choose from Tablet, Syrup, Capsule, Injection, or Ointment",
      },
      required: [true, "Medicine type is required"],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Antibiotic', 'Painkiller', 'Antacid', 'Antiseptic', 'Antiviral',
          'Antifungal', 'Anti-inflammatory', 'Allergy Relief', 'Cough & Cold',
          'Diabetes', 'Blood Pressure', 'Heart Health', 'Digestive Health'
        ],
        message: "Invalid category for medicine",
      },
      required: [true, "Category is required"],
    },
    simptoms: {
      type: [String],
      required: [true, "Symptoms list is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    prescriptionRequired: {
      type: Boolean,
      required: [true, "Prescription requirement status is required"],
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
      trim: true,
    },
    expiryDate: {
      type: String,
      required: [true, "Expiry date is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<IProduct>("Product", productSchema);
