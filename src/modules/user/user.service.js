import bcrypt from 'bcrypt';

import userModel from './user.model.js';
import { th } from 'zod/locales';
import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  USER_RESPONSE_FIELDS,
  USER_ROLE_FIELDS,
  USER_TENANT_FIELDS,
} from './user.constants.js';
import { filterResponseBody } from '../../common/utils.js';
import { getTenantById } from '../tenant/tenant.service.js';

const createUser = async (session, userData) => {
  try {
    const { password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.passwordHash = hashedPassword;
    const createdUser = await new userModel(userData).save({ session });
    return createdUser.toObject();
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async emailId => {
  try {
    const user = await userModel.findOne({ emailId });
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

const getUserById = async userId => {
  try {
    const user = await userModel.findById(userId);
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async userId => {
  try {
    const user = await userModel
      .findById(userId)
      .populate('roleIds', USER_ROLE_FIELDS);
    if (!user) {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    const userObj = user.toObject();
    userObj.tenant = await getTenantById(userObj.tenantId, USER_TENANT_FIELDS);
    userObj.roles = userObj.roleIds;

    return filterResponseBody(userObj, USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  }
};

export { createUser, getUserByEmail, getUserById, getUserProfile };
