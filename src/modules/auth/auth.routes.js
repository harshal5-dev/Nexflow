import express from 'express';
import { signup } from './auth.service.js';
import { validateSignUpUser } from './auth.middleware.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../common/api.response.js';
import { STATUS_CODES } from '../../common/constants.js';

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
    return sendErrorResponse(res, {
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred during signup',
      path: req.originalUrl,
    });
  }
});

export default router;
