const CREATE_ROLE_ALLOWED_FIELDS = ['name', 'description', 'permissions'];

const GET_ROLES_ALLOWED_FIELDS = [
  '_id',
  'name',
  'description',
  'permissions',
  'code',
  'userCount',
];

export { CREATE_ROLE_ALLOWED_FIELDS, GET_ROLES_ALLOWED_FIELDS };
