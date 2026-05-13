import mongoose from 'mongoose';
import tenantPlugin from '../../common/tenantPlugin.js';

const roleSchema = new mongoose.Schema(
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
    code: {
      type: String,
      required: true,
      maxLength: 100,
    },
    scope: {
      type: String,
      enum: ['TENANT', 'PLATFORM'],
      default: 'TENANT',
    },
    permissions: [
      {
        type: String,
        default: [],
      },
    ],
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    },
  },
  { timestamps: true }
);

roleSchema.index({ name: 1, tenantId: 1 }, { unique: true });

roleSchema.plugin(tenantPlugin, {
  requiredTenant: false,

  validateBeforeSave: function (doc) {
    if (doc.scope === 'TENANT' && !doc.tenantId) {
      throw new Error('tenantId is required.');
    }
  },

  buildTenantFilter: function (options) {
    const { tenantId } = options;

    if (tenantId) {
      return { scope: 'TENANT', tenantId };
    }

    return {};
  },
});

export default mongoose.model('Role', roleSchema);
