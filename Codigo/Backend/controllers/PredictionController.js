const axios = require('axios');  // Use axios to call the Python model API

// The function to handle the prediction
const predictProba = async (req, res) => {
    try {
        const inputData = req.body; // The JSON body with 131 boolean fields

        // Validate that the input contains 131 boolean values
        if (Object.keys(inputData).length !== 131) {
            return res.status(400).json({ error: 'Input must contain exactly 131 boolean fields' });
        }

        // Call the Python API with the input data
        const response = await axios.post('http://localhost:5000/predict_proba', inputData);  // Adjust to your Python model's endpoint

        // Send the result back to the client
        const prediction = response.data.prediction;  // Assuming the prediction comes back as `prediction` in the response
        res.status(200).send(`Prediction: ${prediction}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

module.exports = { predictProba };
