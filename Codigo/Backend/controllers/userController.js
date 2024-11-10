const bcrypt = require('bcryptjs');
const { Users, UserProfiles, UserRoles, Roles, Sessions } = require('../models'); // Import UserProfiles model
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

const validateProfileForm = (email, profile) => {
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(profile.birthdate).getFullYear();
  const age = currentYear - birthYear;

  const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  const numbersRegex = /^[0-9]+$/;
  const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/;

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

  if (profile.gender && !["Masculino", "Femenino", "Prefiero no decirlo"].includes(profile.gender)) {
    return { isValid: false, message: "Género inválido." };
  }

  if (profile.height && (!decimalNumbersRegex.test(profile.height) || profile.height < 30 || profile.height > 220)) {
    return { isValid: false, message: "La altura debe estar entre 30 y 220 cm, y solo debe incluir números." };
  }

  if (profile.weight && (!decimalNumbersRegex.test(profile.weight) || profile.weight < 2 || profile.weight > 300)) {
    return { isValid: false, message: "El peso debe estar entre 2 y 300 kg, y solo debe incluir números." };
  }

  if (!profile.phone_number || profile.phone_number.length !== 9 || !numbersRegex.test(profile.phone_number)) {
    return { isValid: false, message: "El número de teléfono debe tener 9 dígitos y solo debe incluir números." };
  }

  if (!profile.address || profile.address.length > 50) {
    return { isValid: false, message: "La dirección no debe tener más de 50 caracteres." };
  }

  if (!profile.comune || profile.comune.length > 50) {
    return { isValid: false, message: "La comuna no debe tener más de 50 caracteres." };
  }

  if (email.length > 60) {
    return { isValid: false, message: "El correo no debe tener más de 60 caracteres." };
  }

  return { isValid: true, message: "" };
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
    // Check if the user with the given email exists, including UserProfiles
    const user = await Users.findOne({
      where: { email },
      include: [
        {
          model: UserProfiles,
          as: 'profile', // Use the alias specified in your association
          attributes: ['names', 'last_names'], // Retrieve only the 'names' field
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Check if the user is active
    if (!user.active) {
      return res.status(403).json({ error: 'Cuenta desactivada. Contacte al administrador.' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generate a token
    const sessionToken = jwt.sign(
      { id_user: user.id_user, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

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

    // Return the token, user ID, email, and user's 'names'
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: sessionToken, // Return the token
      userId: user.id_user,
      email: user.email,
      nombre: user.profile
        ? user.profile.names + " " + (user.profile.last_names ? user.profile.last_names.split(" ")[0] : "")
        : null,
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


exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id_user', 'email', 'created_at', 'active'],
      include: [
        {
          model: UserProfiles,
          as: 'profile', // Alias for the association
          attributes: ['names', 'last_names'],
        },
        {
          model: UserRoles,
          as: 'roles', // Alias for UserRoles
          attributes: ['id_role'],
          include: [
            {
              model: Roles,
              as: 'role', // Alias for Roles
              attributes: ['role_name'],
            },
          ],
        },
      ],
      logging: console.log, // Logs the SQL query to the console
    });


    // Send the result back to the client
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};


// Function to register an admin user
exports.registerAdmin = async (req, res) => {
  const { email, password, profile } = req.body;

  try {
    // Validate form data (reuse the existing validateForm function)
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

    // Assign the "Admin" role (id_role = 2)
    await UserRoles.create({
      id_user: newUser.id_user, // The id_user of the newly created user
      id_role: 2,               // Assign role id 2 (Admin)
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
      message: 'Admin registrado con éxito',
      userId: newUser.id_user,
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

// Function to logically delete a user by setting 'active' to 0
exports.deleteUser = async (req, res) => {
  const { id_user } = req.params; // Extract the id_user from the request params

  try {
    // Find the user by id
    const user = await Users.findOne({ where: { id_user } });

    // If the user does not exist, return an error response
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Perform a logical deletion by updating the 'active' column
    await Users.update(
      { active: 0 }, // Set the 'active' column to 0
      { where: { id_user } } // Where condition to find the user
    );

    // Return a success response
    return res.status(200).json({ message: 'Usuario eliminado lógicamente con éxito.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

// Function to fetch all user data by user_id
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by id with related profile and roles data
    const user = await Users.findOne({
      where: { id_user: userId },
      include: [
        {
          model: UserProfiles,
          as: 'profile', // Alias set in the Users model
          attributes: [
            'names',
            'last_names',
            'birthdate',
            'weight',
            'height',
            'gender',
            'address',
            'comune',
            'phone_number',
          ], // Select specific fields from the UserProfiles table
        },
        {
          model: UserRoles,
          as: 'roles', // Alias set in the Users model
          include: [
            {
              model: Roles,
              as: 'role', // Alias set in the UserRoles model
              attributes: ['role_name'], // Select specific fields from the Roles table
            },
          ],
        },
      ],
      attributes: ['id_user', 'email', 'active'], // Select specific fields from the Users table
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    email,
    profile: { names, last_names, birthdate, gender, height, weight, phone_number, address, comune },
    role,
  } = req.body;

  try {
    // Fetch user to update
    const user = await Users.findOne({ where: { id_user: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate and fetch role ID based on the provided role name
    const validRoles = ["Admin", "User"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    const roleRecord = await Roles.findOne({ where: { role_name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: "Role not found." });
    }

    // Update user details
    await user.update({ email });

    // Fetch or create UserProfile
    let userProfile = await UserProfiles.findOne({ where: { id_user: userId } });
    if (userProfile) {
      // Update UserProfile if it exists
      await userProfile.update({
        names,
        last_names,
        birthdate,
        gender,
        height,
        weight,
        phone_number,
        address,
        comune,
      });
    } else {
      // Create UserProfile if it doesn’t exist
      userProfile = await UserProfiles.create({
        id_user: userId,
        names,
        last_names,
        birthdate,
        gender,
        height,
        weight,
        phone_number,
        address,
        comune,
      });
    }

    // Fetch or create UserRole
    let userRole = await UserRoles.findOne({ where: { id_user: userId } });
    if (userRole) {
      // Update UserRole if it’s different
      if (userRole.id_role !== roleRecord.id_role) {
        await userRole.update({ id_role: roleRecord.id_role });
      }
    } else {
      // Create UserRole if it doesn’t exist
      userRole = await UserRoles.create({
        id_user: userId,
        id_role: roleRecord.id_role,
      });
    }

    res.json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

exports.reactivateUser = async (req, res) => {
  const userId = req.params.id_user;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ active: true });
    res.json({ message: "User reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating user:", error);
    res.status(500).json({ error: "An error occurred while reactivating the user" });
  }
};

// Define the updateProfile function
exports.updateProfile = async (req, res) => {
  console.log("Request body:", req.body);
  const userId = req.user.id_user; // Use the authenticated user's ID
  const {
    email,
    profile: { names, last_names, birthdate, gender, height, weight, phone_number, address, comune },
  } = req.body;

  const validation = validateProfileForm(email, { names, last_names, birthdate, gender, height, weight, phone_number, address, comune });
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    // Fetch user to update
    const user = await Users.findOne({ where: { id_user: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the new email already exists in the database for a different user
    if (email && email !== user.email) {
      const emailExists = await Users.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use by another account." });
      }
    }

    // Update user email if it has changed and passes uniqueness check
    if (email) {
      await user.update({ email });
    }

    // Fetch or create UserProfile
    let userProfile = await UserProfiles.findOne({ where: { id_user: userId } });
    if (userProfile) {
      // Update existing UserProfile
      await userProfile.update({
        names,
        last_names,
        birthdate,
        gender,
        height,
        weight,
        phone_number,
        address,
        comune,
      });
    } else {
      // Create UserProfile if it doesn’t exist
      await UserProfiles.create({
        id_user: userId,
        names,
        last_names,
        birthdate,
        gender,
        height,
        weight,
        phone_number,
        address,
        comune,
      });
    }

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "An error occurred while updating the profile." });
  }
};
