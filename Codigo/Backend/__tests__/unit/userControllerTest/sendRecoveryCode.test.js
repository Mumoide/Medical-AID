const { sendRecoveryCode } = require('../../../controllers/userController');
const { Users } = require('../../../models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Mocking dependencies
jest.mock('../../../models');
jest.mock('crypto');
jest.mock('nodemailer');

describe('sendRecoveryCode Controller', () => {
    let req, res, mockUser, mockTransporter;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockUser = {
            update: jest.fn(),
        };

        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue({}),
        };

        // Mock dependencies
        Users.findOne = jest.fn();
        crypto.randomInt = jest.fn();
        nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

        jest.clearAllMocks();
    });

    it('should return 404 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await sendRecoveryCode(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should send recovery code successfully', async () => {
        const recoveryCode = 123456;
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

        Users.findOne.mockResolvedValue(mockUser);
        crypto.randomInt.mockReturnValue(recoveryCode);

        await sendRecoveryCode(req, res);

        // Verify user lookup
        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });

        // Verify recovery code generation
        expect(crypto.randomInt).toHaveBeenCalledWith(100000, 999999);

        // Verify user update with recovery code and expiration time
        expect(mockUser.update).toHaveBeenCalledWith({
            recovery_code: recoveryCode,
            recovery_code_expiration: expirationTime,
        });

        // Verify email is sent
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Password Recovery Code',
            text: `Tu código de recuperación de contraseña es: ${recoveryCode}. Es válido por 15 minutes.`,
        });

        // Verify response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Recovery code sent to email.' });
    });

    it('should return 500 if an error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await sendRecoveryCode(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error.' });
    });
});
