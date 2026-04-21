import roleModel from './role.model.js';

const getDefaultRole = async session => {
  const defaultRole = await roleModel.findOne({
    $and: [{ code: 'PLATFORM_ADMIN' }, { scope: 'PLATFORM' }],
  });
  if (!defaultRole) {
    const defaultRoleData = {
      name: 'Admin',
      code: 'PLATFORM_ADMIN',
      scope: 'PLATFORM',
    };
    const createdRole = await new roleModel(defaultRoleData).save({ session });
    return createdRole.toObject();
  }
  return defaultRole.toObject();
};

export { getDefaultRole };
