import * as z from 'zod';

const signUpUserSchema = z.object({
  firstName: z
    .string({ error: 'First name is required' })
    .trim()
    .min(2, { error: 'First name must be at least 2 characters long' })
    .max(50, { error: 'First name must be at most 50 characters long' }),
  lastName: z.optional(
    z
      .string()
      .trim()
      .max(50, { error: 'Last name must be at most 50 characters long' })
  ),
  emailId: z
    .email({ error: 'Invalid email address' })
    .trim()
    .lowercase()
    .max(100, { error: 'Email must be at most 100 characters long' }),
  password: z
    .string({ error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters long' })
    .max(15, { error: 'Password must be at most 15 characters long' }),
});

const loginUserSchema = z.object({
  emailId: z
    .email({ error: 'Invalid email address' })
    .trim()
    .lowercase()
    .max(100, { error: 'Email must be at most 100 characters long' }),
  password: z
    .string({ error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters long' })
    .max(15, { error: 'Password must be at most 15 characters long' }),
});

const forgotPasswordSchema = z.object({
  emailId: z
    .email({ error: 'Invalid email address' })
    .trim()
    .lowercase()
    .max(100, { error: 'Email must be at most 100 characters long' }),
});

const resetPasswordSchema = z.object({
  emailId: z
    .email({ error: 'Invalid email address' })
    .trim()
    .lowercase()
    .max(100, { error: 'Email must be at most 100 characters long' }),
  otp: z
    .string({ error: 'OTP is required' })
    .length(6, { error: 'OTP must be exactly 6 characters long' }),
  password: z
    .string({ error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters long' })
    .max(15, { error: 'Password must be at most 15 characters long' }),
});

export {
  signUpUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
