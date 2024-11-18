const bcrypt = require('bcryptjs');
const { Users, UserProfiles, UserRoles, Roles, Sessions } = require('../models'); // Import UserProfiles model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const nodemailer = require('nodemailer'); // For sending emails
const crypto = require('crypto');
// Define lockout durations based on lockout count

const lockoutDurations = [
  0,
  1 * 60 * 1000, // 1 minute
  5 * 60 * 1000, // 5 minutes
  30 * 60 * 1000, // 30 minutes
  60 * 60 * 1000, // 1 hour
  12 * 60 * 60 * 1000, // 12 hours
];


// Function to validate the form data
const validateForm = (email, password, profile) => {
  if (!profile.birthdate) {
    return { isValid: false, message: "Debe ingresar su fecha de nacimiento." };
  }
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(profile.birthdate).getFullYear();
  const age = currentYear - birthYear;

  const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Regex to allow only letters and spaces
  const numbersRegex = /^[0-9]+$/; // Regex to allow only integer numbers
  const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to allow integers or decimals

  if (!profile.phone_number) {
    return { isValid: false, message: "Debe ingresar un número de teléfono." };
  }

  if (!profile.address) {
    return { isValid: false, message: "Debe ingresar una dirección." };
  }

  if (!profile.comune) {
    return { isValid: false, message: "Debe ingresar una comuna." };
  }
  if (!email) {
    return { isValid: false, message: "Debe ingresar un correo electrónico." };
  }

  if (!profile.names) {
    return { isValid: false, message: "Debe ingresar su nombre." };
  }

  if (profile.names.length > 30 || !lettersRegex.test(profile.names)) {
    return { isValid: false, message: "El nombre no debe tener más de 30 caracteres y solo debe incluir letras." };
  }

  if (!profile.last_names.split(' ')[0]) {
    return { isValid: false, message: "Debe ingresar su apellido paterno." };
  }

  if (!profile.last_names.split(' ')[1]) {
    return { isValid: false, message: "Debe ingresar su apellido materno." };
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
  if (!profile.birthdate) {
    return { isValid: false, message: "Debe ingresar su fecha de nacimiento." };
  }
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(profile.birthdate).getFullYear();
  const age = currentYear - birthYear;

  const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  const numbersRegex = /^[0-9]+$/;
  const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/;

  if (!profile.names) {
    return { isValid: false, message: "Debe ingresar su nombre." };
  }

  if (profile.names.length > 30 || !lettersRegex.test(profile.names)) {
    return { isValid: false, message: "El nombre no debe tener más de 30 caracteres y solo debe incluir letras." };
  }

  if (!profile.last_names) {
    return { isValid: false, message: "Debe ingresar ambos apellidos." };
  }

  if (!profile.last_names.split(' ')[0]) {
    return { isValid: false, message: "Debe ingresar su apellido paterno." };
  }

  if (!profile.last_names.split(' ')[1]) {
    return { isValid: false, message: "Debe ingresar su apellido materno." };
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

  if (!profile.phone_number) {
    return { isValid: false, message: "Debe ingresar un número de teléfono." };
  }

  if (!profile.phone_number || profile.phone_number.length !== 9 || !numbersRegex.test(profile.phone_number)) {
    return { isValid: false, message: "El número de teléfono debe tener 9 dígitos y solo debe incluir números." };
  }

  if (!profile.address) {
    return { isValid: false, message: "Debe ingresar una dirección." };
  }

  if (profile.address.length > 50) {
    return { isValid: false, message: "La dirección no debe tener más de 50 caracteres." };
  }

  if (!profile.comune) {
    return { isValid: false, message: "Debe ingresar una comuna." };
  }

  if (profile.comune.length > 50) {
    return { isValid: false, message: "La comuna no debe tener más de 50 caracteres." };
  }

  if (!email) {
    return { isValid: false, message: "Debe ingresar un correo electrónico." };
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({
      where: { email },
      include: [
        {
          model: UserProfiles,
          as: 'profile',
          attributes: ['names', 'last_names'],
        },
        {
          model: UserRoles,
          as: "roles",
          attributes: ["id_role"],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Check if the user is currently locked out
    const now = new Date();
    if (user.lockout_until && user.lockout_until > now) {
      const minutesLeft = Math.ceil((user.lockout_until - now) / (60 * 1000));
      return res.status(403).json({ error: `Cuenta bloqueada. Intente nuevamente en ${minutesLeft} minutos.` });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Increment failed attempts
      await user.increment('failed_attempts');

      // Lockout logic if failed attempts reach 3
      if (user.failed_attempts >= 3) {
        const lockoutCount = user.lockout_count + 1;
        const lockoutDuration = lockoutDurations[lockoutCount] || lockoutDurations[lockoutDurations.length - 1];
        const lockoutUntil = new Date(now.getTime() + lockoutDuration);

        await user.update({
          failed_attempts: 0,
          lockout_until: lockoutUntil,
          lockout_count: lockoutCount,
        });

        const minutesLocked = Math.ceil(lockoutDuration / (60 * 1000));
        return res.status(403).json({ error: `Cuenta bloqueada por ${minutesLocked} minutos.` });
      } else {
        return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
      }
    }

    // If successful login or lockout has expired over 48 hours, reset failed_attempts, lockout_count, and lockout_until
    const lockoutExpiryPeriod = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    if (isPasswordValid || (user.lockout_until && (now - user.lockout_until) > lockoutExpiryPeriod)) {
      await user.update({
        failed_attempts: 0,
        lockout_count: 0,
        lockout_until: null,
      });
    }

    // Extract role_id
    const roleId = user.roles && user.roles.length > 0 ? user.roles[0].id_role : null;
    // Generate token and store session
    const sessionToken = jwt.sign(
      {
        id_user: user.id_user,
        email: user.email,
        nombre: user.profile ?
          user.profile.names + " " + (user.profile.last_names ? user.profile.last_names.split(" ")[0]
            : "")
          : null,
        role_id: roleId,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000);

    await Sessions.create({
      id_user: user.id_user,
      session_token: sessionToken,
      created_at: now.toISOString(),
      expires_at: expirationTime.toISOString(),
      updated_at: now.toISOString(),
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: sessionToken,
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

exports.changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await Users.findOne({ where: { id_user: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await user.update({ password_hash: hashedPassword });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "An error occurred while changing the password." });
  }
};

exports.sendRecoveryCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Generate a 6-digit code and expiration time
    const recoveryCode = crypto.randomInt(100000, 999999);
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

    // Update user with recovery code and expiration time
    await user.update({ recovery_code: recoveryCode, recovery_code_expiration: expirationTime });

    // Send email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any SMTP provider
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Recovery Code',
      text: `Your password recovery code is: ${recoveryCode}. It is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Recovery code sent to email.' });
  } catch (error) {
    console.error('Error sending recovery code:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.verifyRecoveryCode = async (req, res) => {
  const { email, recoveryCode } = req.body;

  try {
    console.log("Email:", email, "Recovery Code:", recoveryCode);
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Convert the recoveryCode from the request to an integer for comparison
    const recoveryCodeInt = parseInt(recoveryCode, 10);

    // Compare the recovery codes
    if (user.recovery_code !== recoveryCodeInt) {
      return res.status(400).json({ error: 'Invalid recovery code.' });
    }

    // Check if the recovery code has expired
    if (new Date() > user.recovery_code_expiration) {
      return res.status(400).json({ error: 'Recovery code has expired.' });
    }

    res.status(200).json({ message: 'Recovery code verified. Proceed to reset password.' });
  } catch (error) {
    console.error('Error verifying recovery code:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, recoveryCode, newPassword } = req.body;
  console.log(newPassword);

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Ensure recovery code is compared as an integer
    if (parseInt(recoveryCode, 10) !== user.recovery_code) {
      return res.status(400).json({ error: 'Invalid recovery code.' });
    }

    // Check if the recovery code has expired
    if (new Date() > user.recovery_code_expiration) {
      return res.status(400).json({ error: 'Recovery code has expired.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and reset recovery fields
    await Users.update(
      {
        password_hash: hashedPassword,
        recovery_code: null,
        recovery_code_expiration: null,
      },
      {
        where: {

        }
      }
    );

    console.log('Password updated successfully for user:', user.email);

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use 'SMTP' for custom configurations
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email message options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Change Confirmation',
      text: `Hello! Your password has been successfully changed. If you did not make this change, please contact our support immediately.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

