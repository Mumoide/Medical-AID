const express = require('express');
const router = express.Router();
const { getDiseaseByModelOrder, getAllDiseases } = require('../controllers/DiseaseController.js'); // Import the controller


// Define the route for fetching disease by model_order
router.get('/:model_order', getDiseaseByModelOrder); // Use the controller function

// Route to get all diseases
router.get('/diseases', getAllDiseases);

module.exports = router;
