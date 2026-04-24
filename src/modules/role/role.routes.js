import express from 'express';
import { sendSuccessResponse } from '../../common/api.response.js';
import { getPermissions } from './role.service.js';
import { STATUS_CODES } from '../../common/constants.js';

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

export default router;
