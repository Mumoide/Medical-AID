// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // Username from pgAdmin
  host: 'localhost',          // Host from pgAdmin
  database: 'MedicalAidDB',    // Database name from pgAdmin
  password: '202020',   // Replace with your actual password
  port: 5433,                  // Port from pgAdmin (5433)
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
