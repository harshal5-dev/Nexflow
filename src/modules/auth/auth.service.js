import mongoose from 'mongoose';

import { createUser } from '../user/user.service.js';
import { createTenant } from '../tenant/tenant.service.js';
import { filterResponseBody } from '../../common/utils.js';
import { SIGNUP_RESPONSE_FIELDS } from './auth.constants.js';

const signup = async userPayload => {
  const session = await mongoose.startSession();

  try {
    const transactionResults = await session.withTransaction(async () => {
      const tenantName = `${userPayload.firstName}-organization`;
      const createdTenant = await createTenant(session, { name: tenantName });

      const createdUser = await createUser(session, {
        ...userPayload,
        tenantId: createdTenant._id,
      });
      return { tenantId: createdTenant._id, ...createdUser };
    });

    return filterResponseBody(transactionResults, SIGNUP_RESPONSE_FIELDS);
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export { signup };
