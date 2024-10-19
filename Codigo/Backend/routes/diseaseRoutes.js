const express = require('express');
const router = express.Router();
const { getDiseaseByModelOrder } = require('../controllers/DiseaseController.js'); // Import the controller

// Define the route for fetching disease by model_order
router.get('/:model_order', getDiseaseByModelOrder); // Use the controller function

module.exports = router;
