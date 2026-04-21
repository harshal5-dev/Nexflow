import { sendErrorResponse } from '../common/api.response.js';

const errorHandlerMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const validationErrors = err.validationErrors || null;

  return sendErrorResponse(res, {
    statusCode,
    message,
    path: req.originalUrl,
    validationErrors,
  });
};

export default errorHandlerMiddleware;
