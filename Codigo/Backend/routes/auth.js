const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Ensure this is the correct path to your db.js

const router = express.Router();

router.post('/registerUser', async (req, res) => {
    const { username, password, first_name, last_name, age, gender, height, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, password, first_name, last_name, age, gender, height, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [username, hashedPassword, first_name, last_name, age, gender, height, email]
        );
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
