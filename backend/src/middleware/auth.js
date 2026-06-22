const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedError('Missing token');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: payload.sub, role: payload.role || 'customer' };
    return next();
  } catch (e) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

function roleAllowed(...roles) {
  return (req, res, next) => {
    if (!req.auth) return next(new UnauthorizedError('Missing auth'));
    if (!roles.includes(req.auth.role)) {
      return next(Object.assign(new Error('Forbidden'), { statusCode: 403, code: 'FORBIDDEN' }));
    }
    return next();
  };
}

module.exports = { authRequired, roleAllowed };

