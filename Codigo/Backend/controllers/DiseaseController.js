const { Disease } = require('../models'); // Import the Disease model

// Controller function to fetch disease by model_order
const getDiseaseByModelOrder = async (req, res) => {
    const modelOrder = parseInt(req.params.model_order, 10); // Get the model_order from the URL parameters

    try {
        const disease = await Disease.findOne({
            where: { model_order: modelOrder }, // Find disease by model_order
        });

        if (disease) {
            res.json(disease); // Return the disease information as JSON
        } else {
            res.status(404).json({ error: 'Disease not found' });
        }
    } catch (error) {
        console.error('Error fetching disease:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to fetch all diseases
const getAllDiseases = async (req, res) => {
    try {
        const diseases = await Disease.findAll(); // Fetch all diseases from the database
        res.json(diseases); // Return the list of diseases as JSON
    } catch (error) {
        console.error('Error fetching diseases:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to fetch disease by name
const getDiseaseByName = async (req, res) => {
    const disease_name = req.params.disease_name; // Get the disease name from the URL parameters

    try {
        const disease = await Disease.findOne({
            where: { nombre: disease_name }, // Find disease by name
        });

        if (disease) {
            res.json(disease); // Return the disease information as JSON
        } else {
            res.status(404).json({ error: 'Disease not found' });
        }
    } catch (error) {
        console.error('Error fetching disease:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getDiseaseByName, getDiseaseByModelOrder, getAllDiseases }; // Export the controller function
