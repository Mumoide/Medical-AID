const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure this points to your Sequelize config
const Symptoms = require('../models/Symptoms')(sequelize, DataTypes); // Import the model correctly

// Function to get all symptom names
const getAllSymptomNames = async (req, res) => {
    try {
        // Fetch all the symptoms from the database, selecting only the 'name' field
        const symptoms = await Symptoms.findAll({
            attributes: ['nombre', 'model_order', 'grupo_sintomatico'], // Select only the 'name' field
        });

        // Send the result as a JSON response
        res.status(200).json(symptoms);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching symptom names:', error);
        res.status(500).json({ error: 'An error occurred while fetching symptom names' });
    }
};

module.exports = {
    getAllSymptomNames,
};
