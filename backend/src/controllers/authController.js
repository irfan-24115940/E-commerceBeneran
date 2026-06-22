const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getDb } = require('../utils/db');
const { ConflictError, ValidationError, UnauthorizedError } = require('../utils/errors');
const { success } = require('../utils/response');

async function register(req, res, next) {
  console.log('Register Request Received');
  try {
    const db = getDb(req);
    
    const { name, email, password } = req.body;
    console.log('User Data:', { name, email });

    // Validate name
    if (String(name).length < 3) {
      throw new ValidationError('Name too short', { minLength: 3 });
    }

    const normalizedEmail = String(email).toLowerCase();
    console.log('📌 Normalized email:', normalizedEmail);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new ValidationError('Invalid email format');
    }

    // Check if email exists
    console.log('Existing Email Check');
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    console.log('📌 Existing email check result:', existing.rows.length, 'row(s)');
    if (existing.rows.length) throw new ConflictError('Email already registered');

    if (String(password).length < 6) {
      throw new ValidationError('Password too short', { minLength: 6 });
    }

    console.log('📌 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('📌 Password hashed successfully');

    const role = 'customer';

    console.log('📌 Executing INSERT INTO users...');
    const inserted = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
      [name, normalizedEmail, passwordHash, role]
    );
    
    console.log('✅ INSERT RESULT:');
    console.log('   Rows affected:', inserted.rowCount);
    console.log('   Returned data:', JSON.stringify(inserted.rows, null, 2));

    const user = inserted.rows[0];
    console.log('Insert Success');

    // Create token
    console.log('📌 Creating JWT token...');
    const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      subject: String(user.id),
    });
    console.log('✅ Token created successfully');

    return success(res, 'Register success', { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    console.log('Insert Failed');
    return next(e);
  }
}

async function login(req, res, next) {
  console.log('Login Request Received');
  try {
    const db = getDb(req);
    const { email, password } = req.body;

    const normalizedEmail = String(email).toLowerCase();

    const found = await db.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (!found.rows.length) throw new UnauthorizedError('Invalid credentials');
    
    console.log('User Found');
    const user = found.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    
    if (!ok) {
      console.log('Password Failed');
      throw new UnauthorizedError('Invalid credentials');
    }
    
    console.log('Password Match');

    const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      subject: String(user.id),
    });
    console.log('Token Generated');

    return success(res, 'Login success', {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    return next(e);
  }
}

async function getProfile(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows.length) {
      const err = new Error('User not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    return success(res, 'User profile fetched', { user: result.rows[0] });
  } catch (e) {
    return next(e);
  }
}

module.exports = { register, login, getProfile };

