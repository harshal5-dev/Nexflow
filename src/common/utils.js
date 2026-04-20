import { flattenError } from 'zod';

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

export { filterRequestBody, filterResponseBody, flattenValidationErrors };
