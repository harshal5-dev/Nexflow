import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);
