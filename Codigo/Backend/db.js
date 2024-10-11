require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,         // Username from .env
  host: process.env.PG_HOST,         // Host from .env
  database: process.env.PG_DATABASE, // Database name from .env
  password: process.env.PG_PASSWORD, // Password from .env
  port: process.env.PG_PORT,         // Port from .env
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
    release();
  }
});

module.exports = pool;
