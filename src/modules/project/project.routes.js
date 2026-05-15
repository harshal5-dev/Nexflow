import express from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getLoopUpUsers,
  getProjectById,
  getProjectStates,
  getTasksByProject,
  updateProject,
} from './project.service.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  checkCreateProjectPermissions,
  checkDeleteProjectPermissions,
  checkGetAllProjectsPermissions,
  checkGetProjectPermissions,
  checkGetProjectStatesPermissions,
  checkUpdateProjectPermissions,
  validateManageProject,
} from './project.middleware.js';
import {
  checkCreateTaskPermission,
  validateManageTask,
} from '../task/task.middleware.js';
import { createTask } from '../task/task.service.js';

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

router.put(
  '/:id',
  checkUpdateProjectPermissions,
  validateManageProject,
  async (req, res) => {
    try {
      const project = await updateProject(req.params.id, req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.OK,
        message: 'Project updated successfully',
        data: project,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.delete('/:id', checkDeleteProjectPermissions, async (req, res) => {
  try {
    const project = await deleteProject(req.params.id, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Project deleted successfully',
      data: project,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

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

router.get('/states', checkGetProjectStatesPermissions, async (req, res) => {
  try {
    const states = await getProjectStates(req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Project states fetched successfully',
      data: states,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id', checkGetProjectPermissions, async (req, res) => {
  try {
    const project = await getProjectById(req.params.id, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Project fetched successfully',
      data: project,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id/tasks', checkGetProjectPermissions, async (req, res) => {
  try {
    const tasks = await getTasksByProject(req.params.id, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Tasks fetched successfully',
      data: tasks,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post(
  '/:id/tasks',
  checkCreateTaskPermission,
  validateManageTask,
  async (req, res) => {
    try {
      req.body.project = req.params.id;
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
