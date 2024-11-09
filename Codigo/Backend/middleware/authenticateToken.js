const jwt = require('jsonwebtoken');
const { Sessions } = require('../models');

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: 'Access token required' });

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Check expiration time
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeRemaining = decodedToken.exp - currentTime;

        // If the token is close to expiring (e.g., 5 minutes left), refresh it
        if (timeRemaining < 5 * 60) { // Less than 5 minutes remaining
            const newToken = jwt.sign(
                { id_user: decodedToken.id_user, email: decodedToken.email },
                process.env.SECRET_KEY,
                { expiresIn: '1h' } // New token with 1 hour expiration
            );

            // Update session in the database
            await Sessions.update(
                { session_token: newToken, updated_at: new Date() },
                { where: { id_user: decodedToken.id_user } }
            );

            // Set new token in response header for client to update
            res.setHeader('Authorization', newToken);
        }

        req.user = decodedToken; // Attach the token data to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle token expiration or other errors
        console.error('Token verification failed:', error);
        await Sessions.destroy({ where: { session_token: token } }); // End the session in the database
        res.status(403).json({ error: 'Session expired. Please log in again.' });
    }
};

module.exports = authenticateToken;
