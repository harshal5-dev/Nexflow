import { filterResponseBody } from '../../common/utils.js';
import {
  countTasksByProjectId,
  getTaskByProjectId,
  getTaskCountByProject,
} from '../task/task.service.js';
import { getProjectLookUpUsers } from '../user/user.service.js';
import {
  GET_ALL_PROJECTS_RESPONSE_FIELDS,
  GET_PROJECT_BY_ID_RESPONSE_FIELDS,
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

    filter.status = { $ne: 'DELETED' };

    const projects = await projectModel
      .find(filter)
      .setOptions({ tenantId })
      .populate({
        path: 'assignees',
        select: '_id firstName lastName emailId',
        options: { tenantId },
      });

    const taskCounts = await getTaskCountByProject(tenantId);

    const projectList = projects.map(project => {
      const projectObj = filterResponseBody(
        project.toObject(),
        GET_ALL_PROJECTS_RESPONSE_FIELDS
      );

      return {
        ...projectObj,
        taskCount: taskCounts.get(project._id.toString()) || 0,
        assigneeCount: project.assignees.length,
      };
    });

    return projectList;
  } catch (error) {
    throw error;
  }
};

const getProjectById = async (projectId, tenantId) => {
  try {
    const project = await projectModel
      .findOne({ _id: projectId })
      .setOptions({ tenantId })
      .populate({
        path: 'assignees',
        select: '_id firstName lastName emailId',
        options: { tenantId },
      });

    const taskCount = await countTasksByProjectId(projectId, tenantId);

    const filteredProject = filterResponseBody(
      project.toObject(),
      GET_PROJECT_BY_ID_RESPONSE_FIELDS
    );

    return {
      ...filteredProject,
      taskCount,
      assigneeCount: project.assignees.length,
    };
  } catch (error) {
    throw error;
  }
};

const getTasksByProject = async (projectId, tenantId) => {
  try {
    return await getTaskByProjectId(projectId, tenantId);
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

const updateProject = async (projectId, updateData) => {
  try {
    const updatedProject = await projectModel
      .findOneAndUpdate({ _id: projectId }, updateData, {
        returnDocument: 'after',
      })
      .setOptions({ tenantId: updateData.tenantId });
    return filterResponseBody(
      updatedProject.toObject(),
      MANAGE_PROJECT_RESPONSE_FIELDS
    );
  } catch (error) {
    throw error;
  }
};

const deleteProject = async (projectId, tenantId) => {
  try {
    const deletedProject = await projectModel
      .findOneAndUpdate(
        { _id: projectId },
        { status: 'DELETED' },
        {
          returnDocument: 'after',
        }
      )
      .setOptions({ tenantId });
    return filterResponseBody(
      deletedProject.toObject(),
      MANAGE_PROJECT_RESPONSE_FIELDS
    );
  } catch (error) {
    throw error;
  }
};

const getProjectStates = async tenantId => {
  const today = new Date();

  const [states] = await projectModel.aggregate([
    {
      $match: {
        tenantId,
        status: { $ne: 'DELETED' },
      },
    },
    {
      $group: {
        _id: null,

        totalProjects: { $sum: 1 },

        activeProjects: {
          $sum: {
            $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0],
          },
        },

        completedProjects: {
          $sum: {
            $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
          },
        },

        pendingProjects: {
          $sum: {
            $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0],
          },
        },

        overdueProjects: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', today] },
                  { $ne: ['$status', 'COMPLETED'] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalProjects: 1,
        activeProjects: 1,
        completedProjects: 1,
        pendingProjects: 1,
        overdueProjects: 1,
      },
    },
  ]);

  return (
    states || {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      pendingProjects: 0,
      overdueProjects: 0,
    }
  );
};

export {
  createProject,
  getLoopUpUsers,
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectStates,
  getProjectById,
  getTasksByProject,
};
