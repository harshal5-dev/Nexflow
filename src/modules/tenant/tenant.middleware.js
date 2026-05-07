import AppError from '../../common/AppError.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import { filterRequestBody } from '../../common/utils.js';
import { UPDATE_TENANT_ALLOWED_FIELDS } from './tenant.constants.js';
import { updateTenantSchema } from './tenant.validator.js';

const validateUpdateTenant = async (req, _res, next) => {
  const payload = filterRequestBody(req.body, UPDATE_TENANT_ALLOWED_FIELDS);

  const { error, success } = await updateTenantSchema.safeParseAsync(payload);
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

const checkUpdateTenantPermissions = async (req, _res, next) => {
  const { permissions } = req.user;

  if (!permissions.includes(PERMISSIONS.UPDATE_TENANT)) {
    throw new AppError(
      'you do not have the required access.',
      STATUS_CODES.FORBIDDEN
    );
  }
  next();
};

export { validateUpdateTenant, checkUpdateTenantPermissions };
