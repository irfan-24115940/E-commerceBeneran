const { ValidationError } = require('../utils/errors');

function requireFields(fields) {
  return (req, res, next) => {
    const missing = [];
    for (const f of fields) {
      if (req.body?.[f] === undefined || req.body?.[f] === null || req.body?.[f] === '') missing.push(f);
    }
    if (missing.length) {
      return next(new ValidationError('Missing required fields', { missing }));
    }
    return next();
  };
}

module.exports = { requireFields };

