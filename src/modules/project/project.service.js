import { filterResponseBody } from '../../common/utils.js';
import { getProjectLookUpUsers } from '../user/user.service.js';
import {
  GET_ALL_PROJECTS_RESPONSE_FIELDS,
  MANAGE_PROJECT_RESPONSE_FIELDS,
} from './project.constants.js';
import projectModel from './project.model.js';

const createProject = async projectData => {
  try {
    const project = await new projectModel(projectData).save();
    return filterResponseBody(
      project.toObject(),
      MANAGE_PROJECT_RESPONSE_FIELDS
    );
  } catch (error) {
    throw error;
  }
};

const getAllProjects = async (userId, tenantId, userType) => {
  try {
    let filter = {};

    if (userType !== 'PLATFORM') {
      filter = {
        $or: [{ createBy: userId }, { assignees: { $in: [userId] } }],
      };
    }

    const projects = await projectModel
      .find(filter)
      .setOptions({ tenantId })
      .populate({
        path: 'tasks',
        select: '_id name status',
        options: { tenantId },
      })
      .populate({
        path: 'assignees',
        select: '_id firstName lastName emailId',
        options: { tenantId },
      });

    const projectList = projects.map(project => {
      const projectObj = filterResponseBody(
        project.toObject(),
        GET_ALL_PROJECTS_RESPONSE_FIELDS
      );

      return {
        ...projectObj,
        taskCount: project.tasks.length,
        assigneeCount: project.assignees.length,
      };
    });

    return projectList;
  } catch (error) {
    throw error;
  }
};

const getLoopUpUsers = async (userId, tenantId) => {
  try {
    const users = await getProjectLookUpUsers(userId, tenantId);
    return users;
  } catch (error) {
    throw error;
  }
};

export { createProject, getLoopUpUsers, getAllProjects };
