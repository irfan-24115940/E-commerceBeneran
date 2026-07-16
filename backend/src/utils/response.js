function success(res, message, data) {
  return res.json({ success: true, message, data: data ?? null });
}

function failure(res, statusCode, message, error = {}) {
  return res.status(statusCode).json({ success: false, message, error });
}

module.exports = { success, failure };

