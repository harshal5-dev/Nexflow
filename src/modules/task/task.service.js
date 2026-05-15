import { filterResponseBody } from '../../common/utils.js';
import {
  MANAGE_TASK_ALLOWED_FIELDS,
  TASK_BY_PROJECT_ID_RESPONSE_FIELDS,
} from './task.constants.js';
import taskModel from './task.model.js';

const createTask = async taskData => {
  try {
    const task = await new taskModel(taskData).save();
    return filterResponseBody(task, MANAGE_TASK_ALLOWED_FIELDS);
  } catch (error) {
    throw error;
  }
};

const getTaskByProjectId = async (projectId, tenantId) => {
  try {
    const tasks = await taskModel
      .find({ project: projectId })
      .setOptions({ tenantId })
      .populate({
        path: 'assignedTo',
        select: ['_id', 'firstName', 'lastName', 'emailId'],
        options: { tenantId },
      });
    return tasks.map(task =>
      filterResponseBody(task.toObject(), TASK_BY_PROJECT_ID_RESPONSE_FIELDS)
    );
  } catch (error) {
    throw error;
  }
};

const countTasksByProjectId = async (projectId, tenantId) => {
  try {
    const count = await taskModel
      .countDocuments({
        project: projectId,
      })
      .setOptions({ tenantId });
    return count;
  } catch (error) {
    throw error;
  }
};

const getTaskCountByProject = async tenantId => {
  const taskCounts = await taskModel.aggregate([
    {
      $match: {
        tenantId,
      },
    },
    {
      $unwind: '$project',
    },
    {
      $group: {
        _id: '$project',
        taskCount: {
          $sum: 1,
        },
      },
    },
  ]);
  const countMap = new Map();

  taskCounts.forEach(taskCount => {
    countMap.set(taskCount._id.toString(), taskCount.taskCount);
  });

  return countMap;
};

export {
  createTask,
  getTaskByProjectId,
  countTasksByProjectId,
  getTaskCountByProject,
};
