import {
  filterRequestBody,
  flattenValidationErrors,
  hasAnyPermission,
} from '../../common/utils.js';
import { createMemberSchema } from './user.validator.js';
import { CREATE_USER_ALLOWED_FIELDS } from './user.constants.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import AppError from '../../common/AppError.js';

const checkUserPermission = (permissions, requiredPermissions) => {
  const allowed = hasAnyPermission(permissions, requiredPermissions);

  if (!allowed) {
    throw new AppError(
      'you do not have the required access.',
      STATUS_CODES.FORBIDDEN
    );
  }
};

const validateCreateMember = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, CREATE_USER_ALLOWED_FIELDS);

  const { error, success } = await createMemberSchema.safeParseAsync(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  payload.tenantId = req.tenantId;
  req.body = payload;
  req.body.tenantId = req.tenantId;

  next();
};

const checkCreateMemberPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkUserPermission(permissions, [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_USERS,
  ]);

  next();
};

export { validateCreateMember, checkCreateMemberPermissions };
