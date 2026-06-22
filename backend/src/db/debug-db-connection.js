require('dotenv').config();

const { pool } = require('../utils/db');

(async () => {
  try {
    const r = await pool.query('SELECT 1 AS ok');
    // eslint-disable-next-line no-console
    console.log('DB connection OK:', r.rows[0]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('DB connection FAILED:', e?.message);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
})();

