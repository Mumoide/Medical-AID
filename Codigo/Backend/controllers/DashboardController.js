const { Diagnoses, Disease, DiagnosisDisease, DiagnosisSymptoms, Symptoms } = require('../models');

exports.getAllDiagnoses = async (req, res) => {
    try {
        const diagnoses = await Diagnoses.findAll({
            attributes: ['id_diagnosis', 'id_user', 'diagnosis_date', 'latitude', 'longitude', 'probability'],
            include: [
                {
                    model: DiagnosisDisease,
                    as: 'diagnosisDiseases', // Use the alias defined in initModels
                    attributes: ['id_disease'],
                    include: [
                        {
                            model: Disease,
                            as: 'disease', // Use the alias defined in initModels
                            attributes: ['nombre'], // Disease name
                        }
                    ]
                },
                {
                    model: DiagnosisSymptoms,
                    as: 'diagnosisSymptoms', // Use the alias defined in initModels
                    attributes: ['id_symptom'],
                    include: [
                        {
                            model: Symptoms,
                            as: 'symptom', // Use the alias defined in initModels
                            attributes: ['nombre'], // Symptom name
                        }
                    ]
                }
            ]
        });

        // Filter out diagnoses with no diseases or symptoms and format the response
        const formattedDiagnoses = diagnoses
            .filter(diagnosis => diagnosis.diagnosisDiseases.length > 0 && diagnosis.diagnosisSymptoms.length > 0)
            .map(diagnosis => ({
                id_diagnosis: diagnosis.id_diagnosis,
                id_user: diagnosis.id_user,
                diagnosis_date: diagnosis.diagnosis_date,
                latitude: diagnosis.latitude,
                longitude: diagnosis.longitude,
                probability: diagnosis.probability,
                diseases: diagnosis.diagnosisDiseases.map(d => ({
                    id_disease: d.id_disease,
                    disease_name: d.disease.nombre
                })),
                symptoms: diagnosis.diagnosisSymptoms.map(s => ({
                    id_symptom: s.id_symptom,
                    symptom_name: s.symptom.nombre
                }))
            }));

        res.status(200).json(formattedDiagnoses);
    } catch (error) {
        console.error("Error retrieving diagnoses:", error);
        res.status(500).json({ error: "Failed to retrieve diagnoses data" });
    }
};
