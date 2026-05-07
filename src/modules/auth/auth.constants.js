const SIGNUP_ALLOWED_FIELDS = ['firstName', 'lastName', 'emailId', 'password'];

const SIGNUP_RESPONSE_FIELDS = [
  '_id',
  'firstName',
  'lastName',
  'emailId',
  'tenantId',
];

const LOGIN_ALLOWED_FIELDS = ['emailId', 'password'];

const AUTH_USER_FIELDS = [
  '_id',
  'firstName',
  'lastName',
  'emailId',
  'tenantId',
  'permissions',
];

const AUTH_USER_ROLE_FIELDS = ['_id', 'name', 'code', 'permissions'];

const USER_PROFILE_UPDATABLE_FIELDS = [
  '_id',
  'firstName',
  'lastName',
  'emailId',
  'tenantId',
];

const RESET_PASSWORD_ALLOWED_FIELDS = ['emailId', 'otp', 'password'];

const UPDATE_PROFILE_ALLOWED_FIELDS = ['firstName', 'lastName'];

export {
  SIGNUP_ALLOWED_FIELDS,
  SIGNUP_RESPONSE_FIELDS,
  LOGIN_ALLOWED_FIELDS,
  AUTH_USER_FIELDS,
  AUTH_USER_ROLE_FIELDS,
  USER_PROFILE_UPDATABLE_FIELDS,
  RESET_PASSWORD_ALLOWED_FIELDS,
  UPDATE_PROFILE_ALLOWED_FIELDS,
};
