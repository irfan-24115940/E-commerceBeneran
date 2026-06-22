require('dotenv').config();

const { pool } = require('./src/utils/db');

(async () => {
  try {
    console.log('📊 Checking users table...\n');
    
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC LIMIT 10'
    );
    
    console.log(`Total users: ${result.rows.length}\n`);
    console.log('Recent users:');
    console.table(result.rows);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
})();
