import mongoose from 'mongoose';
import tenantPlugin from '../../common/tenantPlugin.js';

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  },
  { timestamps: true }
);

CommentSchema.plugin(tenantPlugin);

export default mongoose.model('Comment', CommentSchema);
