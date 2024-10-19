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

module.exports = { getDiseaseByModelOrder }; // Export the controller function
