const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const AUTH_EXCLUDED_PATHS = new Set([
  '/api/v1/auth/signin',
  '/api/v1/auth/signup',
]);

export { STATUS_CODES, AUTH_EXCLUDED_PATHS };
