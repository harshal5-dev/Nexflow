import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    description: {
      type: String,
      maxLength: 250,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Tenant', tenantSchema);
