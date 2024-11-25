require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,         // Username from .env
    host: process.env.PG_HOST,         // Host from .env
    database: process.env.PG_DATABASE_TEST, // Database name from .env
    password: process.env.PG_PASSWORD, // Password from .env
    port: process.env.PG_PORT,         // Port from .env
});

module.exports = {
    query: (text, params) => pool.query(text, params), // For executing queries
    connect: () => pool.connect(), // For acquiring a client
    end: () => pool.end(),
};
