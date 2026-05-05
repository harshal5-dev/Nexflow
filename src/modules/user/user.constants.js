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
];

export { USER_TENANT_FIELDS, USER_ROLE_FIELDS, USER_RESPONSE_FIELDS };
