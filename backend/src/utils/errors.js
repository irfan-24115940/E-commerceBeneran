class AppError extends Error {
  constructor(message, { statusCode = 400, code = 'BAD_REQUEST', details } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, { statusCode: 422, code: 'VALIDATION_ERROR', details });
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, { statusCode: 401, code: 'UNAUTHORIZED' });
  }
}

class ConflictError extends AppError {
  constructor(message, details) {
    super(message, { statusCode: 409, code: 'CONFLICT', details });
  }
}

module.exports = { AppError, ValidationError, UnauthorizedError, ConflictError };

