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
import { filterResponseBody, generate6DigitOTP } from '../../common/utils.js';
import { getTenantById } from '../tenant/tenant.service.js';
import resetPasswordModel from './resetPassword.model.js';
import { sendEmail } from '../../common/mailer.js';

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

const createResetPassword = async emailId => {
  try {
    const user = await getUserByEmail(emailId);

    if (!user) {
      throw new AppError(
        'User with the provided email does not exist',
        STATUS_CODES.NOT_FOUND
      );
    }

    const otp = generate6DigitOTP();
    const resetPassword = {
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
      userId: user._id,
    };

    await resetPasswordModel.create(resetPassword);

    await sendResetPasswordMail(emailId, otp, user.firstName);
  } catch (error) {
    throw error;
  }
};

const sendResetPasswordMail = async (email, otp, name) => {
  try {
    await sendEmail({
      to: email,
      subject: 'Nex Flow Password Reset OTP',
      template: 'reset-password-email',
      data: {
        name,
        otp,
        currentYear: new Date().getFullYear(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  getUserProfile,
  createResetPassword,
};
