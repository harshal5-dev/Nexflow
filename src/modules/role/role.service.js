import AppError from '../../common/AppError.js';
import { PERMISSIONS, STATUS_CODES } from '../../common/constants.js';
import { filterResponseBody } from '../../common/utils.js';
import { getRolesCountByUser } from '../user/user.service.js';
import { GET_ROLES_ALLOWED_FIELDS } from './role.constants.js';
import roleModel from './role.model.js';

const getDefaultRole = async session => {
  try {
    const defaultRole = await roleModel.findOne({
      $and: [{ code: 'PLATFORM_OWNER' }, { scope: 'PLATFORM' }],
    });
    if (!defaultRole) {
      const defaultRoleData = {
        name: 'Owner',
        code: 'PLATFORM_OWNER',
        scope: 'PLATFORM',
        permissions: [
          PERMISSIONS.MANAGE_USERS,
          PERMISSIONS.MANAGE_ROLES,
          PERMISSIONS.MANAGE_TASKS,
          PERMISSIONS.MANAGE_PROJECTS,
          PERMISSIONS.UPDATE_TENANT,
        ],
      };
      const createdRole = await new roleModel(defaultRoleData).save({
        session,
      });
      return createdRole.toObject();
    }
    return defaultRole.toObject();
  } catch (error) {
    throw error;
  }
};

const getPermissions = async () => {
  try {
    const permissions = Object.values(PERMISSIONS);
    return permissions;
  } catch (error) {
    throw error;
  }
};

const createRole = async roleData => {
  try {
    const createdRole = await new roleModel(roleData).save();
    return filterResponseBody(createdRole.toObject(), GET_ROLES_ALLOWED_FIELDS);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Role already exists', STATUS_CODES.BAD_REQUEST);
    }
    throw error;
  }
};

const getRoles = async tenantId => {
  try {
    const roles = await roleModel
      .find()
      .setOptions({
        tenantId,
      })
      .lean();

    const roleCountMap = await getRolesCountByUser(tenantId);

    return roles.map(role => {
      const count = roleCountMap.get(role._id.toString()) || 0;
      return filterResponseBody(
        { ...role, userCount: count },
        GET_ROLES_ALLOWED_FIELDS
      );
    });
  } catch (error) {
    throw error;
  }
};

export { getDefaultRole, getPermissions, createRole, getRoles };
