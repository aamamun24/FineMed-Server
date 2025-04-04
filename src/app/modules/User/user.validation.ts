import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' })
    .trim()
    .toLowerCase(), // Ensures email is normalized

  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password cannot be more than 20 characters' }),

  passwordChangedAt: z
    .date({
      invalid_type_error: 'PasswordChangedAt must be a valid date',
    })
    .optional(), // Optional field

  role: z.string({
    invalid_type_error: 'Role must be a string',
    required_error: 'Role is required',
  })
  .refine((val) => ['admin', 'customer'].includes(val), {
    message: 'Role must be either "admin" or "customer"',
  })
  .default('customer'),
  isDeleted: z
    .boolean({
      invalid_type_error: 'isDeleted must be a boolean',
    })
    .default(false),
  })
});


export const UserValidation = {
  createUserValidationSchema,
};
