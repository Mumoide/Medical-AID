// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellidos, fecha_nacimiento, genero, altura, telefono, direccion FROM "Users"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/test', (req, res) => {
  res.send('Admin routes are working');
});

router.get('/test', (req, res) => {
  res.send('Admin routes are working');
});

module.exports = router;
