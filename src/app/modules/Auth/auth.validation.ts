import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          invalid_type_error: 'Email must be a string',
        })
        .email({ message: 'Invalid email format' })
        .trim()
        .toLowerCase()
        .optional(),
      phone: z
        .string({
          invalid_type_error: 'Phone must be a string',
        })
        .length(11, { message: 'Phone number must be exactly 11 digits long' })
        .regex(/^01\d{9}$/, { message: 'Phone number must start with "01" and be 11 digits long' })
        .trim()
        .optional(),
      password: z
        .string({
          invalid_type_error: 'Password must be a string',
          required_error: 'Password is required',
        })
        .min(6, { message: 'Password must be at least 6 characters long' }),
    })
    .refine(
      (data) => (data.email && !data.phone) || (!data.email && data.phone),
      {
        message: 'Exactly one of email or phone must be provided',
        path: [], // Error at the object level
      }
    ),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          invalid_type_error: 'Email must be a string',
        })
        .email({ message: 'Invalid email format' })
        .trim()
        .toLowerCase()
        .optional(),
      phone: z
        .string({
          invalid_type_error: 'Phone must be a string',
        })
        .length(11, { message: 'Phone number must be exactly 11 digits long' })
        .regex(/^01\d{9}$/, { message: 'Phone number must start with "01" and be 11 digits long' })
        .trim()
        .optional(),
      oldPassword: z
        .string({
          invalid_type_error: 'Old password must be a string',
          required_error: 'Old password is required',
        })
        .min(6, { message: 'Old password must be at least 6 characters long' }),
      newPassword: z
        .string({
          invalid_type_error: 'New password must be a string',
          required_error: 'New password is required',
        })
        .min(6, { message: 'New password must be at least 6 characters long' })
        .max(20, { message: 'New password cannot be more than 20 characters' }),
    })
    .refine(
      (data) => (data.email && !data.phone) || (!data.email && data.phone),
      {
        message: 'Exactly one of email or phone must be provided',
        path: [],
      }
    ),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};