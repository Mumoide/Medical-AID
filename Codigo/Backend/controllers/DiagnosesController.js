const { Diagnoses, Symptoms, DiagnosisSymptoms, DiagnosisDisease } = require('../models'); // Adjust paths if needed

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
        let lastDiagnosis;
        for (const diagnosis of top3) {
            const { probability, index: modelOrder } = diagnosis;

            lastDiagnosis = await Diagnoses.create({
                id_user: userId,
                diagnosis_date: timestamp,
                diagnosis_session_id: diagnosisSessionId,
                latitude,
                longitude,
                probability,
            });
        }

        // Get id_symptom values for each selected symptom by model_order
        const symptomIds = await Symptoms.findAll({
            where: { model_order: selectedSymptoms },
            attributes: ['id_symptom'],
        });

        // Map and insert into DiagnosisSymptoms
        const diagnosisSymptomRecords = symptomIds.map(symptom => ({
            id_diagnosis: lastDiagnosis.id_diagnosis,
            id_symptom: symptom.id_symptom,
        }));

        await DiagnosisSymptoms.bulkCreate(diagnosisSymptomRecords);

        // Associate diseases (diagnosisIds) with the diagnosis
        const diagnosisDiseaseRecords = diagnosisIds.map(id_disease => ({
            id_diagnosis: lastDiagnosis.id_diagnosis,
            id_disease,
        }));

        await DiagnosisDisease.bulkCreate(diagnosisDiseaseRecords);

        res.status(201).json({ message: "Diagnosis data, symptoms, and diseases saved successfully" });
    } catch (error) {
        console.error("Error saving diagnosis data:", error);
        res.status(500).json({ error: "Failed to save diagnosis data" });
    }
};
