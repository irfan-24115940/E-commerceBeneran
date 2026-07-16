const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const result = await db.query(
      'SELECT id, key, name, description FROM categories ORDER BY name ASC'
    );
    return success(res, 'Categories fetched', { categories: result.rows });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list };

