import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import config from '../../config/index.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
      default: '',
    },
    emailId: {
      type: String,
      required: true,
      unique: [true, 'Email ID already exists, please use a different email'],
      maxLength: 150,
    },
    passwordHash: {
      type: String,
      required: true,
      maxLength: 250,
    },
    profilePictureUrl: {
      type: String,
      maxLength: 2500,
      default: '',
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    roleIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;
  const token = await jwt.sign({ tenantId: user.tenantId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    subject: user._id.toString(),
    issuer: config.jwt.issuer,
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.passwordHash);
};

export default mongoose.model('User', userSchema);
