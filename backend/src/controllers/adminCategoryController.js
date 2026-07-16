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

async function create(req, res, next) {
  try {
    const db = getDb(req);
    const { name, key, description } = req.body;

    if (!name || !key) {
      return res.status(422).json({ success: false, message: 'name and key are required' });
    }

    // Check duplicate key
    const existing = await db.query('SELECT id FROM categories WHERE key = $1', [key]);
    if (existing.rowCount) {
      return res.status(409).json({ success: false, message: 'Category key already exists' });
    }

    const result = await db.query(
      'INSERT INTO categories (key, name, description) VALUES ($1, $2, $3) RETURNING id, key, name, description',
      [key, name, description || '']
    );

    return res.status(201).json({
      success: true,
      message: 'Category created',
      data: { category: result.rows[0] },
    });
  } catch (e) {
    return next(e);
  }
}

async function update(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);
    const { name, key, description } = req.body;

    const result = await db.query(
      'UPDATE categories SET name=$1, key=$2, description=$3 WHERE id=$4 RETURNING id, key, name, description',
      [name, key, description || '', id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return success(res, 'Category updated', { category: result.rows[0] });
  } catch (e) {
    return next(e);
  }
}

async function remove(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);

    // Check if category has products
    const check = await db.query(
      'SELECT COUNT(*) as total FROM products WHERE category_id = $1 AND is_active = true',
      [id]
    );
    const count = parseInt(check.rows[0].total) || 0;
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: category still has ${count} active product(s)`,
      });
    }

    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return success(res, 'Category deleted', { id });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, create, update, remove };
