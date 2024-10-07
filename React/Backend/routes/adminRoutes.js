const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import your database connection

// Route to fetch all users
router.get('/admin/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellidos, correo FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
