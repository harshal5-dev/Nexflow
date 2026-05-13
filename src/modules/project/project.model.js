import mongoose from 'mongoose';
import tenantPlugin from '../../common/tenantPlugin.js';
import '../task/task.model.js';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxLength: 255 },
    description: { type: String, maxLength: 500 },
    status: {
      type: String,
      enum: [
        'IN_PROGRESS',
        'COMPLETED',
        'ARCHIVED',
        'CANCELLED',
        'ON_HOLD',
        'REVIEW',
      ],
      default: 'IN_PROGRESS',
    },
    dueDate: { type: Date, required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

projectSchema.plugin(tenantPlugin);

export default mongoose.model('Project', projectSchema);
