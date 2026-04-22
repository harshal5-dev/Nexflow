import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { STATUS_CODES } from '../common/constants.js';
import config from '../config/index.js';
import AppError from '../common/AppError.js';
import { getUserById } from '../modules/user/user.service.js';
import { filterResponseBody } from '../common/utils.js';
import { AUTH_USER_FIELDS } from '../modules/auth/auth.constants.js';

const EXCLUDED_PATHS = new Set(['/api/v1/auth/login', '/api/v1/auth/signup']);

const extractSubjectFromToken = sub => {
  try {
    if (typeof sub !== 'string') {
      throw new AppError('Invalid token subject', STATUS_CODES.BAD_REQUEST);
    }
    if (!mongoose.isValidObjectId(sub)) {
      throw new AppError('Invalid token subject', STATUS_CODES.BAD_REQUEST);
    }

    return new mongoose.Types.ObjectId(sub);
  } catch (error) {
    throw error;
  }
};

const verifyJwtToken = async (req, res, next) => {
  if (req.method === 'OPTIONS' || EXCLUDED_PATHS.has(req.path)) {
    return next();
  }

  try {
    const cookies = req.cookies;

    const token = cookies[config.cookies.jwt_token_name];

    if (!token) {
      throw new AppError(
        'Unauthorized: No token provided',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const decoded = await jwt.verify(token, config.jwt.secret);
    const { sub, tenantId } = decoded;

    const subject = extractSubjectFromToken(sub);

    const user = await getUserById(subject);

    if (!user) {
      throw new AppError(
        'Unauthorized: User not found',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    req.user = filterResponseBody(user.toObject(), AUTH_USER_FIELDS);
    req.tenantId = tenantId;
    next();
  } catch (error) {
    throw error;
  }
};

export default verifyJwtToken;
