import mongoose from 'mongoose';
import userModel from './user.model.js';
import AppError from '../../common/AppError.js';
import { PERMISSIONS_LIST, STATUS_CODES } from '../../common/constants.js';
import {
  USER_RESPONSE_FIELDS,
  USER_ROLE_FIELDS,
  USER_TENANT_FIELDS,
} from './user.constants.js';
import {
  encryptPassword,
  filterObjectFields,
  filterResponseBody,
  setUserPermission,
} from '../../common/utils.js';
import { getTenantById } from '../tenant/tenant.service.js';
import { sendEmail } from '../../common/mailer.js';
import {
  createInvitation,
  updateInvitation,
} from '../invitation/invitation.service.js';
import { countRoles } from '../role/role.service.js';

const createUser = async (session, userData) => {
  try {
    const { password } = userData;
    userData.passwordHash = await encryptPassword(password);
    userData.status = 'ACTIVE';
    userData.type = 'PLATFORM';
    const createdUser = await new userModel(userData).save({ session });
    return createdUser.toObject();
  } catch (error) {
    throw error;
  }
};

const getAllMembers = async (userId, tenantId) => {
  const users = await userModel
    .find({
      _id: { $ne: userId },
      type: 'TENANT',
      status: { $ne: 'DELETED' },
    })
    .setOptions({ tenantId })
    .populate('roles', USER_ROLE_FIELDS);

  const userList = users.map(user =>
    filterResponseBody(user.toObject(), USER_RESPONSE_FIELDS)
  );

  return userList;
};

const getUserByEmail = async emailId => {
  try {
    const user = await userModel.findOne({ emailId }).setOptions({
      skipTenantFilter: true,
    });
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

const getUserById = async userId => {
  try {
    const user = await userModel.findById(userId).setOptions({
      skipTenantFilter: true,
    });
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

const getUserProfileByEmail = async emailId => {
  try {
    const user = await userModel
      .findOne({ emailId })
      .setOptions({ skipTenantFilter: true })
      .populate('roles', [...USER_ROLE_FIELDS, 'permissions']);

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
      .setOptions({ skipTenantFilter: true })
      .populate('roles', [...USER_ROLE_FIELDS, 'permissions']);
    if (!user) {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    if (user.status === 'DELETED') {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    const userObj = user.toObject();
    const roles = userObj.roles;

    userObj.tenant = await getTenantById(userObj.tenantId, USER_TENANT_FIELDS);
    userObj.permissions = setUserPermission(roles);
    userObj.roles = roles.map(role =>
      filterObjectFields(role, USER_ROLE_FIELDS)
    );

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
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, profileData, {
        returnDocument: 'after',
      })
      .setOptions({ skipTenantFilter: true });
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

const updateMember = async (userId, updateData) => {
  try {
    const user = await userModel
      .findOneAndUpdate({ _id: userId }, updateData, {
        returnDocument: 'after',
      })
      .setOptions({ tenantId: updateData.tenantId });
    return filterResponseBody(user.toObject(), USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  }
};

const acceptInvitation = async acceptInvitationData => {
  const session = await mongoose.startSession();
  try {
    const { token, password } = acceptInvitationData;
    const updatedUser = await session.withTransaction(async () => {
      const invitation = await updateInvitation(token);
      const user = await userModel
        .findOne({
          _id: invitation.userId,
          status: 'INVITED',
        })
        .setOptions({ skipTenantFilter: true });

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

const deleteMember = async (userId, tenantId) => {
  try {
    const user = await userModel
      .findOneAndUpdate(
        { _id: userId, tenantId },
        { status: 'DELETED' },
        {
          returnDocument: 'after',
        }
      )
      .setOptions({ tenantId });
    return filterResponseBody(user.toObject(), USER_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  }
};

const countUsers = async (tenantId, isMultiRole = false) => {
  try {
    const filter = {
      type: 'TENANT',
      status: { $ne: 'DELETED' },
    };

    if (isMultiRole) {
      filter['roles.1'] = { $exists: true };
    }

    const count = await userModel.countDocuments(filter).setOptions({
      tenantId,
    });
    return count;
  } catch (error) {
    throw error;
  }
};

const getTeamStates = async tenantId => {
  try {
    const states = {};
    const totalUsers = await countUsers(tenantId);
    const totalRoles = await countRoles(tenantId);
    const totalPermissions = PERMISSIONS_LIST.length;
    const totalMultiRoleMembers = await countUsers(tenantId, true);

    states.totalUsers = totalUsers;
    states.totalRoles = totalRoles;
    states.totalPermissions = totalPermissions;
    states.totalMultiRoleMembers = totalMultiRoleMembers;

    return states;
  } catch (error) {
    throw error;
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
  getAllMembers,
  updateMember,
  deleteMember,
  getTeamStates,
};
