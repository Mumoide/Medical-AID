const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/DiagnosesController');
const authenticateToken = require('../middleware/authenticateToken'); // Correct path to middleware

// POST endpoint to create a new diagnosis
router.post('/create', authenticateToken, diagnosisController.createDiagnosis);

// Route to get diagnostic records for a specific user
router.get('/diagnostic-records/:userId', authenticateToken, diagnosisController.getUserDiagnosticRecords);

module.exports = router;
