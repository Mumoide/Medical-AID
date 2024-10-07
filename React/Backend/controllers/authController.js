// controllers/authController.js
const { createUser, findUserByUsername } = require('../models/userModel'); // Corrected import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
    const { username, password, nombre, apellidoPaterno, apellidoMaterno, edad, genero, altura, email } = req.body;

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser({
            username,
            password: hashedPassword, 
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            edad,
            genero,
            altura,
            email
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

module.exports = { registerUser, loginUser };
