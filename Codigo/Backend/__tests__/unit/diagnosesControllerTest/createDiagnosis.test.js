const { createDiagnosis } = require('../../../controllers/DiagnosesController'); // Adjust path as needed
const {
    Diagnoses,
    Disease,
    Symptoms,
    DiagnosisSymptoms,
    DiagnosisDisease,
} = require('../../../models'); // Import mocked models

jest.mock('../../../models', () => ({
    Diagnoses: { findOne: jest.fn(), create: jest.fn() },
    Disease: {},
    Symptoms: { findAll: jest.fn() },
    DiagnosisSymptoms: { bulkCreate: jest.fn() },
    DiagnosisDisease: { bulkCreate: jest.fn() },
}));

describe('createDiagnosis Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                diagnosisSessionId: 'session123',
                diagnosisIds: [1, 2],
                top3: [
                    { probability: 0.9, index: 1 },
                    { probability: 0.8, index: 2 },
                ],
                diagnosisData: {
                    userId: 1,
                    timestamp: new Date().toISOString(),
                    location: { latitude: 10.0, longitude: 20.0 },
                    selectedSymptoms: [1, 2],
                },
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should successfully create a new diagnosis', async () => {
        Diagnoses.findOne.mockResolvedValue(null); // No existing diagnosis
        Diagnoses.create.mockResolvedValue({ id_diagnosis: 123 }); // Mock created diagnosis
        Symptoms.findAll.mockResolvedValue([
            { id_symptom: 1 },
            { id_symptom: 2 },
        ]);
        DiagnosisSymptoms.bulkCreate.mockResolvedValue();
        DiagnosisDisease.bulkCreate.mockResolvedValue();

        // Call the function
        await createDiagnosis(req, res);

        // Assertions
        expect(Diagnoses.findOne).toHaveBeenCalledWith({
            where: { diagnosis_session_id: 'session123' },
        });
        expect(Diagnoses.create).toHaveBeenCalledTimes(2); // Called for each top3 diagnosis
        expect(Symptoms.findAll).toHaveBeenCalledWith({
            where: { model_order: [1, 2] },
            attributes: ['id_symptom'],
        });
        expect(DiagnosisSymptoms.bulkCreate).toHaveBeenCalledWith([
            { id_diagnosis: 123, id_symptom: 1 },
            { id_diagnosis: 123, id_symptom: 2 },
        ]);
        expect(DiagnosisDisease.bulkCreate).toHaveBeenCalledWith([
            { id_diagnosis: 123, id_disease: 1 },
            { id_diagnosis: 123, id_disease: 2 },
        ]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Diagnosis data, symptoms, and diseases saved successfully',
        });
    });

    it('should return 409 if the diagnosis session already exists', async () => {
        Diagnoses.findOne.mockResolvedValue({ id_diagnosis: 123 }); // Mock existing diagnosis

        // Call the function
        await createDiagnosis(req, res);

        // Assertions
        expect(Diagnoses.findOne).toHaveBeenCalledWith({
            where: { diagnosis_session_id: 'session123' },
        });
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Diagnosis already registered for this session.',
        });
    });

    it('should handle errors and return a 500 status code', async () => {
        Diagnoses.findOne.mockRejectedValue(new Error('Database error')); // Mock database error

        // Call the function
        await createDiagnosis(req, res);

        // Assertions
        expect(Diagnoses.findOne).toHaveBeenCalledWith({
            where: { diagnosis_session_id: 'session123' },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Failed to save diagnosis data',
        });
    });
});
