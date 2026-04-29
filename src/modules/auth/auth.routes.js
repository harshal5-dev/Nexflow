import express from 'express';

import {
  getCurrentUserProfile,
  sendResetPasswordOTP,
  signin,
  signup,
  verifyResetPassword,
} from './auth.service.js';
import {
  validateForgotPassword,
  validateLoginUser,
  validateResetPassword,
  validateSignUpUser,
} from './auth.middleware.js';
import { sendSuccessResponse } from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';
import AppError from '../../common/AppError.js';
import config from '../../config/index.js';

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
      data: { ...user },
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/is-authenticated', (req, res) => {
  const user = req.user;
  const isAuthenticated = !!user;

  return sendSuccessResponse(res, {
    statusCode: STATUS_CODES.OK,
    message: 'User is authenticated',
    data: isAuthenticated ? { isAuthenticated, ...user } : null,
    path: req.originalUrl,
  });
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

router.get('/me', async (req, res) => {
  const userId = req.user._id;

  const user = await getCurrentUserProfile(userId);

  return sendSuccessResponse(res, {
    statusCode: STATUS_CODES.SUCCESS,
    message: 'User details fetched successfully',
    data: user,
    path: req.originalUrl,
  });
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

export default router;
