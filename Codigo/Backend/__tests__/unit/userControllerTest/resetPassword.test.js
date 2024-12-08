const { resetPassword } = require('../../../controllers/userController');
const { Users } = require('../../../models');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const nodemailer = require('nodemailer');

// Mocking dependencies
jest.mock('../../../models');
jest.mock('bcryptjs'); // Mock bcryptjs
jest.mock('nodemailer');

describe('resetPassword Controller', () => {
    let req, res, mockUser;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                recoveryCode: '123456',
                newPassword: 'new_secure_password',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockUser = {
            recovery_code: 123456,
            recovery_code_expiration: new Date(Date.now() + 15 * 60 * 1000), // Valid expiration
            update: jest.fn(),
        };

        jest.clearAllMocks();
        bcrypt.genSalt.mockResolvedValue('mockSalt');
        bcrypt.hash.mockResolvedValue('mockHashedPassword');
        nodemailer.createTransport.mockReturnValue({
            sendMail: jest.fn().mockResolvedValue({}),
        });
    });

    it('bcrypt.genSalt mock works', async () => {
        const salt = await bcrypt.genSalt(10);
        expect(salt).toBe('mockSalt');
    });

    it('should reset the password successfully', async () => {
        Users.findOne.mockResolvedValue(mockUser);

        // Mock `Users.update` to resolve successfully
        Users.update = jest.fn().mockResolvedValue([1]); // Sequelize `update` typically returns `[affectedCount]`

        await resetPassword(req, res);

        // Assertions
        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword, 'mockSalt');

        // Verify `Users.update` was called with the correct arguments
        expect(Users.update).toHaveBeenCalledWith(
            {
                password_hash: 'mockHashedPassword',
                recovery_code: null,
                recovery_code_expiration: null,
            },
            { where: { email: req.body.email } } // Ensure `where` clause matches the implementation
        );

        // Verify email was sent
        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful.' });
    });


    it('should return 500 if an error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error.' });
    });

    it('should return 400 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await resetPassword(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 400 if the recovery code is invalid', async () => {
        mockUser.recovery_code = 654321; // Invalid recovery code
        Users.findOne.mockResolvedValue(mockUser);

        await resetPassword(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid recovery code.' });
    });

    it('should return 400 if the recovery code has expired', async () => {
        mockUser.recovery_code_expiration = new Date(Date.now() - 60 * 1000); // Expired recovery code
        Users.findOne.mockResolvedValue(mockUser);

        await resetPassword(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Recovery code has expired.' });
    });
});
