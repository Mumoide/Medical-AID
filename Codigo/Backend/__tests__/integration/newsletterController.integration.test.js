const request = require('supertest'); // For making HTTP requests to the app
const app = require('../..//app'); // Import your Express app
const { NewsletterSubscribers } = require('../../models');
const nodemailer = require('nodemailer');

// Mock Nodemailer transport
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue('Mock email sent'),
    })),
}));

describe('Integration Test: subscribeNewsletter', () => {
    let mockSendMail;

    beforeAll(async () => {
        // Initialize the test database (if using SQLite or another setup)
        await NewsletterSubscribers.sync({ force: true }); // Recreate table
        mockSendMail = nodemailer.createTransport().sendMail;
    });

    afterAll(async () => {
        // Cleanup the database after tests
        await NewsletterSubscribers.destroy({ where: {}, truncate: true });
    });

    it('should successfully subscribe a new user and send an email', async () => {
        const response = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email: 'test@example.com' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('¡Suscripción exitosa!');
        expect(response.body.subscriber).toMatchObject({ email: 'test@example.com' });

        // Verify database entry
        const subscriber = await NewsletterSubscribers.findOne({ where: { email: 'test@example.com' } });
        expect(subscriber).not.toBeNull();
        expect(subscriber.email).toBe('test@example.com');

        // Verify email sent
        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: 'test@example.com',
            subject: '¡Gracias por suscribirte a nuestro boletín!',
            html: expect.any(String),
        });
    });

    it('should return 400 for duplicate subscription', async () => {
        // Add a subscriber to simulate a duplicate
        await NewsletterSubscribers.create({ email: 'duplicate@example.com', subscribed_at: new Date() });

        const response = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email: 'duplicate@example.com' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Este correo ya está suscrito.');
    });

    it('should return 500 if there is a server error', async () => {
        // Mock an error in the database
        jest.spyOn(NewsletterSubscribers, 'create').mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email: 'error@example.com' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error al suscribirse al boletín informativo.');

        // Restore the mocked method
        jest.spyOn(NewsletterSubscribers, 'create').mockRestore();
    });
});
