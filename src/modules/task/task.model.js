import mongoose from 'mongoose';
import tenantPlugin from '../../common/tenantPlugin.js';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxLength: 250 },
    description: { type: String, maxLength: 500 },
    status: {
      type: String,
      enum: [
        'TODO',
        'IN_PROGRESS',
        'DONE',
        'CANCELLED',
        'ON_HOLD',
        'COMPLETED',
      ],
      default: 'TODO',
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

TaskSchema.plugin(tenantPlugin);

export default mongoose.model('Task', TaskSchema);
