import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { AUTH_EXCLUDED_PATHS, STATUS_CODES } from '../common/constants.js';
import config from '../config/index.js';
import AppError from '../common/AppError.js';
import { getUserById } from '../modules/user/user.service.js';
import { filterObjectFields, setUserPermission } from '../common/utils.js';
import {
  AUTH_USER_FIELDS,
  AUTH_USER_ROLE_FIELDS,
} from '../modules/auth/auth.constants.js';
import { getCurrentUserProfile } from '../modules/auth/auth.service.js';

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

const convertTenantId = tenantId => {
  if (!mongoose.isValidObjectId(tenantId)) {
    throw new AppError('Invalid tenant ID', STATUS_CODES.BAD_REQUEST);
  }
  return new mongoose.Types.ObjectId(tenantId);
};

const extractBearerToken = authHeader => {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const [scheme, token, ...extraParts] = authHeader.trim().split(' ');
  if (extraParts.length || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

const getJwtTokenFromRequest = req => {
  const cookieToken = req.cookies?.[config.cookies.jwt_token_name];
  if (cookieToken) {
    return cookieToken;
  }

  return extractBearerToken(req.headers.authorization);
};

const verifyJwtToken = async (req, res, next) => {
  if (req.method === 'OPTIONS' || AUTH_EXCLUDED_PATHS.has(req.path)) {
    return next();
  }

  try {
    const token = getJwtTokenFromRequest(req);

    if (!token) {
      throw new AppError(
        'Unauthorized: No token provided',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const { sub, tenantId } = decoded;

    if (!tenantId) {
      throw new AppError(
        'Unauthorized: Tenant ID not found in token',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const userId = extractSubjectFromToken(sub);

    const user = await getUserById(userId);

    if (!user) {
      throw new AppError(
        'Unauthorized: User not found',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    if (user.status === 'DELETED') {
      throw new AppError(
        'Unauthorized: User not found',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    await user.populate('roles', [...AUTH_USER_ROLE_FIELDS, 'permissions']);
    const userObject = user.toObject();

    const roles = userObject.roles;
    userObject.permissions = setUserPermission(roles);
    userObject.roles = roles.map(role =>
      filterObjectFields(role, AUTH_USER_ROLE_FIELDS)
    );

    req.user = filterObjectFields(userObject, AUTH_USER_FIELDS);
    req.tenantId = convertTenantId(tenantId);
    next();
  } catch (error) {
    throw error;
  }
};

export const checkAuthStatus = async (req, _res, next) => {
  let isAuthenticated = true;
  try {
    const token = getJwtTokenFromRequest(req);

    if (!token) {
      req.isAuthenticated = false;
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const { sub, tenantId } = decoded;

    if (!tenantId) {
      req.isAuthenticated = false;
      return next();
    }

    const userId = extractSubjectFromToken(sub);

    const user = await getCurrentUserProfile(userId);
    req.user = user;
    req.tenantId = tenantId;
  } catch (error) {
    isAuthenticated = false;
  }
  req.isAuthenticated = isAuthenticated;
  next();
};

export default verifyJwtToken;
