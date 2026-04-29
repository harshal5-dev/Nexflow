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
];

const RESET_PASSWORD_ALLOWED_FIELDS = ['emailId', 'otp', 'password'];

export {
  SIGNUP_ALLOWED_FIELDS,
  SIGNUP_RESPONSE_FIELDS,
  LOGIN_ALLOWED_FIELDS,
  AUTH_USER_FIELDS,
  RESET_PASSWORD_ALLOWED_FIELDS,
};
