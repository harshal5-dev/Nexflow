import AppError from '../../common/AppError.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import {
  filterRequestBody,
  flattenValidationErrors,
  hasAnyPermission,
} from '../../common/utils.js';
import { MANAGE_PROJECT_ALLOWED_FIELDS } from './project.constants.js';
import { manageProjectSchema } from './project.validator.js';

const checkProjectPermission = (permissions, requiredPermissions) => {
  const allowed = hasAnyPermission(permissions, requiredPermissions);

  if (!allowed) {
    throw new AppError(
      'you do not have the required access.',
      STATUS_CODES.FORBIDDEN
    );
  }
};

const validateManageProject = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, MANAGE_PROJECT_ALLOWED_FIELDS);

  const { error, success } = await manageProjectSchema.safeParseAsync(payload);
  if (!success) {
    throw new AppError(
      'Invalid request data',
      STATUS_CODES.BAD_REQUEST,
      flattenValidationErrors(error)
    );
  }

  payload.tenantId = req.tenantId;
  if (!req.isUpdateProject) {
    payload.createdBy = req.user._id;
  }
  req.body = payload;

  next();
};

const checkCreateProjectPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [
    PERMISSIONS.CREATE_PROJECTS,
    PERMISSIONS.MANAGE_PROJECTS,
  ]);

  next();
};

const checkUpdateProjectPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.UPDATE_PROJECTS,
  ]);

  req.isUpdateProject = true;
  next();
};

const checkGetProjectPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.VIEW_PROJECTS,
  ]);

  next();
};

const checkGetAllProjectsPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.VIEW_LIST_PROJECTS,
  ]);

  next();
};

const checkDeleteProjectPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.DELETE_PROJECTS,
  ]);

  next();
};

const checkGetProjectStatesPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  checkProjectPermission(permissions, [PERMISSIONS.MANAGE_PROJECTS]);

  next();
};

export {
  checkCreateProjectPermissions,
  validateManageProject,
  checkGetAllProjectsPermissions,
  checkUpdateProjectPermissions,
  checkDeleteProjectPermissions,
  checkGetProjectStatesPermissions,
  checkGetProjectPermissions,
};
