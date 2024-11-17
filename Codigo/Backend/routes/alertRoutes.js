// alerts.routes.js
const express = require("express");
const router = express.Router();
const { createAlert } = require("../controllers/AlertController");
const authenticateAdminToken = require('../middleware/authenticateAdminToken'); // Correct path to middleware

// Define the POST endpoint to create an alert
router.post("/create", authenticateAdminToken, createAlert);

module.exports = router;
