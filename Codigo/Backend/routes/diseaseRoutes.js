const express = require('express');
const router = express.Router();
const { getDiseaseByModelOrder, getAllDiseases } = require('../controllers/DiseaseController.js'); // Import the controller

// Route to get all diseases
router.get('/diseases', getAllDiseases);

// Define the route for fetching disease by model_order
router.get('/:model_order', getDiseaseByModelOrder); // Use the controller function


module.exports = router;
