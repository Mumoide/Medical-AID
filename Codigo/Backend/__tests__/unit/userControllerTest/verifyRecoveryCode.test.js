const { verifyRecoveryCode } = require('../../../controllers/userController');
const { Users } = require('../../../models');

// Mocking dependencies
jest.mock('../../../models');

describe('verifyRecoveryCode Controller', () => {
    let req, res, mockUser;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                recoveryCode: '123456',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockUser = {
            recovery_code: 123456,
            recovery_code_expiration: new Date(Date.now() + 15 * 60 * 1000), // Valid expiration
        };

        jest.clearAllMocks();
    });

    it('should return 400 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await verifyRecoveryCode(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 400 if the recovery code is invalid', async () => {
        mockUser.recovery_code = 654321; // Different recovery code
        Users.findOne.mockResolvedValue(mockUser);

        await verifyRecoveryCode(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid recovery code.' });
    });

    it('should return 400 if the recovery code has expired', async () => {
        mockUser.recovery_code_expiration = new Date(Date.now() - 60 * 1000); // Expired recovery code
        Users.findOne.mockResolvedValue(mockUser);

        await verifyRecoveryCode(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Recovery code has expired.' });
    });

    it('should verify the recovery code successfully', async () => {
        Users.findOne.mockResolvedValue(mockUser);

        await verifyRecoveryCode(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Recovery code verified. Proceed to reset password.' });
    });

    it('should return 500 if an error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await verifyRecoveryCode(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error.' });
    });
});
