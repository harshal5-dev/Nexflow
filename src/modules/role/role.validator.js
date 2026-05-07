import * as z from 'zod';

const createRoleSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, { error: 'Name must be at least 2 characters long' })
    .max(50, { error: 'Name must be at most 50 characters long' }),
  description: z.optional(
    z
      .string()
      .trim()
      .max(50, { error: 'Description must be at most 50 characters long' })
  ),
  permissions: z.array(
    z
      .string()
      .trim()
      .max(50, { error: 'Permission must be at most 50 characters long' })
  ),
});

export { createRoleSchema };
