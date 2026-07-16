const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

const VALID_ROLES = ['customer', 'admin'];

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const result = await db.query(
      `SELECT id, name, email, role, phone, created_at AS "createdAt"
       FROM users
       ORDER BY created_at DESC`
    );
    return success(res, 'Users fetched', {
      users: result.rows.map(u => ({
        id: Number(u.id),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || '',
        createdAt: u.createdAt,
      })),
    });
  } catch (e) {
    return next(e);
  }
}

async function updateRole(req, res, next) {
  try {
    const db = getDb(req);
    const targetId = Number(req.params.id);
    const requesterId = Number(req.auth.userId);
    const { role } = req.body;

    // Admin tidak boleh mengubah role diri sendiri
    if (targetId === requesterId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(422).json({
        success: false,
        message: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}`,
      });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, targetId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return success(res, 'User role updated', { user: result.rows[0] });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, updateRole };
