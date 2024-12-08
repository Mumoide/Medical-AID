// controllers/newsletterController.js
const { NewsletterSubscribers } = require('../models');
const nodemailer = require('nodemailer'); // For sending emails

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

        // Send email (using nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or any SMTP provider
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '¡Gracias por suscribirte a nuestro boletín!', // Subject line
            html: `
                <h1>Bienvenido/a al Boletín Informativo de Medical AID</h1>
                <p>Hola,</p>
                <p>¡Gracias por suscribirte a nuestro boletín informativo! Ahora recibirás noticias, actualizaciones y más directamente en tu correo.</p>
                <p>Si no te suscribiste, por favor ignora este correo.</p>
                <br>
                <p>Equipo de Medical AID</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: '¡Suscripción exitosa!', subscriber: newSubscriber });
    } catch (error) {
        res.status(500).json({ error: 'Error al suscribirse al boletín informativo.' });
    }
};
