import mongoose from 'mongoose';

const resetPassword = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usedAt: {
    type: Date,
    default: null,
  },
});
