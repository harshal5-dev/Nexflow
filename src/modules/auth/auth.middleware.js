import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  filterRequestBody,
  flattenValidationErrors,
} from '../../common/utils.js';
import {
  ACCEPT_INVITATION_ALLOWED_FIELDS,
  LOGIN_ALLOWED_FIELDS,
  RESET_PASSWORD_ALLOWED_FIELDS,
  SIGNUP_ALLOWED_FIELDS,
  UPDATE_PROFILE_ALLOWED_FIELDS,
} from './auth.constants.js';
import {
  acceptInvitationSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  signUpUserSchema,
  updateProfileSchema,
} from './auth.validator.js';

const validateSignUpUser = async (req, res, next) => {
  const payload = filterRequestBody(req.body, SIGNUP_ALLOWED_FIELDS);

  const { error, success } = await signUpUserSchema.safeParseAsync(payload);
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

const validateLoginUser = async (req, res, next) => {
  const payload = filterRequestBody(req.body, LOGIN_ALLOWED_FIELDS);

  const { error, success } = await loginUserSchema.safeParseAsync(payload);
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

const validateForgotPassword = async (req, res, next) => {
  const payload = filterRequestBody(req.body, ['emailId']);

  const { error, success } = await forgotPasswordSchema.safeParseAsync(payload);
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

const validateResetPassword = async (req, res, next) => {
  const payload = filterRequestBody(req.body, RESET_PASSWORD_ALLOWED_FIELDS);

  const { error, success } = await resetPasswordSchema.safeParseAsync(payload);
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

const validateUpdateProfile = async (req, res, next) => {
  const payload = filterRequestBody(req.body, UPDATE_PROFILE_ALLOWED_FIELDS);

  const { error, success } = await updateProfileSchema.safeParseAsync(payload);
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

const validateAcceptInvitation = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, ACCEPT_INVITATION_ALLOWED_FIELDS);

  const { error, success } =
    await acceptInvitationSchema.safeParseAsync(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  req.body = payload;
  req.body.tenantId = req.tenantId;

  next();
};

export {
  validateSignUpUser,
  validateLoginUser,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateAcceptInvitation,
};
