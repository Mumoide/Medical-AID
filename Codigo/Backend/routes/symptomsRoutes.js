const express = require('express');
const router = express.Router();
const SymptomsController = require('../controllers/SymptomsController');

// Define the GET route to fetch all symptom names
router.get('/symptoms/names', SymptomsController.getAllSymptomNames);

module.exports = router;
