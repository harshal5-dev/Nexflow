import { Error } from 'mongoose';

function tenantPlugin(schema, options = {}) {
  const {
    requiredTenant = true,
    validateBeforeSave,
    buildTenantFilter,
  } = options;

  schema.pre('save', function () {
    if (requiredTenant && !this.tenantId) {
      throw new Error('tenantId is required');
    }

    if (typeof validateBeforeSave === 'function') {
      const error = validateBeforeSave(this);

      if (error) {
        throw error;
      }
    }
  });

  const queryMiddlewares = [
    'find',
    'findOne',
    'countDocuments',
    'findOneAndUpdate',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
  ];

  queryMiddlewares.forEach(middleware => {
    schema.pre(middleware, function () {
      const options = this.getOptions();

      if (options.skipTenantFilter === true) {
        return;
      }

      if (typeof buildTenantFilter === 'function') {
        const customFilter = buildTenantFilter(options);

        if (!customFilter || typeof customFilter !== 'object') {
          throw new Error('buildTenantFilter must return an object');
        }

        this.where(customFilter);
        return;
      }

      if (!options.tenantId) {
        throw new Error('tenantId is required');
      }

      this.where({
        tenantId: options.tenantId,
      });
    });
  });
}

export default tenantPlugin;
