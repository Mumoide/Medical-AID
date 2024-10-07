const express = require('express');
const router = express.Router();
const { createUser } = require('../models/userModel'); // Ensure the path is correct

// Register Route
router.post('/register', async (req, res) => {
  const { nombre, apellidos, fechaNacimiento, genero, altura, telefono, direccion, comuna, correo, contrasena } = req.body;

  try {
    const newUser = await createUser(
      nombre, apellidos, fechaNacimiento, genero, altura, telefono, direccion, comuna, correo, contrasena
    );
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

module.exports = router;
