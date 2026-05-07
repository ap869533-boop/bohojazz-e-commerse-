const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Abhi@9027',
  database: process.env.DB_NAME || 'bohojazz_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Connected Successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
  });

module.exports = pool;
