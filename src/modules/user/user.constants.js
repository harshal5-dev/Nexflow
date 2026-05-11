const USER_TENANT_FIELDS = ['name', 'description'];
const USER_ROLE_FIELDS = ['name', 'description', 'code'];

const USER_RESPONSE_FIELDS = [
  '_id',
  'firstName',
  'lastName',
  'emailId',
  'profilePictureUrl',
  'tenant',
  'roles',
  'tenantId',
  'createdAt',
  'status',
  'permissions',
];

const CREATE_USER_ALLOWED_FIELDS = [
  'firstName',
  'lastName',
  'emailId',
  'roles',
];

const UPDATE_USER_ALLOWED_FIELDS = ['firstName', 'lastName', 'roles'];

export {
  USER_TENANT_FIELDS,
  USER_ROLE_FIELDS,
  USER_RESPONSE_FIELDS,
  CREATE_USER_ALLOWED_FIELDS,
  UPDATE_USER_ALLOWED_FIELDS,
};
