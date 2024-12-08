const { getAllDiseases } = require('../../../controllers/DiseaseController'); // Import the controller
const { Disease } = require('../../../models'); // Import the mocked model

// Mock the Disease model
jest.mock('../../../models', () => ({
    Disease: {
        findAll: jest.fn(), // Mock the findAll method
    },
}));

describe('getAllDiseases Controller', () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return all diseases successfully', async () => {
        // Mock the database response
        const mockDiseases = [
            { id: 1, nombre: 'Flu', model_order: 1 },
            { id: 2, nombre: 'Cold', model_order: 2 },
        ];
        Disease.findAll.mockResolvedValue(mockDiseases);

        // Call the controller
        await getAllDiseases(req, res);

        // Assertions
        expect(Disease.findAll).toHaveBeenCalledTimes(1); // Ensure findAll was called once
        expect(res.status).not.toHaveBeenCalledWith(500); // Ensure no error status was sent
        expect(res.json).toHaveBeenCalledWith(mockDiseases); // Ensure the correct data is sent as JSON
    });

    it('should handle errors and return a 500 status code', async () => {
        // Mock the database to throw an error
        Disease.findAll.mockRejectedValue(new Error('Database error'));

        // Call the controller
        await getAllDiseases(req, res);

        // Assertions
        expect(Disease.findAll).toHaveBeenCalledTimes(1); // Ensure findAll was called once
        expect(res.status).toHaveBeenCalledWith(500); // Ensure a 500 status was sent
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' }); // Ensure the error message is sent
    });
});
