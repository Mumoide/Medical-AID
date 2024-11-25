const { subscribeNewsletter } = require('../../controllers/subscribeNewsLetterController');
const { NewsletterSubscribers } = require('../../models');
const nodemailer = require('nodemailer');

// Mock Sequelize model
jest.mock('../../models', () => ({
    NewsletterSubscribers: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

// Mock Nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue('Mock email sent'),
    })),
}));

describe('subscribeNewsletter', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { email: 'test@example.com' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should return 400 if the email is already subscribed', async () => {
        // Mock an existing subscriber
        NewsletterSubscribers.findOne.mockResolvedValue({ email: 'test@example.com' });

        await subscribeNewsletter(req, res);

        expect(NewsletterSubscribers.findOne).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Este correo ya está suscrito.' });
    });

    it('should add a new subscriber and send a confirmation email', async () => {
        // Mock no existing subscriber and a successful create operation
        NewsletterSubscribers.findOne.mockResolvedValue(null);
        NewsletterSubscribers.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            subscribed_at: new Date(),
            confirmed: false,
        });

        // Mock Nodemailer transport
        const mockSendMail = jest.fn();
        nodemailer.createTransport.mockReturnValue({
            sendMail: mockSendMail,
        });

        await subscribeNewsletter(req, res);

        expect(NewsletterSubscribers.findOne).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
        expect(NewsletterSubscribers.create).toHaveBeenCalledWith({
            email: 'test@example.com',
            subscribed_at: expect.any(Date),
            confirmed: false,
        });
        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: 'test@example.com',
            subject: '¡Gracias por suscribirte a nuestro boletín!',
            html: expect.any(String),
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: '¡Suscripción exitosa!',
            subscriber: expect.any(Object),
        });
    });

    it('should return 500 if an error occurs', async () => {
        // Mock an error during subscriber creation
        NewsletterSubscribers.findOne.mockRejectedValue(new Error('Database error'));

        await subscribeNewsletter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error al suscribirse al boletín informativo.',
        });
    });
});
