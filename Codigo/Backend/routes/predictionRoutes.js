const express = require('express');
const router = express.Router();
const PredictionController = require('../controllers/PredictionController');

// Define the POST route for /predict_proba
router.post('/predict_proba', PredictionController.predictProba);

module.exports = router;
