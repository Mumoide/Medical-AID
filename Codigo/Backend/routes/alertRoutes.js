// alerts.routes.js
const express = require("express");
const router = express.Router();
const { createAlert, getUserAlerts, getAlertsWithReadedCount } = require("../controllers/AlertController");
const authenticateAdminToken = require('../middleware/authenticateAdminToken'); // Correct path to middleware
const authenticateToken = require('../middleware/authenticateToken');

// Define the POST endpoint to create an alert
router.post("/create", authenticateAdminToken, createAlert);
// Route to retrieve user alerts
router.get('/user-alerts', authenticateToken, getUserAlerts);
// Route to retrieve all alerts
router.get('/all-alerts', authenticateAdminToken, getAlertsWithReadedCount);

module.exports = router;
