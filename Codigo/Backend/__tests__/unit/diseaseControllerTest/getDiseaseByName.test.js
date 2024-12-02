const { getDiseaseByName } = require('../../../controllers/DiseaseController'); // Import the controller
const { Disease } = require('../../../models'); // Import the mocked model

// Mock the Disease model
jest.mock('../../../models', () => ({
    Disease: {
        findOne: jest.fn(), // Mock the findOne method
    },
}));

describe('getDiseaseByName Controller', () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = {
            params: { disease_name: 'Flu' }, // Mock URL parameters
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return a disease when it exists', async () => {
        // Mock the database response
        const mockDisease = { id: 1, nombre: 'Flu', model_order: 1 };
        Disease.findOne.mockResolvedValue(mockDisease);

        // Call the controller
        await getDiseaseByName(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { nombre: 'Flu' },
        });
        expect(res.status).not.toHaveBeenCalledWith(404); // Ensure no 404 status is sent
        expect(res.status).not.toHaveBeenCalledWith(500); // Ensure no 500 status is sent
        expect(res.json).toHaveBeenCalledWith(mockDisease); // Ensure the correct data is returned
    });

    it('should return 404 if the disease is not found', async () => {
        // Mock the database to return null
        Disease.findOne.mockResolvedValue(null);

        // Call the controller
        await getDiseaseByName(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { nombre: 'Flu' },
        });
        expect(res.status).toHaveBeenCalledWith(404); // Ensure a 404 status is sent
        expect(res.json).toHaveBeenCalledWith({ error: 'Disease not found' }); // Ensure the error message is sent
    });

    it('should handle errors and return a 500 status code', async () => {
        // Mock the database to throw an error
        Disease.findOne.mockRejectedValue(new Error('Database error'));

        // Call the controller
        await getDiseaseByName(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { nombre: 'Flu' },
        });
        expect(res.status).toHaveBeenCalledWith(500); // Ensure a 500 status is sent
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' }); // Ensure the error message is sent
    });
});
