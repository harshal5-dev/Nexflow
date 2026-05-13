import express from 'express';
import {
  createProject,
  getAllProjects,
  getLoopUpUsers,
} from './project.service.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  checkCreateProjectPermissions,
  checkGetAllProjectsPermissions,
  validateManageProject,
} from './project.middleware.js';

const router = express.Router();

router.get('/', checkGetAllProjectsPermissions, async (req, res) => {
  try {
    const projects = await getAllProjects(
      req.user._id,
      req.tenantId,
      req.user.type
    );
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Projects fetched successfully',
      data: projects,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post(
  '/',
  checkCreateProjectPermissions,
  validateManageProject,
  async (req, res) => {
    try {
      const project = await createProject(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.OK,
        message: 'Project fetched successfully',
        data: project,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get('/lookup-users', async (req, res) => {
  try {
    const users = await getLoopUpUsers(req.user._id, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Users fetched successfully',
      data: users,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
