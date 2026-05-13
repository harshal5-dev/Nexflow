import * as z from 'zod';

const manageProjectSchema = z.object({
  name: z
    .string({ error: 'Project name is required' })
    .trim()
    .min(2, { error: 'Project name must be at least 2 characters long' })
    .max(250, { error: 'Project name must be at most 250 characters long' }),
  description: z.optional(
    z
      .string()
      .trim()
      .max(500, { error: 'Description must be at most 500 characters long' })
  ),
  status: z.string(),
  dueDate: z.string({ error: 'Due date is required' }),
  assignees: z
    .array(z.string().trim())
    .min(1, { error: 'At least one assignee is required' }),
});

export { manageProjectSchema };
