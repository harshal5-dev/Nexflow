import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 250,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
