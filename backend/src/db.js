const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT 1').then(
  () => console.log('PostgreSQL connected'),
  (error) => console.error('DB connection failed:', error.message)
);

module.exports = pool;