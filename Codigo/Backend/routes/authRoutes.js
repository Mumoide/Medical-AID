const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { refreshToken } = require('../controllers/authController'); // Import the controller function

router.get('/refresh-token', authenticateToken, refreshToken);

module.exports = router;
