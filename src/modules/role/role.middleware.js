import AppError from '../../common/AppError.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import { filterRequestBody, hasAnyPermission } from '../../common/utils.js';
import { CREATE_ROLE_ALLOWED_FIELDS } from './role.constants.js';
import { manageRoleSchema } from './role.validator.js';

const checkRolePermission = (permissions, requiredPermissions) => {
  const allowed = hasAnyPermission(permissions, requiredPermissions);

  if (!allowed) {
    throw new AppError(
      'you do not have the required access.',
      STATUS_CODES.FORBIDDEN
    );
  }
};

const validateManageRole = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, CREATE_ROLE_ALLOWED_FIELDS);

  const { error, success } = await manageRoleSchema.safeParseAsync(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  req.body = payload;
  req.body.tenantId = req.tenantId;
  req.body.code = req.body.name.replace(/\s+/g, '_').toLowerCase();

  next();
};

const checkCreateRolePermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkRolePermission(permissions, [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.CREATE_ROLES,
  ]);

  next();
};

const checkUpdateRolePermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkRolePermission(permissions, [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.UPDATE_ROLES,
  ]);

  next();
};

const checkGetRolesPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkRolePermission(permissions, [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_LIST_ROLES,
  ]);

  next();
};

const checkDeleteRolePermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkRolePermission(permissions, [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.DELETE_ROLES,
  ]);

  next();
};

export {
  validateManageRole,
  checkCreateRolePermissions,
  checkUpdateRolePermissions,
  checkGetRolesPermissions,
  checkDeleteRolePermissions,
};
