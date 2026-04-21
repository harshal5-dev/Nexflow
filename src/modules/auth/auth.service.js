import mongoose from 'mongoose';

import {
  createUser,
  getUserByEmail,
  getUserProfile,
} from '../user/user.service.js';
import { createTenant } from '../tenant/tenant.service.js';
import { filterResponseBody } from '../../common/utils.js';
import { SIGNUP_RESPONSE_FIELDS } from './auth.constants.js';
import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';

const signup = async userPayload => {
  const session = await mongoose.startSession();

  try {
    const transactionResults = await session.withTransaction(async () => {
      const tenantName = `${userPayload.firstName}-organization`;
      const createdTenant = await createTenant(session, { name: tenantName });

      const createdUser = await createUser(session, {
        ...userPayload,
        tenantId: createdTenant._id,
      });
      return { tenantId: createdTenant._id, ...createdUser };
    });

    return filterResponseBody(transactionResults, SIGNUP_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

const login = async credentials => {
  try {
    const { emailId, password } = credentials;
    const user = await getUserByEmail(credentials.emailId);

    if (!user) {
      throw new AppError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
    }

    const token = await user.getJWTToken();

    return {
      token,
      user: filterResponseBody(user.toObject(), SIGNUP_RESPONSE_FIELDS),
    };
  } catch (error) {
    throw error;
  }
};

const getCurrentUserProfile = async userId => {
  try {
    const user = await getUserProfile(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

export { signup, login, getCurrentUserProfile };
