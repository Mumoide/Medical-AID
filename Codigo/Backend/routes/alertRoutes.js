// alerts.routes.js
const express = require("express");
const router = express.Router();
const { createAlert, getUserAlerts, getAlertsWithReadedCount, updateAlertReadStatus, updateAllAlertsReadStatus } = require("../controllers/AlertController");
const authenticateAdminToken = require('../middleware/authenticateAdminToken'); // Correct path to middleware
const authenticateToken = require('../middleware/authenticateToken');

// Define the POST endpoint to create an alert
router.post("/create", authenticateAdminToken, createAlert);
// Route to retrieve user alerts
router.get('/user-alerts', authenticateToken, getUserAlerts);
// Route to retrieve all alerts
router.get('/all-alerts', authenticateAdminToken, getAlertsWithReadedCount);
// Route to update an alert
router.patch('/update-alert', authenticateToken, updateAlertReadStatus);
// Route to update all alerts
router.patch('/update-all-alerts', authenticateToken, updateAllAlertsReadStatus);

module.exports = router;
