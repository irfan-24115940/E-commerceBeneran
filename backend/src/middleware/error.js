function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Not Found',
    error: { code: 'NOT_FOUND' },
  });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    success: false,
    message,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' ? { details: err.details } : {}),
    },
  });
}

module.exports = { notFoundHandler, errorHandler };

