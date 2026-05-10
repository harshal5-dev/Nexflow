import * as z from 'zod';

const createMemberSchema = z.object({
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
});

export { createMemberSchema };
