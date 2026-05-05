import { Router } from 'express';
import { validateUpdateTenant } from './tenant.middleware.js';
import { updateTenant } from './tenant.service.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';

const router = Router();

router.put('/', validateUpdateTenant, async (req, res) => {
  try {
    const { tenantId, body } = req;

    const updatedTenantObject = await updateTenant(tenantId, body);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.SUCCESS,
      message: 'Tenant profile updated successfully',
      data: updatedTenantObject,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
