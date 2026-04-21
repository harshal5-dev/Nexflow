class AppError extends Error {
  constructor(message, statusCode, validationErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    this.validationErrors = validationErrors;
  }
}

export default AppError;
