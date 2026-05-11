import { randomInt } from 'crypto';
import { flattenError } from 'zod';
import bcrypt from 'bcrypt';

const filterRequestBody = (body, allowedFields) => {
  return Object.keys(body)
    .filter(key => allowedFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = body[key];
      return acc;
    }, {});
};

const filterResponseBody = (body, allowedFields) => {
  return Object.keys(body)
    .filter(key => allowedFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = body[key];
      return acc;
    }, {});
};

const flattenValidationErrors = error => {
  const flattened = flattenError(error);
  const formattedErrors = {};

  Object.keys(flattened.fieldErrors).forEach(key => {
    formattedErrors[key] = flattened.fieldErrors[key].map(err => err);
  });
  return formattedErrors;
};

const generate6DigitOTP = () => {
  return randomInt(100000, 1000000).toString().padStart(6, '0');
};

const encryptPassword = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const hasAnyPermission = (userPermissions, requiredPermissions) => {
  return requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  );
};

const setUserPermission = roles => {
  return roles.flatMap(role => role.permissions);
};

const filterObjectFields = (obj, allowedFields) => {
  return Object.keys(obj)
    .filter(key => allowedFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

export {
  filterRequestBody,
  filterResponseBody,
  flattenValidationErrors,
  generate6DigitOTP,
  encryptPassword,
  hasAnyPermission,
  setUserPermission,
  filterObjectFields,
};
