const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'store_rating',
  password: 'mypassword',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool; 