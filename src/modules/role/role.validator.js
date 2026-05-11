import * as z from 'zod';

const manageRoleSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, { error: 'Name must be at least 2 characters long' })
    .max(50, { error: 'Name must be at most 50 characters long' }),
  description: z.optional(
    z
      .string()
      .trim()
      .max(250, { error: 'Description must be at most 50 characters long' })
  ),
  permissions: z
    .array(
      z
        .string()
        .trim()
        .max(50, { error: 'Permission must be at most 50 characters long' })
    )
    .min(1, { error: 'At least one permission is required' }),
});

export { manageRoleSchema };
