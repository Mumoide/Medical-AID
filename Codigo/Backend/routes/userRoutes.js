const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import userController

// POST route to register a new user
router.post('/register', userController.registerUser); // Use registerUser method
// Route to handle user login
router.post('/login', userController.loginUser); // Use loginUser method

module.exports = router;
