import { PERMISSIONS } from '../../common/constants.js';
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
      permissions: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.MANAGE_ROLES,
        PERMISSIONS.MANAGE_TASKS,
        PERMISSIONS.MANAGE_PROJECTS,
        PERMISSIONS.UPDATE_TENANT,
      ],
    };
    const createdRole = await new roleModel(defaultRoleData).save({ session });
    return createdRole.toObject();
  }
  return defaultRole.toObject();
};

const getPermissions = async () => {
  const permissions = Object.values(PERMISSIONS);
  return permissions;
};

export { getDefaultRole, getPermissions };
