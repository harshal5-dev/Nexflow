import { Router } from 'express';
import {
  checkCreateTaskPermission,
  validateManageTask,
} from './task.middleware.js';
import { createTask } from './task.service.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';

const router = Router();

router.post(
  '/',
  checkCreateTaskPermission,
  validateManageTask,
  async (req, res) => {
    try {
      const task = await createTask(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.CREATED,
        message: 'Task created successfully',
        data: task,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
