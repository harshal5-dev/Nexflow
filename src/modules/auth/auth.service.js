import mongoose from 'mongoose';

import { sendEmail } from '../../common/mailer.js';
import {
  createResetPassword,
  createUser,
  getUserProfile,
  getUserProfileByEmail,
  updateUserProfile,
  verifyResetPasswordOTP,
} from '../user/user.service.js';
import { createTenant, getTenantById } from '../tenant/tenant.service.js';
import { filterResponseBody } from '../../common/utils.js';
import {
  SIGNUP_RESPONSE_FIELDS,
  USER_PROFILE_UPDATABLE_FIELDS,
} from './auth.constants.js';
import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';
import { getDefaultRole } from '../role/role.service.js';
import {
  USER_RESPONSE_FIELDS,
  USER_TENANT_FIELDS,
} from '../user/user.constants.js';

const signup = async userPayload => {
  const session = await mongoose.startSession();

  try {
    const transactionResults = await session.withTransaction(async () => {
      const tenantName = `${userPayload.firstName}-organization`;
      const createdTenant = await createTenant(session, { name: tenantName });
      const defaultRole = await getDefaultRole(session);

      const createdUser = await createUser(session, {
        ...userPayload,
        tenantId: createdTenant._id,
        roleIds: [defaultRole._id],
      });

      await sendWelcomeMail(userPayload);

      return { tenantId: createdTenant._id, ...createdUser };
    });

    return filterResponseBody(transactionResults, SIGNUP_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

const signin = async credentials => {
  try {
    const { emailId, password } = credentials;
    const user = await getUserProfileByEmail(emailId);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
    }

    const token = await user.getJWTToken();

    const userObject = user.toObject();
    userObject.tenant = await getTenantById(user.tenantId, USER_TENANT_FIELDS);
    userObject.roles = user.roleIds;

    return {
      token,
      user: filterResponseBody(userObject, USER_RESPONSE_FIELDS),
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

const updateCurrentUserProfile = async (userId, profileData) => {
  try {
    const updatedUser = await updateUserProfile(userId, profileData);
    return filterResponseBody(updatedUser, USER_PROFILE_UPDATABLE_FIELDS);
  } catch (error) {
    throw error;
  }
};

const sendWelcomeMail = async userData => {
  const email = userData.emailId;
  const name = userData.firstName;
  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to Nex Flow!',
      template: 'welcome-email',
      data: {
        name,
        currentYear: new Date().getFullYear(),
        steps: [
          { step: 1, text: 'Log in to your account' },
          { step: 2, text: 'Create your first project' },
          { step: 3, text: 'Invite your teammates' },
          { step: 4, text: 'Start collaborating with your team' },
        ],
      },
    });
  } catch (error) {
    throw error;
  }
};

const sendResetPasswordOTP = async emailId => {
  try {
    await createResetPassword(emailId);
  } catch (error) {
    throw error;
  }
};

const verifyResetPassword = async resetPasswordData => {
  try {
    await verifyResetPasswordOTP(resetPasswordData);
  } catch (error) {
    throw error;
  }
};

export {
  signup,
  signin,
  getCurrentUserProfile,
  verifyResetPassword,
  sendResetPasswordOTP,
  updateCurrentUserProfile,
};
