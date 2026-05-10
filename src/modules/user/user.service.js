import mongoose from 'mongoose';
import userModel from './user.model.js';
import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';
import {
  USER_RESPONSE_FIELDS,
  USER_ROLE_FIELDS,
  USER_TENANT_FIELDS,
} from './user.constants.js';
import { encryptPassword, filterResponseBody } from '../../common/utils.js';
import { getTenantById } from '../tenant/tenant.service.js';
import { sendEmail } from '../../common/mailer.js';
import {
  createInvitation,
  updateInvitation,
} from '../invitation/invitation.service.js';

const createUser = async (session, userData) => {
  try {
    const { password } = userData;
    userData.passwordHash = await encryptPassword(password);
    userData.status = 'ACTIVE';
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

const getUserProfileByEmail = async emailId => {
  try {
    const user = await userModel
      .findOne({ emailId })
      .populate('roles', USER_ROLE_FIELDS);

    if (!user) {
      throw new AppError('Invalid credentials', STATUS_CODES.UNAUTHORIZED);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async userId => {
  try {
    const user = await userModel
      .findById(userId)
      .populate('roles', USER_ROLE_FIELDS);
    if (!user) {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    const userObj = user.toObject();
    userObj.tenant = await getTenantById(userObj.tenantId, USER_TENANT_FIELDS);

    return filterResponseBody(userObj, USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  }
};

const sendMemberInvitationMail = async (email, name, inviteUrl) => {
  try {
    await sendEmail({
      to: email,
      subject: "You're invited to Nex Flow",
      template: 'member-invitation-email',
      data: {
        name,
        inviteUrl,
        currentYear: new Date().getFullYear(),
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (userId, profileData) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, profileData, {
      returnDocument: 'after',
    });
    return updatedUser.toObject();
  } catch (error) {
    throw error;
  }
};

const getRolesCountByUser = async tenantId => {
  const roleCounts = await userModel.aggregate([
    {
      $match: {
        tenantId,
      },
    },
    {
      $unwind: '$roles',
    },
    {
      $group: {
        _id: '$roles',
        userCount: {
          $sum: 1,
        },
      },
    },
  ]);
  const countMap = new Map();

  roleCounts.forEach(roleCount => {
    countMap.set(roleCount._id.toString(), roleCount.userCount);
  });

  return countMap;
};

const createMember = async userData => {
  const session = await mongoose.startSession();

  try {
    const createdMember = await session.withTransaction(async () => {
      const user = await new userModel(userData).save({ session });

      const inviteUrl = await createInvitation(user._id, session);

      return { user: user.toObject(), inviteUrl };
    });

    await sendMemberInvitationMail(
      createdMember.user.emailId,
      createdMember.user.firstName,
      createdMember.inviteUrl
    );

    return filterResponseBody(createdMember, USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

const acceptInvitation = async acceptInvitationData => {
  const session = await mongoose.startSession();
  try {
    const { token, password } = acceptInvitationData;
    const updatedUser = await session.withTransaction(async () => {
      const invitation = await updateInvitation(token);
      const user = await userModel.findOne({
        _id: invitation.userId,
        status: 'INVITED',
      });

      if (!user) {
        throw new AppError('Invalid invitation', STATUS_CODES.BAD_REQUEST);
      }

      const passwordHash = await encryptPassword(password);
      user.passwordHash = passwordHash;
      user.status = 'ACTIVE';
      await user.save({ session });

      invitation.usedAt = new Date();
      await invitation.save({ session });

      return user.toObject();
    });

    return filterResponseBody(updatedUser, USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  getUserProfile,
  getUserProfileByEmail,
  updateUserProfile,
  getRolesCountByUser,
  createMember,
  acceptInvitation,
};
