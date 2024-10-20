const bcrypt = require('bcryptjs');
const { Users, UserRoles, UserProfiles, Sessions } = require('../models'); // Import UserProfiles model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Function to validate the form data
const validateForm = (email, password, profile) => {
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(profile.birthdate).getFullYear();
  const age = currentYear - birthYear;

  const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Regex to allow only letters and spaces
  const numbersRegex = /^[0-9]+$/; // Regex to allow only integer numbers
  const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to allow integers or decimals

  if (profile.names.length > 30 || !lettersRegex.test(profile.names)) {
    return { isValid: false, message: "El nombre no debe tener más de 30 caracteres y solo debe incluir letras." };
  }

  if (profile.last_names.split(' ')[0].length > 20 || !lettersRegex.test(profile.last_names.split(' ')[0])) {
    return { isValid: false, message: "El apellido paterno no debe tener más de 20 caracteres y solo debe incluir letras." };
  }

  if (profile.last_names.split(' ')[1].length > 20 || !lettersRegex.test(profile.last_names.split(' ')[1])) {
    return { isValid: false, message: "El apellido materno no debe tener más de 20 caracteres y solo debe incluir letras." };
  }

  if (age > 110) {
    return { isValid: false, message: "La fecha de nacimiento no puede ser mayor de 110 años." };
  }

  if (profile.gender && (!['Masculino', 'Femenino', 'Prefiero no decirlo'].includes(profile.gender))) {
    return { isValid: false, message: "Género inválido." };
  }

  if (profile.height && (!decimalNumbersRegex.test(profile.height) || profile.height < 30 || profile.height > 220)) {
    return { isValid: false, message: "La altura debe estar entre 30 y 220 cm, y solo debe incluir números." };
  }

  if (profile.weight && (!decimalNumbersRegex.test(profile.weight) || profile.weight < 2 || profile.weight > 300)) {
    return { isValid: false, message: "El peso debe estar entre 2 y 300 kg, y solo debe incluir números." };
  }

  if (profile.phone_number.length !== 9 || !numbersRegex.test(profile.phone_number)) {
    return { isValid: false, message: "El número de teléfono debe tener 9 dígitos y solo debe incluir números." };
  }

  if (profile.address.length > 50) {
    return { isValid: false, message: "La dirección no debe tener más de 50 caracteres." };
  }

  if (profile.comune.length > 50) {
    return { isValid: false, message: "La comuna no debe tener más de 50 caracteres." };
  }

  if (email.length > 60) {
    return { isValid: false, message: "El correo no debe tener más de 60 caracteres." };
  }

  if (password.length > 50) {
    return { isValid: false, message: "La contraseña no debe tener más de 50 caracteres." };
  }

  return { isValid: true, message: '' };
};

// Function to create a new user and insert profile data
exports.registerUser = async (req, res) => {
  const { email, password, profile } = req.body;

  try {
    // Validate form data
    const validation = validateForm(email, password, profile);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.message });
    }

    // Check if the email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Correo ya registrado en el sistema.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await Users.create({
      email,
      password_hash,
    });

    // Assign the default "User" role (id_role = 3)
    await UserRoles.create({
      id_user: newUser.id_user, // The id_user of the newly created user
      id_role: 3,               // Assign role id 3 (User)
    });

    // Handle optional fields by replacing empty strings with null
    const height = profile.height ? profile.height : null;
    const weight = profile.weight ? profile.weight : null;
    const gender = profile.gender ? profile.gender : null;

    // Insert user profile data into UserProfiles
    await UserProfiles.create({
      id_user: newUser.id_user, // Use the id_user from the newly created user
      names: profile.names,
      last_names: profile.last_names,
      birthdate: profile.birthdate,
      gender: gender,
      height: height,
      weight: weight,
      phone_number: profile.phone_number,
      address: profile.address,
      comune: profile.comune,
    });

    // Return a success response
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      userId: newUser.id_user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

// Function to handle user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // If credentials are valid, generate a token
    const sessionToken = jwt.sign({ id_user: user.id_user, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Get current time and expiration time as full datetimes
    const now = new Date(); // Current datetime
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour to the current time

    // Store the session in the database with full datetimes
    await Sessions.create({
      id_user: user.id_user,
      session_token: sessionToken,
      created_at: now.toISOString(), // Full datetime for created_at
      expires_at: expirationTime.toISOString(), // Full datetime for expires_at
      updated_at: now.toISOString(), // Full datetime for updated_at
    });

    // Return the token and user information
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: sessionToken, // Return the token
      userId: user.id_user,
      email: user.email,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};



exports.logoutUser = async (req, res) => {
  const token = req.headers['authorization'];

  try {
    // Eliminar la sesión de la base de datos
    await Sessions.destroy({ where: { session_token: token } });

    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
