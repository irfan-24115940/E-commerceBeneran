const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

function mapProduct(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description || '',
    categoryId: Number(row.category_id),
    categoryName: row.category_name || '',
    categoryKey: row.category_key || '',
    image: row.image || '',
    price: Number(row.price || 0),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
    badge: row.badge || '',
    stock: Number(row.stock || 0),
    isActive: row.is_active !== false,
  };
}

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const result = await db.query(`
      SELECT
        p.id, p.title, p.description, p.image, p.price,
        p.rating, p.reviews, p.badge, p.stock, p.is_active,
        p.category_id,
        c.name AS category_name,
        c.key  AS category_key
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
    `);
    return success(res, 'Admin products fetched', {
      products: result.rows.map(mapProduct),
    });
  } catch (e) {
    return next(e);
  }
}

async function create(req, res, next) {
  try {
    const db = getDb(req);
    const { title, description, categoryId, image, price, stock, badge } = req.body;

    if (!title || !price) {
      return res.status(422).json({ success: false, message: 'title and price are required' });
    }

    const result = await db.query(
      `INSERT INTO products (title, description, category_id, image, price, stock, badge, rating, reviews, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, true)
       RETURNING id`,
      [
        title,
        description || '',
        categoryId || null,
        image || '',
        Number(price),
        Number(stock || 0),
        badge || '',
      ]
    );

    const newId = Number(result.rows[0].id);
    // fetch full record
    const full = await db.query(`
      SELECT p.*, c.name AS category_name, c.key AS category_key
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [newId]);

    return res.status(201).json({
      success: true,
      message: 'Product created',
      data: { product: mapProduct(full.rows[0]) },
    });
  } catch (e) {
    return next(e);
  }
}

async function update(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);
    const { title, description, categoryId, image, price, stock, badge } = req.body;

    const result = await db.query(
      `UPDATE products
       SET title=$1, description=$2, category_id=$3, image=$4, price=$5, stock=$6, badge=$7
       WHERE id=$8
       RETURNING id`,
      [
        title,
        description || '',
        categoryId || null,
        image || '',
        Number(price),
        Number(stock || 0),
        badge || '',
        id,
      ]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const full = await db.query(`
      SELECT p.*, c.name AS category_name, c.key AS category_key
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [id]);

    return success(res, 'Product updated', { product: mapProduct(full.rows[0]) });
  } catch (e) {
    return next(e);
  }
}

async function remove(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);
    const result = await db.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return success(res, 'Product deleted', { id });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, create, update, remove };
