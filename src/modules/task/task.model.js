import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: [
        'TO_DO',
        'IN_PROGRESS',
        'DONE',
        'CANCELLED',
        'ON_HOLD',
        'COMPLETED',
      ],
      default: 'TO_DO',
    },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Task', TaskSchema);
