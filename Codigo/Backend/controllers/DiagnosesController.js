const { Diagnoses } = require('../models'); // Adjust path if needed

exports.createDiagnosis = async (req, res) => {
    const { diagnosisSessionId, diagnosisIds, top3, diagnosisData } = req.body;
    const { userId, timestamp, location, selectedSymptoms } = diagnosisData;
    const { latitude, longitude } = location;

    try {
        // Check if the diagnosis_session_id already exists
        const existingDiagnosis = await Diagnoses.findOne({
            where: { diagnosis_session_id: diagnosisSessionId },
        });

        if (existingDiagnosis) {
            return res.status(409).json({ message: "Diagnosis already registered for this session." });
        }

        // Save each diagnosis in the top3 if it doesn't already exist
        for (const diagnosis of top3) {
            const { probability, index: modelOrder } = diagnosis;

            await Diagnoses.create({
                id_user: userId,
                diagnosis_date: timestamp,
                diagnosis_session_id: diagnosisSessionId, // Include session ID
                latitude,
                longitude,
                probability,
            });
        }

        res.status(201).json({ message: "Diagnosis data saved successfully" });
    } catch (error) {
        console.error("Error saving diagnosis data:", error);
        res.status(500).json({ error: "Failed to save diagnosis data" });
    }
};
