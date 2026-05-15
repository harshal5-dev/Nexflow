import * as z from 'zod';

const manageTaskSchema = z.object({
  title: z
    .string({ error: 'Title is required' })
    .trim()
    .min(2, { error: 'Title must be at least 2 characters long' })
    .max(250, { error: 'Title must be at most 250 characters long' }),
  description: z.optional(
    z
      .string()
      .trim()
      .max(500, { error: 'Description must be at most 500 characters long' })
  ),
  status: z.string({ error: 'Status is required' }),
  dueDate: z.string({ error: 'Due date is required' }),
  priority: z.string({ error: 'Priority is required' }),
  assignedTo: z.string({ error: 'Assigned to is required' }),
});

export { manageTaskSchema };
