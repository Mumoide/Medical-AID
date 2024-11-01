const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/DiagnosesController');

// POST endpoint to create a new diagnosis
router.post('/create', diagnosisController.createDiagnosis);

module.exports = router;
