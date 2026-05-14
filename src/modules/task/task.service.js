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
    const tasks = await taskModel.find({ projectId }).setOptions({ tenantId });
    return tasks.map(task =>
      filterResponseBody(task.toObject(), TASK_BY_PROJECT_ID_RESPONSE_FIELDS)
    );
  } catch (error) {
    throw error;
  }
};

export { createTask, getTaskByProjectId };
