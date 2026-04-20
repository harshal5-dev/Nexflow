const sendErrorResponse = (
  res,
  {
    statusCode = 500,
    message = 'Internal Server Error',
    path = '',
    validationErrors = null,
  }
) => {
  res.status(statusCode).json({
    isSuccess: false,
    message,
    path,
    validationErrors,
    timestamp: new Date().toISOString(),
  });
};

const sendSuccessResponse = (
  res,
  { statusCode = 200, message = 'Success', data = null, path = '' }
) => {
  res.status(statusCode).json({
    isSuccess: true,
    message,
    data,
    path,
    timestamp: new Date().toISOString(),
  });
};

export { sendErrorResponse, sendSuccessResponse };
