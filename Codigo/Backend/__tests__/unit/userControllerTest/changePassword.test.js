const { changePassword } = require('../../../controllers/userController');
const { Users } = require('../../../models');
const bcrypt = require('bcryptjs'); // Use bcryptjs

// Mock dependencies
jest.mock('../../../models');
jest.mock('bcryptjs');

describe('changePassword Controller', () => {
    let req, res, mockUser;

    beforeEach(() => {
        req = {
            body: {
                newPassword: 'new_secure_password',
            },
            user: {
                id_user: 1, // Simulated logged-in user ID
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockUser = {
            update: jest.fn(),
        };

        jest.clearAllMocks();
        bcrypt.genSalt.mockResolvedValue('mockSalt');
        bcrypt.hash.mockResolvedValue('mockHashedPassword');
    });

    it('should change the password successfully', async () => {
        // Mock the user is found
        Users.findOne.mockResolvedValue(mockUser);

        // Call the function
        await changePassword(req, res);

        // Verify findOne is called with correct arguments
        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id_user } });

        // Verify bcrypt methods are called
        expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword, 'mockSalt');

        // Verify update is called with hashed password
        expect(mockUser.update).toHaveBeenCalledWith({ password_hash: 'mockHashedPassword' });

        // Verify successful response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully.' });
    });

    it('should return 404 if the user is not found', async () => {
        // Mock no user is found
        Users.findOne.mockResolvedValue(null);

        // Call the function
        await changePassword(req, res);

        // Verify findOne is called
        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id_user } });

        // Verify 404 response
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 500 if an error occurs', async () => {
        // Mock findOne to throw an error
        Users.findOne.mockRejectedValue(new Error('Database error'));

        // Call the function
        await changePassword(req, res);

        // Verify 500 response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while changing the password.' });
    });
});
