
const pool = require('../db'); // Ensure the correct path to your db file

// Function to create a new user
const createUser = async (username, password, first_name, last_name) => {
    const query = `
        INSERT INTO users (username, password, first_name, last_name)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [username, password, first_name, last_name];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Function to find a user by username
const findUserByUsername = async (username) => {
    const query = `SELECT * FROM users WHERE username = $1;`;
    const values = [username];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = { createUser, findUserByUsername };
