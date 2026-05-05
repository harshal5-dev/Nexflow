import * as z from 'zod';

const updateTenantSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, { error: 'Name must be at least 2 characters long' })
    .max(100, { error: 'Name must be at most 100 characters long' }),
  description: z.optional(
    z
      .string()
      .trim()
      .max(250, { error: 'Description must be at most 250 characters long' })
  ),
});

export { updateTenantSchema };
