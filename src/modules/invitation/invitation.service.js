import crypto from 'crypto';
import invitationModel from './invitation.model.js';
import config from '../../config/index.js';
import AppError from '../../common/AppError.js';
import { STATUS_CODES } from '../../common/constants.js';

const createInvitation = async (userId, session) => {
  try {
    const rawToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    await new invitationModel({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
    }).save({ session });

    const inviteUrl = `${config.frontendUrl}/accept-invite?token=${rawToken}`;

    return inviteUrl;
  } catch (error) {
    throw error;
  }
};

const updateInvitation = async token => {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const invitation = await invitationModel.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      throw new AppError('Invalid token', STATUS_CODES.UNAUTHORIZED);
    }

    return invitation;
  } catch (error) {
    throw error;
  }
};

export { createInvitation, updateInvitation };
