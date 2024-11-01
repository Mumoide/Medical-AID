const { Diagnoses } = require('../models'); // Adjust path if needed

// Controller function to handle saving a diagnosis
exports.createDiagnosis = async (req, res) => {
    const { diagnosisIds, top3, diagnosisData } = req.body;

    // Destructure diagnosisData
    const { userId, timestamp, location, selectedSymptoms } = diagnosisData;
    const { latitude, longitude } = location;

    try {
        // Iterate over each diagnosis in top3 to save multiple records if needed
        for (const diagnosis of top3) {
            const { probability, index: modelOrder } = diagnosis;

            // Create a new diagnosis record
            await Diagnoses.create({
                id_user: userId,
                diagnosis_date: timestamp,
                latitude,
                longitude,
                probability,
                // You may add additional fields as necessary based on your table schema
            });
        }

        res.status(201).json({ message: "Diagnosis data saved successfully" });
    } catch (error) {
        console.error("Error saving diagnosis data:", error);
        res.status(500).json({ error: "Failed to save diagnosis data" });
    }
};
