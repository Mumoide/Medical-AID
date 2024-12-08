const { reactivateUser } = require('../../../controllers/userController');
const { Users } = require('../../../models');

jest.mock('../../../models');

describe('reactivateUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id_user: '1' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should return 404 if the user is not found', async () => {
        // Mock the database to return null
        Users.findByPk.mockResolvedValue(null);

        await reactivateUser(req, res);

        expect(Users.findByPk).toHaveBeenCalledWith(req.params.id_user);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should reactivate the user successfully', async () => {
        // Mock the user
        const mockUser = {
            id_user: 1,
            active: false,
            update: jest.fn().mockResolvedValue(),
        };

        // Mock the database to return the mock user
        Users.findByPk.mockResolvedValue(mockUser);

        await reactivateUser(req, res);

        expect(Users.findByPk).toHaveBeenCalledWith(req.params.id_user);
        expect(mockUser.update).toHaveBeenCalledWith({ active: true });
        expect(res.json).toHaveBeenCalledWith({ message: 'User reactivated successfully' });
    });

    it('should return 500 if a server error occurs', async () => {
        // Mock the database to throw an error
        Users.findByPk.mockRejectedValue(new Error('Database error'));

        await reactivateUser(req, res);

        expect(Users.findByPk).toHaveBeenCalledWith(req.params.id_user);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while reactivating the user' });
    });
});
