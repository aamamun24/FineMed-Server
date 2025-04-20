import { z } from "zod";

const createProductValidation = z.object({
  name: z
    .string({
      required_error: "Product name is required",
    })
    .min(1, "Product name is required")
    .trim(),

  generic: z
    .string({
      required_error: "Product generic name is required",
    })
    .trim(),

  image: z
    .string({
      required_error: "Image link is required",
    })
    .url("Invalid image URL"),

  brand: z
    .string({
      required_error: "Brand name is required",
    })
    .min(1, "Brand name is required")
    .trim(),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative("Price cannot be negative"),

  form: z.enum(["Tablet", "Syrup", "Capsule", "Injection", "Ointment"], {
    required_error: "Medicine form is required",
    invalid_type_error: "Invalid medicine form",
  }),

  category: z.enum([
    "Antibiotic",
    "Painkiller",
    "Antacid",
    "Antiseptic",
    "Antiviral",
    "Antifungal",
    "Anti-inflammatory",
    "Allergy Relief",
    "Cough & Cold",
    "Diabetes",
    "Blood Pressure",
    "Heart Health",
    "Digestive Health",
  ], {
    required_error: "Category is required",
    invalid_type_error: "Invalid category",
  }),

  simptoms: z
    .array(z.string())
    .min(1, "At least one symptom is required")
    .nonempty("Symptoms list is required"),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description is required")
    .trim(),

  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),

  prescriptionRequired: z.boolean({
    required_error: "Prescription requirement is required",
  }),

  manufacturer: z
    .string({
      required_error: "Manufacturer is required",
    })
    .min(1, "Manufacturer is required")
    .trim(),

  expiryDate: z
    .string({
      required_error: "Expiry date is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Expiry date must be a valid date string",
    }),
});
const updateProductValidation = z.object({
    name: z.string().trim().optional(),
    image: z.string().url("Invalid image URL").optional(),
    brand: z.string().trim().optional(),
    price: z.number().nonnegative("Price cannot be negative").optional(),
    form: z.enum(["Tablet", "Syrup", "Capsule", "Injection", "Ointment"]).optional(),
    category: z.enum([
      "Antibiotic",
      "Painkiller",
      "Antacid",
      "Antiseptic",
      "Antiviral",
      "Antifungal",
      "Anti-inflammatory",
      "Allergy Relief",
      "Cough & Cold",
      "Diabetes",
      "Blood Pressure",
      "Heart Health",
      "Digestive Health",
    ]).optional(),
    simptoms: z.array(z.string()).optional(),
    generic: z
    .string({
      required_error: "Product generic name is required",
    })
    .trim().optional(),
    description: z.string().trim().optional(),
    quantity: z.number().int("Quantity must be an integer").nonnegative("Quantity cannot be negative").optional(),
    prescriptionRequired: z.boolean().optional(),
    manufacturer: z.string().trim().optional(),
    expiryDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Expiry date must be a valid date string",
      })
      .optional(),
  });


export const ProductValidations = {
    createProductValidation,
    updateProductValidation
}