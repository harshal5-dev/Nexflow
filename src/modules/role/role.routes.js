import express from 'express';
import { sendSuccessResponse } from '../../common/api.response.js';
import { createRole, getPermissions, getRoles } from './role.service.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  checkCreateRolePermissions,
  checkGetRolesPermissions,
  validateCreateRole,
} from './role.middleware.js';

const router = express.Router();

router.get('/permissions', async (req, res) => {
  try {
    const permissions = await getPermissions();
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Permissions fetched successfully',
      data: permissions,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/', checkGetRolesPermissions, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const roles = await getRoles(tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Roles fetched successfully',
      data: roles,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post(
  '/',
  checkCreateRolePermissions,
  validateCreateRole,
  async (req, res) => {
    try {
      const role = await createRole(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.CREATED,
        message: 'Role created successfully',
        data: role,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
