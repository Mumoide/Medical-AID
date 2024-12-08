// Mock Sequelize model factory
jest.mock('../../models/Symptoms', () => {
    const mockModel = {
        findAll: jest.fn(),
    };
    return () => mockModel; // Return a mock factory
});

const Symptoms = require('../../models/Symptoms')(); // Use the mocked model factory
const { getAllSymptomNames } = require('../../controllers/SymptomsController');

describe('getAllSymptomNames Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // Mock request object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return all symptom names successfully', async () => {
        // Mock data returned by findAll
        const mockSymptoms = [
            { nombre: 'Fever', model_order: 1, grupo_sintomatico: 'General' },
            { nombre: 'Cough', model_order: 2, grupo_sintomatico: 'Respiratory' },
        ];
        Symptoms.findAll.mockResolvedValue(mockSymptoms);

        // Call the function
        await getAllSymptomNames(req, res);

        // Assertions
        expect(Symptoms.findAll).toHaveBeenCalledWith({
            attributes: ['nombre', 'model_order', 'grupo_sintomatico'],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSymptoms);
    });

    it('should handle errors and return a 500 status code', async () => {
        // Mock findAll to throw an error
        Symptoms.findAll.mockRejectedValue(new Error('Database error'));

        // Call the function
        await getAllSymptomNames(req, res);

        // Assertions
        expect(Symptoms.findAll).toHaveBeenCalledWith({
            attributes: ['nombre', 'model_order', 'grupo_sintomatico'],
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while fetching symptom names',
        });
    });
});
