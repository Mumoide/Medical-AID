const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/DiagnosesController');

// POST endpoint to create a new diagnosis
router.post('/create', diagnosisController.createDiagnosis);

// Route to get diagnostic records for a specific user
router.get('/diagnostic-records/:userId', diagnosisController.getUserDiagnosticRecords);

module.exports = router;
