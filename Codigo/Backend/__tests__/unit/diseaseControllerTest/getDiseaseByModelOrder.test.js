const { getDiseaseByModelOrder } = require('../../../controllers/DiseaseController'); // Import the controller
const { Disease } = require('../../../models'); // Import the mocked model

// Mock the Disease model
jest.mock('../../../models', () => ({
    Disease: {
        findOne: jest.fn(), // Mock the findOne method
    },
}));

describe('getDiseaseByModelOrder Controller', () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = {
            params: {
                model_order: '1', // Example model_order
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return the disease for a valid model_order', async () => {
        // Mock the database response
        const mockDisease = { id: 1, nombre: 'Flu', model_order: 1 };
        Disease.findOne.mockResolvedValue(mockDisease);

        // Call the controller
        await getDiseaseByModelOrder(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { model_order: 1 },
        });
        expect(res.status).not.toHaveBeenCalledWith(404);
        expect(res.status).not.toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(mockDisease);
    });

    it('should return 404 if no disease is found', async () => {
        // Mock the database response to return null
        Disease.findOne.mockResolvedValue(null);

        // Call the controller
        await getDiseaseByModelOrder(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { model_order: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Disease not found' });
    });

    it('should handle server errors and return 500', async () => {
        // Mock the database to throw an error
        Disease.findOne.mockRejectedValue(new Error('Database error'));

        // Call the controller
        await getDiseaseByModelOrder(req, res);

        // Assertions
        expect(Disease.findOne).toHaveBeenCalledWith({
            where: { model_order: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
});
