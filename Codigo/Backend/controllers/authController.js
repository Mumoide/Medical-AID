// controllers/authController.js
const jwt = require('jsonwebtoken');
const { Sessions } = require('../models');

const refreshToken = async (req, res) => {
    try {
        const newToken = jwt.sign(
            { id_user: req.user.id_user, email: req.user.email, nombre: req.user.nombre, role_id: req.user.role_id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const now = new Date();
        const expirationTime = new Date(now.getTime() + 60 * 60 * 1000);
        await Sessions.update(
            { session_token: newToken, expires_at: expirationTime.toISOString(), updated_at: new Date() },
            { where: { id_user: req.user.id_user } }
        );

        res.json({ newToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: "Failed to refresh token" });
    }
};

module.exports = { refreshToken };
