import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  filterRequestBody,
  flattenValidationErrors,
} from '../../common/utils.js';
import {
  LOGIN_ALLOWED_FIELDS,
  SIGNUP_ALLOWED_FIELDS,
} from './auth.constants.js';
import {
  forgotPasswordSchema,
  loginUserSchema,
  signUpUserSchema,
} from './auth.validator.js';

const validateSignUpUser = (req, res, next) => {
  const payload = filterRequestBody(req.body, SIGNUP_ALLOWED_FIELDS);

  const { error, success } = signUpUserSchema.safeParse(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  req.body = payload;
  next();
};

const validateLoginUser = (req, res, next) => {
  const payload = filterRequestBody(req.body, LOGIN_ALLOWED_FIELDS);

  const { error, success } = loginUserSchema.safeParse(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  req.body = payload;
  next();
};

const validateForgotPassword = (req, res, next) => {
  const payload = filterRequestBody(req.body, ['emailId']);

  const { error, success } = forgotPasswordSchema.safeParse(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  req.body = payload;
  next();
};

export { validateSignUpUser, validateLoginUser, validateForgotPassword };
