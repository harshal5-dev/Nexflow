import bcrypt from 'bcrypt';

import userModel from './user.model.js';

const createUser = async (session, userData) => {
  try {
    const { password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.passwordHash = hashedPassword;
    const createdUser = await new userModel(userData).save({ session });
    return createdUser.toObject();
  } catch (error) {
    throw error;
  }
};

export { createUser };
