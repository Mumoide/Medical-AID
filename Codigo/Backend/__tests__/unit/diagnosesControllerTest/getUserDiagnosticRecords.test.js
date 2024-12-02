const { getUserDiagnosticRecords } = require('../../../controllers/DiagnosesController'); // Adjust the path
const { Diagnoses, DiagnosisDisease, Disease, DiagnosisSymptoms, Symptoms } = require('../../../models'); // Adjust paths if needed

// Mock Sequelize models
jest.mock('../../../models', () => ({
    Diagnoses: { findAll: jest.fn() },
    DiagnosisDisease: {},
    Disease: {},
    DiagnosisSymptoms: {},
    Symptoms: {},
}));

describe('getUserDiagnosticRecords Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { userId: 1 }, // Mock request parameter
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return formatted diagnostic records successfully', async () => {
        // Mock data returned by Diagnoses.findAll
        const mockDiagnoses = [
            {
                id_diagnosis: 101,
                id_user: 1,
                diagnosis_date: '2024-11-28T12:00:00Z',
                diagnosisDiseases: [
                    { id_disease: 1, disease: { nombre: 'Disease A' } },
                    { id_disease: 2, disease: { nombre: 'Disease B' } },
                ],
                diagnosisSymptoms: [
                    { id_symptom: 1, symptom: { nombre: 'Symptom A' } },
                    { id_symptom: 2, symptom: { nombre: 'Symptom B' } },
                ],
            },
        ];

        Diagnoses.findAll.mockResolvedValue(mockDiagnoses);

        // Call the function
        await getUserDiagnosticRecords(req, res);

        // Assertions
        expect(Diagnoses.findAll).toHaveBeenCalledWith({
            where: { id_user: 1 },
            attributes: ['id_diagnosis', 'id_user', 'diagnosis_date'],
            include: [
                {
                    model: DiagnosisDisease,
                    as: 'diagnosisDiseases',
                    attributes: ['id_disease', 'id_diagnosis'],
                    include: [
                        {
                            model: Disease,
                            as: 'disease',
                            attributes: ['nombre'],
                        },
                    ],
                },
                {
                    model: DiagnosisSymptoms,
                    as: 'diagnosisSymptoms',
                    attributes: ['id_symptom', 'id_diagnosis'],
                    include: [
                        {
                            model: Symptoms,
                            as: 'symptom',
                            attributes: ['nombre'],
                        },
                    ],
                },
            ],
        });

        const expectedResponse = [
            {
                id_diagnosis: 101,
                id_user: 1,
                diagnosis_date: '2024-11-28T12:00:00Z',
                diseases: [
                    { id_disease: 1, disease_name: 'Disease A' },
                    { id_disease: 2, disease_name: 'Disease B' },
                ],
                symptoms: [
                    { id_symptom: 1, symptom_name: 'Symptom A' },
                    { id_symptom: 2, symptom_name: 'Symptom B' },
                ],
            },
        ];

        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return 500 if an error occurs', async () => {
        Diagnoses.findAll.mockRejectedValue(new Error('Database error'));

        // Call the function
        await getUserDiagnosticRecords(req, res);

        // Assertions
        expect(Diagnoses.findAll).toHaveBeenCalledWith({
            where: { id_user: 1 },
            attributes: ['id_diagnosis', 'id_user', 'diagnosis_date'],
            include: [
                {
                    model: DiagnosisDisease,
                    as: 'diagnosisDiseases',
                    attributes: ['id_disease', 'id_diagnosis'],
                    include: [
                        {
                            model: Disease,
                            as: 'disease',
                            attributes: ['nombre'],
                        },
                    ],
                },
                {
                    model: DiagnosisSymptoms,
                    as: 'diagnosisSymptoms',
                    attributes: ['id_symptom', 'id_diagnosis'],
                    include: [
                        {
                            model: Symptoms,
                            as: 'symptom',
                            attributes: ['nombre'],
                        },
                    ],
                },
            ],
        });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error fetching diagnostic records',
        });
    });
});
