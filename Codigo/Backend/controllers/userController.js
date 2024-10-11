// controllers/userController.js
const pool = require('../db'); // Import the database connection

// Controller function to fetch all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellidos, correo FROM users'); // Adjust columns as needed
    res.json(result.rows); // Send user data as JSON
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = { getAllUsers };
