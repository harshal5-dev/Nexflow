import AppError from '../../common/AppError.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import {
  filterRequestBody,
  flattenValidationErrors,
  hasAnyPermission,
} from '../../common/utils.js';
import { MANAGE_TASK_ALLOWED_FIELDS } from './task.constants.js';
import { manageTaskSchema } from './task.validator.js';

const checkTaskPermission = (permissions, requiredPermissions) => {
  const allowed = hasAnyPermission(permissions, requiredPermissions);

  if (!allowed) {
    throw new AppError(
      'you do not have the required access.',
      STATUS_CODES.FORBIDDEN
    );
  }
};

const validateManageTask = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, MANAGE_TASK_ALLOWED_FIELDS);

  const { error, success } = await manageTaskSchema.safeParseAsync(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  payload.tenantId = req.tenantId;
  payload.createdBy = req.user._id;
  req.body = payload;

  next();
};

const checkCreateTaskPermission = (req, _res, next) => {
  const { permissions } = req.user;

  checkTaskPermission(permissions, [
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.CREATE_TASKS,
  ]);

  next();
};

export { validateManageTask, checkCreateTaskPermission };
