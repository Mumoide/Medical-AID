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

        await Sessions.update(
            { session_token: newToken, updated_at: new Date() },
            { where: { id_user: req.user.id_user } }
        );

        res.json({ newToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: "Failed to refresh token" });
    }
};

module.exports = { refreshToken };
