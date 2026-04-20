import tenantModel from './tenant.model.js';

const createTenant = async (session, tenantData) => {
  try {
    const createdTenant = await new tenantModel(tenantData).save({ session });
    return createdTenant.toObject();
  } catch (error) {
    throw error;
  }
};

export { createTenant };
