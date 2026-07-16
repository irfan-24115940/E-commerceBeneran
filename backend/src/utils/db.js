const { Pool } = require('pg');

function createPool() {
  return new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

const pool = createPool();

pool.on('connect', () => {
  console.log('Database Connected');
});

pool.on('error', (err) => {
  console.error('Database Error:', err.message);
});

function attachDb(app) {
  app.set('db', pool);
}

function getDb(req) {
  // created via attachDb
  return req.app.get('db');
}

module.exports = { pool, attachDb, getDb };

