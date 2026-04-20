import { sendErrorResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  filterRequestBody,
  flattenValidationErrors,
} from '../../common/utils.js';
import { SIGNUP_ALLOWED_FIELDS } from './auth.constants.js';
import { signUpUserSchema } from './auth.validator.js';

const validateSignUpUser = (req, res, next) => {
  const payload = filterRequestBody(req.body, SIGNUP_ALLOWED_FIELDS);

  const { error, success } = signUpUserSchema.safeParse(payload);
  if (!success) {
    return sendErrorResponse(res, {
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: 'Invalid request data',
      path: req.originalUrl,
      validationErrors: flattenValidationErrors(error),
    });
  }

  req.body = payload;
  next();
};

export { validateSignUpUser };
