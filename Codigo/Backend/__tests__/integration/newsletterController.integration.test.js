const request = require('supertest'); // For making HTTP requests to the app
const app = require('../../indextest'); // Import your Express app
const { NewsletterSubscribers } = require('../../models');
const nodemailer = require('nodemailer');
const db = require('../../dbtest'); // Import the modified db.js


// Mock Nodemailer transport
jest.mock('nodemailer', () => {
    const sendMailMock = jest.fn().mockResolvedValue('Mock email sent');
    return {
        createTransport: jest.fn(() => ({
            sendMail: sendMailMock,
        })),
        sendMailMock, // Export the mock for easier verification
    };
});


describe('Integration Test: subscribeNewsletter', () => {
    let client;
    let mockSendMail;

    beforeAll(async () => {
        // Explicitly connect to the database
        client = await db.connect();
        console.log('Connected to the test database');
        // Initialize the test database (if using SQLite or another setup)
        await NewsletterSubscribers.sync({ force: true }); // Recreate table
        mockSendMail = nodemailer.createTransport().sendMail;
    });

    afterAll(async () => {
        try {
            // Cleanup the database
            if (client) {
                client.release();
                console.log('Database client released');
            }
            if (db.end) {
                await db.end(); // Ensure the pool is closed
                console.log('Database connection pool closed');
            }
            if (NewsletterSubscribers.sequelize) {
                await NewsletterSubscribers.sequelize.close(); // Close Sequelize connection
                console.log('Sequelize connection closed');
            }
            if (app && app.server) {
                await app.server.close(); // Close the server if it's running
                console.log('Server closed');
            }
        } catch (error) {
            console.error('Error during teardown:', error);
            throw error;
        }
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
        expect(nodemailer.createTransport).toHaveBeenCalled();
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
