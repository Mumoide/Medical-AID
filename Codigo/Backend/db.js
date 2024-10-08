const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MedicalAidDB', 
  password: '202020',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
      return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});
module.exports = pool;
