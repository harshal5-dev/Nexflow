import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
    },
    description: {
      type: String,
      maxLength: 250,
      default: '',
    },
    code: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
    },
    scope: {
      type: String,
      enum: ['TENANT', 'PLATFORM'],
      default: 'TENANT',
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
