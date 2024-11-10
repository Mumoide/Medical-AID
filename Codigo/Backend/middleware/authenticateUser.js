// Middleware to authenticate and populate req.user
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token expired or invalid' });
    }
};

module.exports = authenticateUser;
