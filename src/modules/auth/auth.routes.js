import express from 'express';

import { getCurrentUserProfile, login, signup } from './auth.service.js';
import { validateLoginUser, validateSignUpUser } from './auth.middleware.js';
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

router.post('/login', validateLoginUser, async (req, res) => {
  try {
    const { token, user } = await login(req.body);

    res.cookie(config.cookies.jwt_token_name, token, {
      secure: config.cookies.secure,
      httpOnly: config.cookies.httpOnly,
      sameSite: config.cookies.sameSite,
      expires: new Date(Date.now() + config.cookies.expiresIn),
    });

    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'User logged in successfully',
      data: { ...user },
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

export default router;
