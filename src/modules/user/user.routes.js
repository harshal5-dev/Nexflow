import { Router } from 'express';
import {
  checkManageMemberPermissions,
  checkGetAllMemberPermissions,
  validateCreateMember,
  validateUpdateMember,
} from './user.middleware.js';
import {
  createMember,
  deleteMember,
  getAllMembers,
  getTeamStates,
  updateMember,
} from './user.service.js';
import { STATUS_CODES } from '../../common/constants.js';
import { sendSuccessResponse } from '../../common/api.response.js';

const router = Router();

router.get('/', checkGetAllMemberPermissions, async (req, res) => {
  try {
    const members = await getAllMembers(req.user._id, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Members retrieved successfully',
      data: members,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/team-states', async (req, res) => {
  try {
    const teamStates = await getTeamStates(req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Team states retrieved successfully',
      data: teamStates,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

router.post(
  '/',
  checkManageMemberPermissions,
  validateCreateMember,
  async (req, res) => {
    try {
      const member = await createMember(req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.CREATED,
        message: 'Member created successfully',
        data: member,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  '/:userId',
  checkManageMemberPermissions,
  validateUpdateMember,
  async (req, res) => {
    try {
      const updatedMember = await updateMember(req.params.userId, req.body);
      return sendSuccessResponse(res, {
        statusCode: STATUS_CODES.OK,
        message: 'Member updated successfully',
        data: updatedMember,
        path: req.originalUrl,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.delete('/:userId', checkManageMemberPermissions, async (req, res) => {
  try {
    const deletedMember = await deleteMember(req.params.userId, req.tenantId);
    return sendSuccessResponse(res, {
      statusCode: STATUS_CODES.OK,
      message: 'Member deleted successfully',
      data: deletedMember,
      path: req.originalUrl,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
