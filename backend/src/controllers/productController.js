const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

function mapProduct(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description || '',
    category: row.category_key || 'uncategorized',
    image: row.image || '',
    price: Number(row.price || 0),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
    badge: row.badge || '',
    stock: Number(row.stock || 0),
  };
}

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const { category, q, limit = 50 } = req.query;

    const where = ['p.is_active = true'];
    const params = [];

    if (category) {
      params.push(category);
      where.push(`c.key = $${params.length}`);
    }

    if (q) {
      params.push(`%${q}%`);
      where.push(`
        (
          p.title ILIKE $${params.length}
          OR p.description ILIKE $${params.length}
        )
      `);
    }

    params.push(Number(limit));

    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        c.key AS category_key,
        p.image,
        p.price,
        p.rating,
        p.reviews,
        p.badge,
        p.stock
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(' AND ')}
      ORDER BY p.id DESC
      LIMIT $${params.length}
    `;

    const result = await db.query(sql, params);

    console.log('PRODUCTS FOUND:', result.rows.length);

    return success(res, 'Products fetched', {
      products: result.rows.map(mapProduct),
    });
  } catch (error) {
    console.error('LIST PRODUCTS ERROR:', error);
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id',
      });
    }

    const result = await db.query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        c.key AS category_key,
        p.image,
        p.price,
        p.rating,
        p.reviews,
        p.badge,
        p.stock
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
        AND p.is_active = true
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: {
          code: 'NOT_FOUND',
        },
      });
    }

    return success(res, 'Product fetched', {
      product: mapProduct(result.rows[0]),
    });
  } catch (error) {
    console.error('GET PRODUCT ERROR:', error);
    return next(error);
  }
}

module.exports = {
  list,
  getById,
};