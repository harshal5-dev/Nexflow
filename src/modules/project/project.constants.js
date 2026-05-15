const MANAGE_PROJECT_ALLOWED_FIELDS = [
  'name',
  'description',
  'status',
  'dueDate',
  'assignees',
];

const MANAGE_PROJECT_RESPONSE_FIELDS = ['_id', 'name', 'description', 'status'];

const GET_ALL_PROJECTS_RESPONSE_FIELDS = [
  '_id',
  'name',
  'description',
  'status',
  'tasks',
  'assignees',
  'dueDate',
];

const GET_PROJECT_BY_ID_RESPONSE_FIELDS = [
  '_id',
  'name',
  'description',
  'status',
  'tasks',
  'assignees',
  'dueDate',
  'createdAt',
  'updatedAt',
  'updatedBy',
  'taskCount',
];

export {
  MANAGE_PROJECT_ALLOWED_FIELDS,
  MANAGE_PROJECT_RESPONSE_FIELDS,
  GET_ALL_PROJECTS_RESPONSE_FIELDS,
  GET_PROJECT_BY_ID_RESPONSE_FIELDS,
};
