import express from 'express';

import {
  sendResetPasswordOTP,
  signin,
  signup,
  updateCurrentUserProfile,
  verifyResetPassword,
} from './auth.service.js';
import {
  validateAcceptInvitation,
  validateForgotPassword,
  validateLoginUser,
  validateResetPassword,
  validateSignUpUser,
  validateUpdateProfile,
} from './auth.middleware.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';
import AppError from '../../common/AppError.js';
import config from '../../config/index.js';
import { checkAuthStatus } from '../../middlewares/verifyJwtToken.middleware.js';
import { acceptInvitation } from '../user/user.service.js';

const router = express.Router();

router.post('/signup', validateSignUpUser, async (req, res) => {
  try {
    const userData = req.body;

    const newUser = await signup(userData);

    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.CREATED,
      message: 'User signed up successfully',
      data: newUser,
      path: req.originalUrl,
    });
  } catch (error) {
    throw new AppError(
      error.message || 'An error occurred during signup',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
});

router.post('/signin', validateLoginUser, async (req, res) => {
  try {
    const { token, user } = await signin(req.body);

    res.cookie(config.cookies.jwt_token_name, token, {
      secure: config.cookies.secure,
      httpOnly: config.cookies.httpOnly,
      sameSite: config.cookies.sameSite,
      expires: new Date(Date.now() + config.cookies.expiresIn),
    });

    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'User signed in successfully',
      data: { token, user, isAuthenticated: true },
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/forgot-password', validateForgotPassword, async (req, res) => {
  try {
    await sendResetPasswordOTP(req.body.emailId);

    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Reset password OTP has been sent to the provided email.',
      data: null,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/reset-password', validateResetPassword, async (req, res) => {
  try {
    await verifyResetPassword(req.body);

    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Password has been reset successfully.',
      data: null,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/me', checkAuthStatus, async (req, res) => {
  const user = req.user ? req.user : null;
  const isAuthenticated = req.isAuthenticated;
  const message = isAuthenticated
    ? 'User details fetched successfully'
    : 'User not authenticated';

  return sendSuccessResponse(res, {
    statusCode: STATUS_CODES.SUCCESS,
    message,
    data: { isAuthenticated, user },
    path: req.originalUrl,
  });
});

router.put('/update', validateUpdateProfile, async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedUser = await updateCurrentUserProfile(_id, req.body);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.SUCCESS,
      message: 'User profile updated successfully',
      data: updatedUser,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/signout', (req, res) => {
  res.clearCookie(config.cookies.jwt_token_name, {
    secure: config.cookies.secure,
    httpOnly: config.cookies.httpOnly,
    sameSite: config.cookies.sameSite,
  });

  return sendSuccessResponse(res, {
    statusCode: STATUS_CODES.OK,
    message: 'User signed out successfully',
    data: null,
    path: req.originalUrl,
  });
});

router.post(
  '/accept-invitation',
  validateAcceptInvitation,
  async (req, res) => {
    try {
      const user = await acceptInvitation(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.OK,
        message: 'Invitation accepted successfully',
        path: req.originalUrl,
        data: user,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
