const MANAGE_TASK_ALLOWED_FIELDS = [
  'title',
  'description',
  'dueDate',
  'priority',
  'status',
  'assignedTo',
];

const TASK_BY_PROJECT_ID_RESPONSE_FIELDS = [
  '_id',
  'title',
  'description',
  'dueDate',
  'priority',
  'status',
  'assignedTo',
  'createdAt',
];

export { MANAGE_TASK_ALLOWED_FIELDS, TASK_BY_PROJECT_ID_RESPONSE_FIELDS };
