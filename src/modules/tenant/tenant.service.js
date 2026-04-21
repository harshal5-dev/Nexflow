import { STATUS_CODES } from '../../common/constants.js';
import { filterResponseBody } from '../../common/utils.js';
import tenantModel from './tenant.model.js';

const getTenantById = async (tenantId, filterFields) => {
  try {
    const tenant = await tenantModel.findById(tenantId);

    if (!tenant) {
      throw new AppError('Tenant not found', STATUS_CODES.NOT_FOUND);
    }

    return filterFields
      ? filterResponseBody(tenant.toObject(), filterFields)
      : tenant.toObject();
  } catch (error) {
    throw error;
  }
};

const createTenant = async (session, tenantData) => {
  try {
    const createdTenant = await new tenantModel(tenantData).save({ session });
    return createdTenant.toObject();
  } catch (error) {
    throw error;
  }
};

export { createTenant, getTenantById };
