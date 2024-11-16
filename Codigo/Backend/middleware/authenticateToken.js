const jwt = require('jsonwebtoken');
const { Sessions } = require('../models');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token if it follows "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Access token required' });

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Check if session exists for this token
        const sessionExists = await Sessions.findOne({ where: { session_token: token } });
        if (!sessionExists) {
            return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
        }

        // Refresh token if close to expiration
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = decodedToken.exp - currentTime;

        if (timeRemaining < 5 * 60) { // Less than 5 minutes remaining
            const newToken = jwt.sign(
                { id_user: decodedToken.id_user, email: decodedToken.email },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Update session in database
            await Sessions.update(
                { session_token: newToken, updated_at: new Date() },
                { where: { id_user: decodedToken.id_user } }
            );

            res.setHeader('Authorization', `Bearer ${newToken}`); // Update token header
        }

        req.user = decodedToken; // Attach token data to `req.user`
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        await Sessions.destroy({ where: { session_token: token } }); // End the session in the database
        res.status(403).json({ error: 'Session expired. Please log in again.' });
    }
};

module.exports = authenticateToken;
