import { Router } from 'express';
import {
  checkCreateMemberPermissions,
  validateCreateMember,
} from './user.middleware.js';
import { createMember } from './user.service.js';
import { STATUS_CODES } from '../../common/constants.js';
import { sendSuccessResponse } from '../../common/api.response.js';

const router = Router();

router.post(
  '/',
  checkCreateMemberPermissions,
  validateCreateMember,
  async (req, res) => {
    try {
      const member = await createMember(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.CREATED,
        message: 'Member created successfully',
        data: member,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
