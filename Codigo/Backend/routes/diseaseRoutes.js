const express = require('express');
const router = express.Router();
const { getDiseaseByName, getDiseaseByModelOrder, getAllDiseases } = require('../controllers/DiseaseController.js'); // Import the controller

// Route to get all diseases
router.get('/diseases', getAllDiseases);

// Define the route for fetching disease by model_order
router.get('/:model_order', getDiseaseByModelOrder); // Use the controller function

// Define the route for fetching disease by name
router.get('/name/:disease_name', getDiseaseByName); // Use the controller function


module.exports = router;
