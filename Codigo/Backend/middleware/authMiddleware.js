const jwt = require('jsonwebtoken');
const { Sessions } = require('../models');
const secretKey = process.env.SECRET_KEY; // Usa la misma clave secreta para verificar

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Check if the session exists in the database and is valid
        const session = await Sessions.findOne({
            where: {
                session_token: token,
                id_user: decoded.id_user,
            },
        });

        if (!session || new Date() > session.expires_at) {
            return res.status(401).json({ error: 'Token inválido o sesión caducada.' });
        }

        req.user = decoded; // Attach user info to the request
        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido.' });
    }
};

module.exports = authenticateToken;
