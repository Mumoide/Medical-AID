// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path if db.js is in a different folder
const authenticateToken = require('../middleware/authenticateToken')

// Apply authenticateToken to all routes in this router
router.use(authenticateToken);

// Route to fetch all users
router.get('/admin/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_user AS id, username, email FROM "Users"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Test route to confirm routing
router.get('/admin/test', (req, res) => {
  res.send('Admin routes are working');
});

module.exports = router;
