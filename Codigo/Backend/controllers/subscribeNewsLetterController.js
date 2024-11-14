// controllers/newsletterController.js
const { NewsletterSubscribers } = require('../models');

exports.subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email is already subscribed
        const existingSubscriber = await NewsletterSubscribers.findOne({ where: { email } });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Este correo ya está suscrito.' });
        }

        // Add new subscriber
        const newSubscriber = await NewsletterSubscribers.create({
            email,
            subscribed_at: new Date(),
            confirmed: false, // You could add confirmation logic if needed
        });

        res.status(201).json({ message: '¡Suscripción exitosa!', subscriber: newSubscriber });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'Error al suscribirse al boletín informativo.' });
    }
};
